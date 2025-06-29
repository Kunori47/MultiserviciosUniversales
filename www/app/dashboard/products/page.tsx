"use client";

import {
  mdiPlus,
  mdiMagnify,
  mdiPackage,
} from "@mdi/js";
import Button from "../../_components/Button";
import CardBox from "../../_components/CardBox";
import SectionMain from "../../_components/Section/Main";
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton";
import { useEffect, useState } from "react";
import TableProducts from "./table/Products";

interface Product {
  CodigoProducto: number;
  NombreProducto: string;
  DescripcionProducto: string;
  LineaSuministro: number;
  Tipo: string;
  NivelContaminante: string;
  Tratamiento: string;
  Categoria?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchProducts();
    }
  }, [mounted]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      // Use backend search
      searchProducts(searchTerm);
    }
  }, [searchTerm]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/product");
      if (!res.ok) throw new Error("Error cargando productos");
      const data = await res.json();
      
      // Fetch categories for each product
      const productsWithCategories = await Promise.all(
        data.map(async (product: Product) => {
          try {
            const categoryRes = await fetch(`http://127.0.0.1:8000/supplier_line/${product.LineaSuministro}`);
            if (categoryRes.ok) {
              const categoryData = await categoryRes.json();
              return { ...product, Categoria: categoryData.DescripcionLinea };
            }
          } catch (err) {
            console.error("Error fetching category:", err);
          }
          return product;
        })
      );
      
      setProducts(productsWithCategories);
      setFilteredProducts(productsWithCategories);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/product/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Error buscando productos");
      const data = await res.json();
      
      // Fetch categories for each product
      const productsWithCategories = await Promise.all(
        data.map(async (product: Product) => {
          try {
            const categoryRes = await fetch(`http://127.0.0.1:8000/supplier_line/${product.LineaSuministro}`);
            if (categoryRes.ok) {
              const categoryData = await categoryRes.json();
              return { ...product, Categoria: categoryData.DescripcionLinea };
            }
          } catch (err) {
            console.error("Error fetching category:", err);
          }
          return product;
        })
      );
      
      setFilteredProducts(productsWithCategories);
    } catch (err) {
      console.error("Error:", err);
      // Fallback to frontend filtering
      const filtered = products.filter((product) =>
        product.NombreProducto.toLowerCase().includes(query.toLowerCase()) ||
        product.DescripcionProducto.toLowerCase().includes(query.toLowerCase()) ||
        (product.Categoria && product.Categoria.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  };

  const handleDelete = () => {
    fetchProducts();
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
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </SectionMain>
    );
  }

  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiPackage} title="Gestión de Productos" main>
        <Button
          href="/dashboard/products/create"
          color="success"
          label="Crear Producto"
          icon={mdiPlus}
          roundedFull
        />
      </SectionTitleLineWithButton>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <CardBox>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total de Productos</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </CardBox>

        <CardBox>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Productos Mostrados</p>
              <p className="text-2xl font-bold text-gray-900">{filteredProducts.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </CardBox>

        <CardBox>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Categorías Únicas</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(products.map(p => p.Categoria).filter(Boolean)).size}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </CardBox>
      </div>

      {/* Search and Table */}
      <CardBox>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">Lista de Productos</h4>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No se encontraron productos" : "No hay productos"}
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? "Intenta con otros términos de búsqueda." 
                  : "Comienza creando tu primer producto."
                }
              </p>
            </div>
          ) : (
            <TableProducts 
              products={filteredProducts} 
              onDelete={handleDelete}
            />
          )}
        </div>
      </CardBox>
    </SectionMain>
  );
} 