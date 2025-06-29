"use client";

import {
  mdiArrowLeft,
  mdiPackage,
  mdiPencil,
} from "@mdi/js";
import Button from "../../../_components/Button";
import CardBox from "../../../_components/CardBox";
import SectionMain from "../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../_components/Section/TitleLineWithButton";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
  CodigoProducto: number;
  NombreProducto: string;
  DescripcionProducto: string;
  LineaSuministro: number;
  Tipo: string;
  NivelContaminante: string;
  Tratamiento: string;
}

interface Category {
  CodigoLinea: number;
  DescripcionLinea: string;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const codigoProducto = params?.codigoProducto as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && codigoProducto) {
      fetchData();
    }
  }, [mounted, codigoProducto]);

  const fetchData = async () => {
    try {
      // Fetch product details
      const productRes = await fetch(`http://127.0.0.1:8000/product/${codigoProducto}`);
      if (!productRes.ok) throw new Error("Error cargando producto");
      const productData = await productRes.json();
      setProduct(productData);

      // Fetch category details
      const categoryRes = await fetch(`http://127.0.0.1:8000/supplier_line/${productData.LineaSuministro}`);
      if (categoryRes.ok) {
        const categoryData = await categoryRes.json();
        setCategory(categoryData);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state until component is mounted
  if (!mounted) {
    return (
      <SectionMain>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </SectionMain>
    );
  }

  if (loading) {
    return (
      <SectionMain>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando producto...</p>
        </div>
      </SectionMain>
    );
  }

  if (!product) {
    return (
      <SectionMain>
        <div className="text-center">
          <p>No se pudo cargar la información del producto.</p>
        </div>
      </SectionMain>
    );
  }

  const getContaminantColor = (level: string | number) => {
    const numLevel = Number(level);
    if (!numLevel) return 'bg-gray-100 text-gray-800';
    
    if (numLevel >= 4) return 'bg-red-100 text-red-800';
    if (numLevel >= 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getTreatmentColor = (treatment: string) => {
    switch (treatment) {
      case 'Reciclable': return 'bg-green-100 text-green-800';
      case 'Reutilizable': return 'bg-blue-100 text-blue-800';
      case 'Desechable': return 'bg-red-100 text-red-800';
      case 'Especial': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiPackage} title="Detalles del Producto" main>
        <Button
          href="/dashboard/products"
          color="info"
          label="Atras"
          icon={mdiArrowLeft}
          roundedFull
        />
      </SectionTitleLineWithButton>

      {/* Product Information */}
      <CardBox className="mb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{product.NombreProducto}</h3>
                <p className="text-gray-600">Código: #{product.CodigoProducto}</p>
              </div>
            </div>
            <Button
              href={`/dashboard/products/edit/${product.CodigoProducto}`}
              color="contrast"
              icon={mdiPencil}
              label="Editar"
              small
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">#{product.CodigoProducto}</div>
              <div className="text-sm text-gray-600">Código</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{product.Tipo}</div>
              <div className="text-sm text-gray-600">Tipo</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{product.NivelContaminante}</div>
              <div className="text-sm text-gray-600">Contaminante</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{product.Tratamiento}</div>
              <div className="text-sm text-gray-600">Tratamiento</div>
            </div>
          </div>
        </div>
      </CardBox>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <CardBox>
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Información Básica</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                <p className="mt-1 text-sm text-gray-900">{product.NombreProducto}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <p className="mt-1 text-sm text-gray-900">{product.DescripcionProducto}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Categoría</label>
                <p className="mt-1 text-sm text-gray-900">
                  {category ? category.DescripcionLinea : "Categoría no disponible"}
                </p>
              </div>
            </div>
          </div>
        </CardBox>

        {/* Classification Information */}
        <CardBox>
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Clasificación</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de Material</label>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                  {product.Tipo}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Nivel Contaminante</label>
                {product.NivelContaminante ? (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getContaminantColor(product.NivelContaminante)}`}>
                    Nivel {product.NivelContaminante}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                    No aplica
                  </span>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Tratamiento</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getTreatmentColor(product.Tratamiento)}`}>
                  {product.Tratamiento}
                </span>
              </div>
            </div>
          </div>
        </CardBox>
      </div>

      {/* Additional Information */}
      <CardBox className="mt-6">
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Información Adicional</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-600">Código de Línea</div>
              <div className="text-sm text-gray-600">#{product.LineaSuministro}</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-600">Estado</div>
              <div className="text-sm text-gray-600">Activo</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-lg font-semibold text-purple-600">Gestión</div>
              <div className="text-sm text-gray-600">General</div>
            </div>
          </div>
        </div>
      </CardBox>
    </SectionMain>
  );
} 