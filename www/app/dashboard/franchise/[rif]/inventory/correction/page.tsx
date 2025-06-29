"use client";

import {
  mdiPencil,
  mdiPlus,
  mdiMinus,
  mdiContentSave,
  mdiInformation,
} from "@mdi/js";
import Button from "../../../../../_components/Button";
import Divider from "../../../../../_components/Divider";
import CardBox from "../../../../../_components/CardBox";
import SectionMain from "../../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../../_components/Section/TitleLineWithButton";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
  CodigoProducto: number;
  NombreProducto: string;
  Cantidad: number;
  Precio: number;
  Categoria: string;
}

interface CorrectionItem {
  CodigoProducto: number;
  NombreProducto: string;
  CantidadActual: number;
  CantidadAjuste: number;
  TipoAjuste: 'incremento' | 'decremento';
  Comentario: string;
}

export default function InventoryCorrectionPage() {
  const params = useParams();
  const router = useRouter();
  const rif = params?.rif as string;
  const [franchise, setFranchise] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [correctionItems, setCorrectionItems] = useState<CorrectionItem[]>([]);
  const [correctedProducts, setCorrectedProducts] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (rif) {
      fetchFranchiseInfo();
      fetchProducts();
    }
  }, [rif]);

  const fetchFranchiseInfo = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/franchise/${rif}`);
      if (!res.ok) throw new Error("Error cargando información de la franquicia");
      const data = await res.json();
      setFranchise(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/product_franchise/franchise/${rif}`);
      if (!res.ok) throw new Error("Error cargando productos de la franquicia");
      const data = await res.json();
      setProducts(data);
      
      // Check correction status for all products
      await checkAllProductsCorrectionStatus(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkAllProductsCorrectionStatus = async (productsList: Product[]) => {
    const correctedSet = new Set<number>();
    
    for (const product of productsList) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/correction/check/${rif}/${product.CodigoProducto}`);
        if (res.ok) {
          const data = await res.json();
          if (data.exists) {
            correctedSet.add(product.CodigoProducto);
          }
        }
      } catch (err) {
        console.error(`Error checking product ${product.CodigoProducto}:`, err);
      }
    }
    
    setCorrectedProducts(correctedSet);
  };

  const addProductToCorrection = () => {
    const newItem: CorrectionItem = {
      CodigoProducto: 0,
      NombreProducto: "",
      CantidadActual: 0,
      CantidadAjuste: 0,
      TipoAjuste: 'incremento',
      Comentario: "",
    };
    setCorrectionItems([...correctionItems, newItem]);
  };

  const removeProductFromCorrection = (index: number) => {
    setCorrectionItems(correctionItems.filter((_, i) => i !== index));
  };

  const updateCorrectionItem = (index: number, field: keyof CorrectionItem, value: any) => {
    const updatedItems = [...correctionItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // If product is selected, update product info
    if (field === 'CodigoProducto') {
      const selectedProduct = products.find(p => p.CodigoProducto === value);
      if (selectedProduct) {
        updatedItems[index].NombreProducto = selectedProduct.NombreProducto;
        updatedItems[index].CantidadActual = selectedProduct.Cantidad;
        
        // Check if product has already been corrected this month
        checkProductCorrectionStatus(value);
      }
    }

    setCorrectionItems(updatedItems);
  };

  const checkProductCorrectionStatus = async (codigoProducto: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/correction/check/${rif}/${codigoProducto}`);
      if (!res.ok) throw new Error("Error verificando estado de corrección");
      
      const data = await res.json();
      if (data.exists) {
        // Add to corrected products set
        setCorrectedProducts(prev => new Set(prev).add(codigoProducto));
        alert(`Este producto ya ha sido corregido ${data.count} vez(es) en ${data.month}/${data.year}. No se puede corregir nuevamente en el mismo mes.`);
        // Remove the product from correction items
        setCorrectionItems(prev => prev.filter(item => item.CodigoProducto !== codigoProducto));
      }
    } catch (err) {
      console.error("Error checking correction status:", err);
    }
  };

  const isProductCorrected = (codigoProducto: number) => {
    return correctedProducts.has(codigoProducto);
  };

  const calculateTotalAdjustments = () => {
    return correctionItems.reduce((total, item) => {
      const adjustment = item.TipoAjuste === 'incremento' ? item.CantidadAjuste : -item.CantidadAjuste;
      return total + adjustment;
    }, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const handleSubmit = async () => {
    if (correctionItems.length === 0) {
      alert("Por favor agregue al menos un producto para corregir");
      return;
    }

    setSaving(true);
    try {
      // Create corrections for each item
      for (const item of correctionItems) {
        const correctionData = {
          FranquiciaRIF: rif,
          CodigoProducto: item.CodigoProducto,
          Cantidad: item.CantidadAjuste,
          TipoAjuste: item.TipoAjuste === 'incremento' ? 'Faltante' : 'Sobrante',
          Comentario: item.Comentario
        };

        const res = await fetch('http://127.0.0.1:8000/correction/create_with_inventory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(correctionData),
        });

        if (!res.ok) throw new Error("Error creando corrección");
      }

      alert("Correcciones aplicadas exitosamente");
      router.push(`/dashboard/franchise/${rif}/inventory`);
    } catch (err) {
      console.error("Error:", err);
      alert("Error al aplicar las correcciones");
    } finally {
      setSaving(false);
    }
  };

  if (!franchise) {
    return (
      <SectionMain>
        <div className="text-center">
          <p>Cargando información de la franquicia...</p>
        </div>
      </SectionMain>
    );
  }

  if (loading) {
    return (
      <SectionMain>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </SectionMain>
    );
  }

  return (
    <>
      <SectionMain>
        <div className="max-w-6xl mx-auto">
          <SectionTitleLineWithButton
            icon={mdiPencil}
            title={`Corrección de Inventario - ${franchise.Nombre}`}
            main
          >
            <Button
              href={`/dashboard/franchise/${rif}/inventory`}
              color="info"
              label="Volver"
              roundedFull
            />
          </SectionTitleLineWithButton>

          <Divider />

          {/* Información de la Corrección */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <CardBox className="bg-white shadow-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <i className="mdi mdi-information text-blue-600 mr-2"></i>
                  Información de la Corrección
                </h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Nota:</strong> Las correcciones se aplicarán inmediatamente al inventario de la franquicia.
                    </p>
                    {correctedProducts.size > 0 && (
                      <p className="text-sm text-orange-800 mt-2">
                        <strong>Productos ya corregidos este mes:</strong> {correctedProducts.size} de {products.length} productos
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardBox>

            <CardBox className="bg-white shadow-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <i className="mdi mdi-calculator text-blue-600 mr-2"></i>
                  Resumen de la Corrección
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total de Productos:</span>
                    <span className="font-semibold">{correctionItems.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ajuste Total:</span>
                    <span className={`text-2xl font-bold ${calculateTotalAdjustments() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {calculateTotalAdjustments() >= 0 ? '+' : ''}{calculateTotalAdjustments()}
                    </span>
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={saving || correctionItems.length === 0}
                    color="success"
                    icon={mdiContentSave}
                    label={saving ? "Aplicando..." : "Aplicar Correcciones"}
                    className="w-full"
                  />
                </div>
              </div>
            </CardBox>
          </div>

          {/* Productos a Corregir */}
          <CardBox className="bg-white shadow-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <i className="mdi mdi-pencil text-blue-600 mr-2"></i>
                  Productos a Corregir
                </h3>
                <Button
                  onClick={addProductToCorrection}
                  color="success"
                  outline
                  icon={mdiPlus}
                  label="Agregar Producto"
                />
              </div>

              {correctionItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay productos agregados para corregir
                </div>
              ) : (
                <div className="space-y-4">
                  {correctionItems.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Producto *
                          </label>
                          <select
                            value={item.CodigoProducto}
                            onChange={(e) => updateCorrectionItem(index, 'CodigoProducto', parseInt(e.target.value))}
                            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                          >
                            <option value={0}>Seleccione un producto</option>
                            {products.map((product) => (
                              <option 
                                key={product.CodigoProducto} 
                                value={product.CodigoProducto}
                                disabled={isProductCorrected(product.CodigoProducto)}
                              >
                                {product.NombreProducto} - {product.Categoria}
                                {isProductCorrected(product.CodigoProducto) && ' (Ya corregido este mes)'}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cantidad Actual
                          </label>
                          <div className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                            {item.CantidadActual}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Ajuste
                          </label>
                          <select
                            value={item.TipoAjuste}
                            onChange={(e) => updateCorrectionItem(index, 'TipoAjuste', e.target.value as 'incremento' | 'decremento')}
                            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                          >
                            <option value="incremento">Incremento (+)</option>
                            <option value="decremento">Decremento (-)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cantidad de Ajuste
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.CantidadAjuste}
                            onChange={(e) => updateCorrectionItem(index, 'CantidadAjuste', parseInt(e.target.value))}
                            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cantidad Final
                          </label>
                          <div className={`w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-gray-50 font-semibold ${
                            item.TipoAjuste === 'incremento' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.TipoAjuste === 'incremento' 
                              ? item.CantidadActual + item.CantidadAjuste 
                              : item.CantidadActual - item.CantidadAjuste}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Comentario
                          </label>
                          <input
                            type="text"
                            value={item.Comentario}
                            onChange={(e) => updateCorrectionItem(index, 'Comentario', e.target.value)}
                            placeholder="Motivo del ajuste..."
                            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <Button
                            onClick={() => removeProductFromCorrection(index)}
                            color="danger"
                            outline
                            icon={mdiMinus}
                            small
                            label="Eliminar"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardBox>
        </div>
      </SectionMain>
    </>
  );
} 