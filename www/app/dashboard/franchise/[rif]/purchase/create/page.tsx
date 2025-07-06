"use client";

import {
  mdiPackage,
  mdiPlus,
  mdiMinus,
  mdiTrashCan,
  mdiContentSave,
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
  DescripcionProducto?: string;
  Categoria: string;
  PrecioActual?: number;
  Cantidad?: number;
  CantidadMinima?: number;
  CantidadMaxima?: number;
}

interface Supplier {
  RIF: string;
  RazonSocial: string;
  PersonaContacto: string;
  TelefonoLocal: string;
}

interface PurchaseItem {
  CodigoProducto: number;
  NombreProducto: string;
  Categoria: string;
  CantidadPedida: number;
  CantidadDisponible: number;
  Monto: number;
}

export default function CreatePurchasePage() {
  const params = useParams();
  const router = useRouter();
  const rif = params?.rif as string;
  const [franchise, setFranchise] = useState<any>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [purchaseDate, setPurchaseDate] = useState<string>("");
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [purchaseErrors, setPurchaseErrors] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (rif) {
      fetchFranchiseInfo();
      fetchSuppliers();
      fetchProducts();
      setPurchaseDate(new Date().toISOString().split('T')[0]);
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

  const fetchSuppliers = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/vendor`);
      if (!res.ok) throw new Error("Error cargando proveedores");
      const data = await res.json();
      setSuppliers(data);
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
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addProductToPurchase = () => {
    const newItem: PurchaseItem = {
      CodigoProducto: 0,
      NombreProducto: "",
      Categoria: "",
      CantidadPedida: 1,
      CantidadDisponible: 1,
      Monto: 0,
    };
    setPurchaseItems([...purchaseItems, newItem]);
  };

  const removeProductFromPurchase = (index: number) => {
    setPurchaseItems(purchaseItems.filter((_, i) => i !== index));
  };

  const updatePurchaseItem = (index: number, field: keyof PurchaseItem, value: any) => {
    const updatedItems = [...purchaseItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // If product is selected, update product info
    if (field === 'CodigoProducto') {
      const selectedProduct = products.find(p => p.CodigoProducto === value);
      if (selectedProduct) {
        updatedItems[index].NombreProducto = selectedProduct.NombreProducto;
        updatedItems[index].Categoria = selectedProduct.Categoria;
      }
    }

    // Validación: CantidadPedida no puede ser mayor que CantidadDisponible
    const errors = { ...purchaseErrors };
    const item = updatedItems[index];
    if (
      typeof item.CantidadPedida === 'number' &&
      typeof item.CantidadDisponible === 'number' &&
      item.CantidadPedida > item.CantidadDisponible
    ) {
      errors[index] = 'La cantidad pedida no puede superar la cantidad disponible';
    } else {
      delete errors[index];
    }
    setPurchaseErrors(errors);

    setPurchaseItems(updatedItems);
  };

  const calculateTotal = () => {
    return purchaseItems.reduce((total, item) => total + item.Monto, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const handleSubmit = async () => {
    if (!selectedSupplier || purchaseItems.length === 0) {
      alert("Por favor complete todos los campos requeridos");
      return;
    }

    setSaving(true);
    try {
      // Prepare purchase data for the new endpoint
      const purchaseData = {
        Fecha: purchaseDate,
        ProveedorRIF: selectedSupplier,
        items: purchaseItems.map(item => ({
          CodigoProducto: item.CodigoProducto,
          CantidadPedida: item.CantidadPedida,
          CantidadDisponible: item.CantidadDisponible,
          Monto: item.Monto,
          FranquiciaRIF: rif
        }))
      };

      const purchaseRes = await fetch(`http://127.0.0.1:8000/purchase/create_with_inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
      });

      if (!purchaseRes.ok) throw new Error("Error creando la compra");
      const purchaseResult = await purchaseRes.json();

      alert("Compra creada exitosamente");
      router.push(`/dashboard/franchise/${rif}/revenue`);
    } catch (err) {
      console.error("Error:", err);
      alert("Error al crear la compra");
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
            icon={mdiPackage}
            title={`Crear Nueva Compra - ${franchise.Nombre}`}
            main
          >
            <Button
              href={`/dashboard/franchise/${rif}`}
              color="info"
              label="Volver"
              roundedFull
            />
          </SectionTitleLineWithButton>

          <Divider />

          {/* Información de la Compra */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <CardBox className="bg-white shadow-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <i className="mdi mdi-information text-blue-600 mr-2"></i>
                  Información de la Compra
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Compra
                    </label>
                    <input
                      type="date"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proveedor *
                    </label>
                    <select
                      value={selectedSupplier}
                      onChange={(e) => setSelectedSupplier(e.target.value)}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Seleccione un proveedor</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.RIF} value={supplier.RIF}>
                          {supplier.RazonSocial} - {supplier.RIF}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedSupplier && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Contacto:</strong> {suppliers.find(s => s.RIF === selectedSupplier)?.PersonaContacto}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Teléfono:</strong> {suppliers.find(s => s.RIF === selectedSupplier)?.TelefonoLocal}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardBox>

            <CardBox className="bg-white shadow-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <i className="mdi mdi-calculator text-blue-600 mr-2"></i>
                  Resumen de la Compra
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total de Productos:</span>
                    <span className="font-semibold">{purchaseItems.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total de la Compra:</span>
                    <span className="text-2xl font-bold text-red-600">{formatCurrency(calculateTotal())}</span>
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={saving || !selectedSupplier || purchaseItems.length === 0 || Object.keys(purchaseErrors).length > 0}
                    color="success"
                    icon={mdiContentSave}
                    label={saving ? "Guardando..." : "Crear Compra"}
                    className="w-full"
                  />
                </div>
              </div>
            </CardBox>
          </div>

          {/* Productos de la Compra */}
          <CardBox className="bg-white shadow-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <i className="mdi mdi-package text-blue-600 mr-2"></i>
                  Productos de la Compra
                </h3>
                <Button
                  onClick={addProductToPurchase}
                  color="success"
                  outline
                  icon={mdiPlus}
                  label="Agregar Producto"
                />
              </div>

              {purchaseItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay productos agregados a la compra
                </div>
              ) : (
                <div className="space-y-4">
                  {purchaseItems.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Producto *
                          </label>
                          <select
                            value={item.CodigoProducto}
                            onChange={(e) => updatePurchaseItem(index, 'CodigoProducto', parseInt(e.target.value))}
                            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                          >
                            <option value={0}>Seleccione un producto</option>
                            {products.map((product) => (
                              <option key={product.CodigoProducto} value={product.CodigoProducto}>
                                {product.NombreProducto} - {product.Categoria}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cantidad Pedida
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.CantidadPedida}
                            onChange={(e) => updatePurchaseItem(index, 'CantidadPedida', parseInt(e.target.value))}
                            className={`w-full border-2 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none ${purchaseErrors[index] ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {purchaseErrors[index] && (
                            <div className="text-red-600 text-xs mt-1">{purchaseErrors[index]}</div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cantidad Disponible
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={item.CantidadDisponible}
                            onChange={(e) => updatePurchaseItem(index, 'CantidadDisponible', parseInt(e.target.value))}
                            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Monto
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.Monto}
                            onChange={(e) => updatePurchaseItem(index, 'Monto', parseFloat(e.target.value))}
                            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Precio Unitario
                          </label>
                          <div className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                            {item.CantidadPedida > 0 ? formatCurrency(item.Monto / item.CantidadPedida) : formatCurrency(0)}
                          </div>
                        </div>

                        <div>
                          <Button
                            onClick={() => removeProductFromPurchase(index)}
                            color="danger"
                            outline
                            icon={mdiTrashCan}
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