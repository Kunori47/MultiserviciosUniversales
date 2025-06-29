"use client";

import {
  mdiBallotOutline,
  mdiInformation,
  mdiFilter,
  mdiCalendar,
} from "@mdi/js";
import Button from "../../../../_components/Button";
import Divider from "../../../../_components/Divider";
import CardBox from "../../../../_components/CardBox";
import SectionMain from "../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../_components/Section/TitleLineWithButton";
import FieldLabel from "../../../../_components/FormField/FieldLabel";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function OrdersPage() {
  const params = useParams();
  const rif = params?.rif as string;
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fecha, setFecha] = useState<Date | null>(null);
  const [estado, setEstado] = useState<string>("todos");
  const [stats, setStats] = useState<any>(null);
  const [orderStats, setOrderStats] = useState<any>(null);

  useEffect(() => {
    if (rif) {
      fetchOrders();
      fetchStats();
      fetchOrderStats();
    }
  }, [rif, fecha, estado]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = `http://127.0.0.1:8000/service_order/franchise/${rif}`;
      const params = new URLSearchParams();
      
      if (fecha) {
        const mes = fecha.getMonth() + 1;
        const anio = fecha.getFullYear();
        params.append('mes', mes.toString());
        params.append('anio', anio.toString());
      }
      
      if (estado !== "todos") {
        params.append('estado', estado);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error cargando órdenes");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error:", err);
      setOrders([]);
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

  const fetchOrderStats = async () => {
    try {
      let url = `http://127.0.0.1:8000/service_order/franchise/${rif}/stats`;
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
      if (!res.ok) throw new Error("Error cargando estadísticas de órdenes");
      const data = await res.json();
      setOrderStats(data);
    } catch (err) {
      console.error("Error:", err);
      setOrderStats(null);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setFecha(date);
  };

  const handleEstadoChange = (newEstado: string) => {
    setEstado(newEstado);
  };

  const clearFilters = () => {
    setFecha(null);
    setEstado("todos");
  };

  const getStatusColor = (status: string) => {
    return status === "Completado" ? "success" : "warning";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const formatTime = (timeString: string) => {
    return timeString ? timeString.substring(0, 5) : "";
  };

  if (loading) {
    return (
      <SectionMain>
        <div className="text-center">
          <p>Cargando historial de órdenes...</p>
        </div>
      </SectionMain>
    );
  }

  return (
    <>
      <SectionMain>
        <div className="max-w-6xl mx-auto">
          <SectionTitleLineWithButton
            icon={mdiBallotOutline}
            title={`Historial de Órdenes de Servicio - ${rif}`}
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
              <div className="flex flex-col md:flex-row gap-4 items-center">
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

                <div className="flex items-center gap-2">
                  <i className="mdi mdi-filter text-gray-600"></i>
                  <span className="text-sm font-medium text-gray-700">Estado:</span>
                  <select
                    value={estado}
                    onChange={(e) => handleEstadoChange(e.target.value)}
                    className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="todos">Todos</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Completado">Completado</option>
                  </select>
                </div>
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
          {orderStats && estado === "todos" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <CardBox className="text-center bg-blue-50">
                <h4 className="text-lg font-semibold text-blue-800 mb-2">Total Órdenes</h4>
                <div className="text-2xl font-bold text-blue-600">
                  {orderStats.TotalOrdenes || 0}
                </div>
              </CardBox>
              <CardBox className="text-center bg-green-50">
                <h4 className="text-lg font-semibold text-green-800 mb-2">Órdenes Completadas</h4>
                <div className="text-2xl font-bold text-green-600">
                  {orderStats.OrdenesCompletadas || 0}
                </div>
              </CardBox>
              <CardBox className="text-center bg-yellow-50">
                <h4 className="text-lg font-semibold text-yellow-800 mb-2">Órdenes En Proceso</h4>
                <div className="text-2xl font-bold text-yellow-600">
                  {orderStats.OrdenesEnProceso || 0}
                </div>
              </CardBox>
            </div>
          )}

          {/* Tabla de Órdenes */}
          <CardBox>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">N° Orden</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Fecha</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hora Entrada</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cliente</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Vehículo</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Fecha Salida</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Comentario</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                        No se encontraron órdenes de servicio
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.NumeroOrden} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          #{order.NumeroOrden}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {formatDate(order.FechaOrden)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {formatTime(order.HoraEntrada)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <div>
                            <div className="font-medium">{order.NombreCliente}</div>
                            <div className="text-xs text-gray-500">{order.CI_Cliente}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          #{order.CodigoVehiculo}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.Estado === "Completado" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {order.Estado}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {order.FechaSalidaReal ? formatDate(order.FechaSalidaReal) : "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                          {order.Comentario || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <Button
                            color="info"
                            outline
                            small
                            href={`/dashboard/franchise/${rif}/orders/${order.NumeroOrden}`}
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
      </SectionMain>
    </>
  );
} 