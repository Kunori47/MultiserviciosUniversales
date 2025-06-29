"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "../../../_components/Button";
import CardBox from "../../../_components/CardBox";
import Divider from "../../../_components/Divider";
import SectionMain from "../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../_components/Section/TitleLineWithButton";
import { mdiTruck, mdiArrowLeft, mdiPencil, mdiPackageVariant } from "@mdi/js";
import Icon from "../../../_components/Icon";

interface Vendor {
  RIF: string;
  RazonSocial: string;
  Direccion: string;
  TelefonoLocal: string;
  TelefonoCelular: string;
  PersonaContacto: string;
}

interface SupplyProduct {
  CodigoProducto: number;
  NombreProducto: string;
  DescripcionProducto: string;
  Tipo: string;
  NivelContaminante: number;
  Tratamiento: string;
}

export default function VendorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const rif = params?.rif as string;
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [supplyProducts, setSupplyProducts] = useState<SupplyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !rif) return;

    const loadData = async () => {
      try {
        // Cargar información del proveedor
        const vendorRes = await fetch(`http://127.0.0.1:8000/vendor/${rif}`);
        if (!vendorRes.ok) {
          throw new Error("Proveedor no encontrado");
        }
        const vendorData = await vendorRes.json();
        setVendor(vendorData);

        // Cargar productos que suministra
        const productsRes = await fetch(`http://127.0.0.1:8000/supply/vendor/${rif}`);
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setSupplyProducts(productsData);
        }
        setLoading(false);
        setLoadingProducts(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
        setLoading(false);
        setLoadingProducts(false);
      }
    };

    loadData();
  }, [mounted, rif]);

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <SectionMain>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Cargando proveedor...</span>
        </div>
      </SectionMain>
    );
  }

  if (error || !vendor) {
    return (
      <SectionMain>
        <CardBox>
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error || "Proveedor no encontrado"}</p>
            <Button
              href="/dashboard/vendor"
              color="info"
              label="Volver a Proveedores"
              icon={mdiArrowLeft}
              roundedFull
            />
          </div>
        </CardBox>
      </SectionMain>
    );
  }

  return (
    <SectionMain>
      <SectionTitleLineWithButton
        icon={mdiTruck}
        title={`Proveedor: ${vendor.RazonSocial}`}
        main
      >
        <div className="flex gap-2">
          <Button
            href={`/dashboard/vendor/edit/${vendor.RIF}`}
            color="warning"
            label="Editar"
            icon={mdiPencil}
            roundedFull
          />
          <Button
            href="/dashboard/vendor"
            color="info"
            label="Atras"
            icon={mdiArrowLeft}
            roundedFull
          />
        </div>
      </SectionTitleLineWithButton>

      <Divider />

      {/* Información del Proveedor */}
      <CardBox className="mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Información del Proveedor
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1">RIF</label>
            <p className="text-gray-800 dark:text-gray-200">{vendor.RIF}</p>
          </div>
          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1">Razón Social</label>
            <p className="text-gray-800 dark:text-gray-200">{vendor.RazonSocial}</p>
          </div>
          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1">Dirección</label>
            <p className="text-gray-800 dark:text-gray-200">{vendor.Direccion}</p>
          </div>
          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1">Teléfono Local</label>
            <p className="text-gray-800 dark:text-gray-200">{vendor.TelefonoLocal || "No especificado"}</p>
          </div>
          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1">Teléfono Celular</label>
            <p className="text-gray-800 dark:text-gray-200">{vendor.TelefonoCelular || "No especificado"}</p>
          </div>
          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1">Persona Contacto</label>
            <p className="text-gray-800 dark:text-gray-200">{vendor.PersonaContacto || "No especificado"}</p>
          </div>
        </div>
      </CardBox>

      {/* Productos que Suministra */}
      <CardBox>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Productos que Suministra
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {loadingProducts ? "Cargando..." : `${supplyProducts.length} productos`}
            </span>
          </div>
        </div>

        {loadingProducts ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Cargando productos...</span>
          </div>
        ) : supplyProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="mb-4 flex justify-center">
              <Icon path={mdiPackageVariant} size={2} className="text-gray-300" />
            </div>
            <p>Este proveedor no tiene productos asociados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Código</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Nombre</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Descripción</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Tipo</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Nivel Contaminante</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Tratamiento</th>
                </tr>
              </thead>
              <tbody>
                {supplyProducts.map((product, index) => (
                  <tr
                    key={product.CodigoProducto}
                    className={`border-b border-gray-200 dark:border-gray-700 ${
                      index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-900"
                    }`}
                  >
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200 font-mono">
                      {product.CodigoProducto}
                    </td>
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200 font-semibold">
                      {product.NombreProducto}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {product.DescripcionProducto}
                    </td>
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                      {product.Tipo}
                    </td>
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                      {product.NivelContaminante}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {product.Tratamiento}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardBox>
    </SectionMain>
  );
} 