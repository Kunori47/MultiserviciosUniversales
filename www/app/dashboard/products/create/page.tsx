"use client";

import {
  mdiArrowLeft,
  mdiPackage,
  mdiContentSave,
} from "@mdi/js";
import Button from "../../../_components/Button";
import CardBox from "../../../_components/CardBox";
import SectionMain from "../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../_components/Section/TitleLineWithButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Category {
  CodigoLinea: number;
  DescripcionLinea: string;
}

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
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
    if (mounted) {
      fetchCategories();
    }
  }, [mounted]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/supplier_line");
      if (!res.ok) throw new Error("Error cargando categorías");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.LineaSuministro) {
      alert("Por favor selecciona una categoría");
      return;
    }

    setIsSubmitting(true);
    try {
      if (form.Tipo === "No contaminante") {
        form.NivelContaminante = "0";
        form.Tratamiento = "";
      }
      
      const res = await fetch("http://127.0.0.1:8000/product/create?NombreProducto=" + form.NombreProducto + "&DescripcionProducto=" + form.DescripcionProducto + "&LineaSuministro=" + form.LineaSuministro + "&Tipo=" + form.Tipo + "&NivelContaminante=" + form.NivelContaminante + "&Tratamiento=" + form.Tratamiento, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error creando producto");

      // Navigate back to products list
      router.push("/dashboard/products");
    } catch (err) {
      console.error("Error:", err);
      alert("Error al crear el producto");
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
          <p className="mt-4 text-gray-600">Cargando categorías...</p>
        </div>
      </SectionMain>
    );
  }

  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiPackage} title="Crear Nuevo Producto" main>
        <Button
          href="/dashboard/products"
          color="info"
          label="Atras"
          icon={mdiArrowLeft}
          roundedFull
        />
      </SectionTitleLineWithButton>

      {/* Create Form */}
      <CardBox>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">Información del Producto</h4>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm text-gray-500">Formulario de creación</span>
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
                label={isSubmitting ? "Creando..." : "Crear Producto"}
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