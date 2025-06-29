"use client";

import {
  mdiArrowLeft,
  mdiPackage,
  mdiContentSave,
} from "@mdi/js";
import Button from "../../../../_components/Button";
import CardBox from "../../../../_components/CardBox";
import SectionMain from "../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../_components/Section/TitleLineWithButton";
import { useParams, useRouter } from "next/navigation";
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

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const codigoProducto = params?.codigoProducto as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    NombreProducto: "",
    DescripcionProducto: "",
    LineaSuministro: "",
    Tipo: "",
    NivelContaminante: "",
    Tratamiento: ""
  });

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
      setForm({
        NombreProducto: productData.NombreProducto,
        DescripcionProducto: productData.DescripcionProducto,
        LineaSuministro: productData.LineaSuministro.toString(),
        Tipo: productData.Tipo,
        NivelContaminante: productData.NivelContaminante,
        Tratamiento: productData.Tratamiento
      });

      // Fetch categories
      const categoriesRes = await fetch("http://127.0.0.1:8000/supplier_line");
      if (!categoriesRes.ok) throw new Error("Error cargando categorías");
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/product/update", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          CodigoProducto: product.CodigoProducto,
          NombreProducto: form.NombreProducto,
          DescripcionProducto: form.DescripcionProducto,
          LineaSuministro: parseInt(form.LineaSuministro),
          Tipo: form.Tipo,
          NivelContaminante: form.NivelContaminante,
          Tratamiento: form.Tratamiento
        }),
      });

      if (!res.ok) throw new Error("Error actualizando producto");

      // Navigate back to products list
      router.push("/dashboard/products");
    } catch (err) {
      console.error("Error:", err);
      alert("Error al actualizar el producto");
    } finally {
      setIsSubmitting(false);
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

  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiPackage} title="Editar Producto" main>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">#{product.CodigoProducto}</div>
              <div className="text-sm text-gray-600">Código del Producto</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{product.Tipo}</div>
              <div className="text-sm text-gray-600">Tipo</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{product.NivelContaminante}</div>
              <div className="text-sm text-gray-600">Nivel Contaminante</div>
            </div>
          </div>
        </div>
      </CardBox>

      {/* Edit Form */}
      <CardBox>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">Editar Información del Producto</h4>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="text-sm text-gray-500">Formulario de edición</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  value={form.NombreProducto}
                  onChange={(e) => setForm({ ...form, NombreProducto: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingresa el nombre del producto..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  value={form.LineaSuministro}
                  onChange={(e) => setForm({ ...form, LineaSuministro: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((category) => (
                    <option key={category.CodigoLinea} value={category.CodigoLinea}>
                      {category.DescripcionLinea}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del Producto *
              </label>
              <textarea
                value={form.DescripcionProducto}
                onChange={(e) => setForm({ ...form, DescripcionProducto: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Describe el producto..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo *
                </label>
                <select
                  value={form.Tipo}
                  onChange={(e) => setForm({ ...form, Tipo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecciona el tipo</option>
                  <option value="Contaminante">Contaminante</option>
                  <option value="No contaminante">No contaminante</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel Contaminante {form.Tipo === "No contaminante" ? "" : "*"}
                </label>
                <select
                  value={form.NivelContaminante}
                  onChange={(e) => setForm({ ...form, NivelContaminante: e.target.value })}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    form.Tipo === "No contaminante" ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  disabled={form.Tipo === "No contaminante"}
                  required={form.Tipo !== "No contaminante"}
                >
                  <option value="">Selecciona el nivel</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                {form.Tipo === "No contaminante" && (
                  <p className="text-xs text-gray-500 mt-1">No aplica para productos no contaminantes</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tratamiento {form.Tipo === "No contaminante" ? "" : "*"}
                </label>
                <input
                  type="text"
                  value={form.Tratamiento}
                  onChange={(e) => setForm({ ...form, Tratamiento: e.target.value })}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    form.Tipo === "No contaminante" ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  placeholder={form.Tipo === "No contaminante" ? "No aplica" : "Describe el tratamiento requerido..."}
                  disabled={form.Tipo === "No contaminante"}
                  required={form.Tipo !== "No contaminante"}
                />
                {form.Tipo === "No contaminante" && (
                  <p className="text-xs text-gray-500 mt-1">No aplica para productos no contaminantes</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                href="/dashboard/products"
                label="Cancelar"
                color="info"
                disabled={isSubmitting}
              />
              <Button
                label={isSubmitting ? "Guardando..." : "Guardar Cambios"}
                color="success"
                icon={mdiContentSave}
                type="submit"
                disabled={isSubmitting}
              />
            </div>
          </form>
        </div>
      </CardBox>
    </SectionMain>
  );
} 