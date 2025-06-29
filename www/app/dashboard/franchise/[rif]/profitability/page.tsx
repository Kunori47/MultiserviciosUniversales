"use client";

import {
  mdiBallotOutline,
  mdiCurrencyUsd,
  mdiFilter,
  mdiCalendar,
  mdiChartPie,
  mdiInformation,
} from "@mdi/js";
import Button from "../../../../_components/Button";
import Divider from "../../../../_components/Divider";
import CardBox from "../../../../_components/CardBox";
import SectionMain from "../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../_components/Section/TitleLineWithButton";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ProfitabilityPage() {
  const params = useParams();
  const rif = params?.rif as string;
  const [franchise, setFranchise] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fecha, setFecha] = useState<Date | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (rif) {
      fetchFranchiseInfo();
    }
  }, [rif]);

  useEffect(() => {
    if (franchise) {
      fetchInvoices();
      fetchStats();
    }
  }, [franchise, fecha]);

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

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      let url = `http://127.0.0.1:8000/invoice/franchise/${rif}`;
      const params = new URLSearchParams();
      
      if (fecha) {
        const mes = fecha.getMonth() + 1;
        const anio = fecha.getFullYear();
        params.append('mes', mes.toString());
        params.append('anio', anio.toString());
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error cargando facturas");
      const data = await res.json();
      setInvoices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error:", err);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      let url = `http://127.0.0.1:8000/views/remenfranq?FranquiciaRIF=${rif}`;
      
      if (fecha) {
        const mes = fecha.getMonth() + 1;
        const anio = fecha.getFullYear();
        url += `&Anio=${anio}&Mes=${mes}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error cargando estadísticas");
      const data = await res.json();
      setStats(data && data.length > 0 ? data[0] : null);
    } catch (err) {
      console.error("Error:", err);
      setStats(null);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setFecha(date);
  };

  const clearFilters = () => {
    setFecha(null);
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

  const calculateTotalRevenue = () => {
    return invoices.reduce((total, invoice) => total + (invoice.MontoTotal || 0), 0);
  };

  const calculateTotalTax = () => {
    return invoices.reduce((total, invoice) => total + (invoice.IVA || 0), 0);
  };

  const calculateTotalDiscount = () => {
    return invoices.reduce((total, invoice) => total + (invoice.Descuento || 0), 0);
  };

  const fetchInvoiceDetails = async (numeroFactura: number) => {
    setLoadingDetails(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/invoice/franchise/${rif}/${numeroFactura}/details`);
      if (!res.ok) throw new Error("Error cargando detalles de la factura");
      const data = await res.json();
      setSelectedInvoice(data);
      setShowModal(true);
    } catch (err) {
      console.error("Error:", err);
      alert("Error al cargar los detalles de la factura");
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedInvoice(null);
  };

  const formatTime = (timeString: string) => {
    return timeString ? timeString.substring(0, 5) : "";
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

  return (
    <>
      <SectionMain>
        <div className="max-w-6xl mx-auto">
          <SectionTitleLineWithButton
            icon={mdiChartPie}
            title={`Análisis de Rentabilidad - ${franchise.Nombre}`}
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

          {/* Filtros */}
          <CardBox className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="mdi mdi-calendar text-gray-600"></i>
                <span className="text-sm font-medium text-gray-700">Fecha:</span>
                <DatePicker
                  selected={fecha}
                  onChange={handleDateChange}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  placeholderText="Selecciona mes y año"
                  isClearable
                  className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <Button
                onClick={clearFilters}
                color="danger"
                outline
                small
                label="Limpiar Filtros"
              />
            </div>
          </CardBox>

          {/* Estadísticas */}
          {stats && !fecha && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <CardBox className="text-center bg-green-50">
                <h4 className="text-lg font-semibold text-green-800 mb-2">Ingresos Totales</h4>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.MontoGenerado || 0)}
                </div>
              </CardBox>
              <CardBox className="text-center bg-red-50">
                <h4 className="text-lg font-semibold text-red-800 mb-2">Gastos Totales</h4>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(stats.GastoTotal || 0)}
                </div>
              </CardBox>
              <CardBox className="text-center bg-blue-50">
                <h4 className="text-lg font-semibold text-blue-800 mb-2">Utilidad Neta</h4>
                <div className={`text-2xl font-bold ${
                  (stats.MontoGenerado - stats.GastoTotal) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency((stats.MontoGenerado || 0) - (stats.GastoTotal || 0))}
                </div>
              </CardBox>
            </div>
          )}

          {/* Resumen de Facturas */}
          {!loading && invoices.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <CardBox className="text-center bg-blue-50">
                <h4 className="text-lg font-semibold text-blue-800 mb-2">Total Facturado</h4>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(calculateTotalRevenue())}
                </div>
              </CardBox>
              <CardBox className="text-center bg-yellow-50">
                <h4 className="text-lg font-semibold text-yellow-800 mb-2">Total IVA</h4>
                <div className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(calculateTotalTax())}
                </div>
              </CardBox>
              <CardBox className="text-center bg-purple-50">
                <h4 className="text-lg font-semibold text-purple-800 mb-2">Total Descuentos</h4>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(calculateTotalDiscount())}
                </div>
              </CardBox>
            </div>
          )}

          {/* Tabla de Facturas */}
          <CardBox>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">N° Factura</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Fecha Emisión</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cliente</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Vehículo</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Monto Total</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">IVA</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Descuento</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">N° Orden</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2">Cargando facturas...</p>
                      </td>
                    </tr>
                  ) : invoices.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                        No se encontraron facturas
                      </td>
                    </tr>
                  ) : (
                    invoices.map((invoice) => (
                      <tr key={invoice.NumeroFactura} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          #{invoice.NumeroFactura}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {formatDate(invoice.FechaEmision)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <div>
                            <div className="font-medium">{invoice.NombreCliente}</div>
                            <div className="text-xs text-gray-500">{invoice.CI_Cliente}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <div>
                            <div className="font-medium">#{invoice.CodigoVehiculo}</div>
                            <div className="text-xs text-gray-500">{invoice.Placa}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-green-600">
                          {formatCurrency(invoice.MontoTotal)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {formatCurrency(invoice.IVA)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {formatCurrency(invoice.Descuento)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          #{invoice.NumeroOrden}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <Button
                            href={`/dashboard/franchise/${rif}/profitability/${invoice.NumeroFactura}`}
                            color="info"
                            outline
                            small
                            icon={mdiInformation}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardBox>
        </div>

        {/* Modal de Detalles de Factura */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Detalles de Factura #{selectedInvoice?.NumeroFactura}
                  </h2>
                  <Button
                    onClick={closeModal}
                    color="danger"
                    outline
                    small
                    label="Cerrar"
                  />
                </div>

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
                          <p className="text-lg font-semibold text-red-600">{formatCurrency(selectedInvoice.Descuento)}</p>
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
                ) : null}
              </div>
            </div>
          </div>
        )}
      </SectionMain>
    </>
  );
} 