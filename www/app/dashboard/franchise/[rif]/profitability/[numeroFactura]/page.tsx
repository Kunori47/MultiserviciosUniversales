"use client";

import {
  mdiBallotOutline,
  mdiCurrencyUsd,
  mdiCalendar,
  mdiChartPie,
} from "@mdi/js";
import Button from "../../../../../_components/Button";
import Divider from "../../../../../_components/Divider";
import CardBox from "../../../../../_components/CardBox";
import SectionMain from "../../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../../_components/Section/TitleLineWithButton";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function InvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const rif = params?.rif as string;
  const numeroFactura = params?.numeroFactura as string;
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    if (rif && numeroFactura) {
      fetchInvoiceDetails();
    }
    // eslint-disable-next-line
  }, [rif, numeroFactura]);

  const fetchInvoiceDetails = async () => {
    setLoadingDetails(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/invoice/franchise/${rif}/${numeroFactura}/details`);
      if (!res.ok) throw new Error("Error cargando detalles de la factura");
      const data = await res.json();
      setSelectedInvoice(data);
    } catch (err) {
      console.error("Error:", err);
      setSelectedInvoice(null);
    } finally {
      setLoadingDetails(false);
    }
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
    return date.toLocaleDateString('es-ES');
  };

  const formatTime = (timeString: string) => {
    return timeString ? timeString.substring(0, 5) : "";
  };

  return (
    <SectionMain>
      <div className="max-w-4xl mx-auto">
        <SectionTitleLineWithButton
          icon={mdiCurrencyUsd}
          title={`Detalles de Factura #${numeroFactura}`}
          main
        >
          <Button
            onClick={() => router.back()}
            color="danger"
            outline
            small
            label="Volver"
          />
        </SectionTitleLineWithButton>
        <Divider />
        {loadingDetails ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando detalles...</p>
          </div>
        ) : selectedInvoice ? (
          <div className="space-y-6">
            {/* Información de la Factura */}
            <CardBox className="bg-blue-50">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Información de la Factura</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Número de Factura:</span>
                  <p className="text-lg font-semibold">#{selectedInvoice.NumeroFactura}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Fecha de Emisión:</span>
                  <p className="text-lg font-semibold">{formatDate(selectedInvoice.FechaEmision)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Monto Total:</span>
                  <p className="text-lg font-semibold text-green-600">{formatCurrency(selectedInvoice.MontoTotal)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">IVA:</span>
                  <p className="text-lg font-semibold">{formatCurrency(selectedInvoice.IVA)}</p>
                </div>
                                        <div>
                          <span className="text-sm font-medium text-gray-600">Descuento:</span>
                          <p className="text-lg font-semibold text-red-600">{selectedInvoice.Descuento > 0 ? `${selectedInvoice.Descuento}%` : '0%'}</p>
                        </div>
              </div>
            </CardBox>

            {/* Información del Cliente */}
            <CardBox className="bg-green-50">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Información del Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Nombre:</span>
                  <p className="text-lg font-semibold">{selectedInvoice.NombreCliente}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">CI:</span>
                  <p className="text-lg font-semibold">{selectedInvoice.CI_Cliente}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Email:</span>
                  <p className="text-lg font-semibold">{selectedInvoice.EmailCliente}</p>
                </div>
              </div>
            </CardBox>

            {/* Información del Vehículo */}
            <CardBox className="bg-yellow-50">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4">Información del Vehículo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Código:</span>
                  <p className="text-lg font-semibold">#{selectedInvoice.CodigoVehiculo}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Placa:</span>
                  <p className="text-lg font-semibold">{selectedInvoice.Placa}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Marca:</span>
                  <p className="text-lg font-semibold">{selectedInvoice.NombreMarca}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Modelo:</span>
                  <p className="text-lg font-semibold">{selectedInvoice.DescripcionModelo}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Tipo de Aceite:</span>
                  <p className="text-lg font-semibold">{selectedInvoice.TipoAceite}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Fecha de Adquisición:</span>
                  <p className="text-lg font-semibold">{formatDate(selectedInvoice.FechaAdquisicion)}</p>
                </div>
              </div>
            </CardBox>

            {/* Información de la Orden de Servicio */}
            <CardBox className="bg-purple-50">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">Información de la Orden de Servicio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Número de Orden:</span>
                  <p className="text-lg font-semibold">#{selectedInvoice.NumeroOrden}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Estado:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedInvoice.EstadoOrden === "Completado" 
                      ? "bg-green-100 text-green-800" 
                      : selectedInvoice.EstadoOrden === "A Facturar"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {selectedInvoice.EstadoOrden}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Fecha de Entrada:</span>
                  <p className="text-lg font-semibold">{formatDate(selectedInvoice.FechaEntrada)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Hora de Entrada:</span>
                  <p className="text-lg font-semibold">{formatTime(selectedInvoice.HoraEntrada)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Fecha de Salida Estimada:</span>
                  <p className="text-lg font-semibold">{formatDate(selectedInvoice.FechaSalidaEstimada)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Hora de Salida Estimada:</span>
                  <p className="text-lg font-semibold">{formatTime(selectedInvoice.HoraSalidaEstimada)}</p>
                </div>
                {selectedInvoice.FechaSalidaReal && (
                  <>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Fecha de Salida Real:</span>
                      <p className="text-lg font-semibold">{formatDate(selectedInvoice.FechaSalidaReal)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Hora de Salida Real:</span>
                      <p className="text-lg font-semibold">{formatTime(selectedInvoice.HoraSalidaReal)}</p>
                    </div>
                  </>
                )}
              </div>
              {selectedInvoice.Comentario && (
                <div className="mt-4">
                  <span className="text-sm font-medium text-gray-600">Comentario:</span>
                  <p className="text-lg font-semibold mt-1">{selectedInvoice.Comentario}</p>
                </div>
              )}
            </CardBox>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontró la factura.</p>
          </div>
        )}
      </div>
    </SectionMain>
  );
} 