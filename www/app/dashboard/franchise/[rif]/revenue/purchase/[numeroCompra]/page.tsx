"use client";

import {
  mdiBallotOutline,
  mdiCurrencyUsd,
  mdiCalendar,
  mdiPackage,
  mdiInformation,
} from "@mdi/js";
import Button from "../../../../../../_components/Button";
import Divider from "../../../../../../_components/Divider";
import CardBox from "../../../../../../_components/CardBox";
import SectionMain from "../../../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../../../_components/Section/TitleLineWithButton";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PurchaseDetailsPage() {
  const params = useParams();
  const rif = params?.rif as string;
  const numeroCompra = params?.numeroCompra as string;
  const [franchise, setFranchise] = useState<any>(null);
  const [purchaseDetails, setPurchaseDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (rif && numeroCompra) {
      fetchFranchiseInfo();
      fetchPurchaseDetails();
    }
  }, [rif, numeroCompra]);

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

  const fetchPurchaseDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/purchase/franchise/${rif}/${numeroCompra}/details`);
      if (!res.ok) throw new Error("Error cargando detalles de la compra");
      const data = await res.json();
      setPurchaseDetails(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error:", err);
      setPurchaseDetails([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPurchase = () => {
    return purchaseDetails.reduce((total, item) => total + (item.Monto || 0), 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateInput: string | Date) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
          <p className="mt-4 text-gray-600">Cargando detalles de la compra...</p>
        </div>
      </SectionMain>
    );
  }

  if (purchaseDetails.length === 0) {
    return (
      <SectionMain>
        <div className="text-center py-8">
          <i className="mdi mdi-package text-6xl text-gray-400 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Compra No Encontrada</h3>
          <p className="text-gray-500 mb-4">
            No se encontraron detalles para la compra #{numeroCompra}
          </p>
          <Button
            href={`/dashboard/franchise/${rif}/revenue`}
            color="info"
            label="Volver al Historial"
          />
        </div>
      </SectionMain>
    );
  }

  const purchaseInfo = purchaseDetails[0]; // All items have the same purchase info

  return (
    <>
      <SectionMain>
        <div className="max-w-6xl mx-auto">
          <SectionTitleLineWithButton
            icon={mdiPackage}
            title={`Detalles de Compra #${numeroCompra} - ${franchise.Nombre}`}
            main
          >
            <Button
              href={`/dashboard/franchise/${rif}/revenue`}
              color="info"
              label="Volver al Historial"
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
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Número de Compra:</span>
                    <span className="font-semibold">#{purchaseInfo.NumeroCompra}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Fecha:</span>
                    <span className="font-semibold">{formatDate(purchaseInfo.Fecha)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total de Productos:</span>
                    <span className="font-semibold">{purchaseDetails.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monto Total:</span>
                    <span className="font-semibold text-red-600">{formatCurrency(calculateTotalPurchase())}</span>
                  </div>
                </div>
              </div>
            </CardBox>

            <CardBox className="bg-white shadow-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <i className="mdi mdi-account text-blue-600 mr-2"></i>
                  Información del Proveedor
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Nombre:</span>
                    <span className="font-semibold">{purchaseInfo.NombreProveedor}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">RIF:</span>
                    <span className="font-semibold">{purchaseInfo.ProveedorRIF}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Dirección:</span>
                    <span className="font-semibold">{purchaseInfo.DireccionProveedor}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Contacto:</span>
                    <span className="font-semibold">{purchaseInfo.PersonaContacto}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Teléfono:</span>
                    <span className="font-semibold">{purchaseInfo.TelefonoLocal}</span>
                  </div>
                </div>
              </div>
            </CardBox>
          </div>

          {/* Tabla de Productos */}
          <CardBox className="bg-white shadow-lg">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <i className="mdi mdi-package text-blue-600 mr-2"></i>
                Productos Comprados
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Código</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Producto</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Categoría</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cantidad Pedida</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cantidad Disponible</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseDetails.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          #{item.CodigoProducto}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <div>
                            <div className="font-medium">{item.NombreProducto}</div>
                            <div className="text-xs text-gray-500">{item.DescripcionProducto}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {item.Categoria}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {item.CantidadPedida}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {item.CantidadDisponible}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-red-600">
                          {formatCurrency(item.Monto)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Divider />

              <div className="flex justify-end mt-6">
                <div className="text-right">
                  <p className="text-lg text-gray-600">Total de la Compra:</p>
                  <p className="text-3xl font-bold text-red-600">{formatCurrency(calculateTotalPurchase())}</p>
                </div>
              </div>
            </div>
          </CardBox>
        </div>
      </SectionMain>
    </>
  );
} 