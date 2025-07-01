"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../_hooks/useAuth";
import CardBox from "../../_components/CardBox";
import Divider from "../../_components/Divider";
import Button from "../../_components/Button";
import SectionMain from "../../_components/Section/Main";
import { mdiInformation } from "@mdi/js";

interface ServiceOrder {
  NumeroOrden: number;
  FechaOrden: string;
  HoraEntrada: string;
  FechaSalidaEstimada: string;
  HoraSalidaEstimada: string;
  Comentario?: string;
  Estado: string;
}

export default function EmployeeServiceOrdersPage() {
  const { employee, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employee) return;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/service_order/employee/${employee.CI}/pending`);
        if (!res.ok) throw new Error("Error cargando órdenes");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [employee]);

  // Agregar función para formatear la hora
  const formatTime = (timeString: string) => {
    return timeString ? timeString.substring(0, 5) : "";
  };

  if (authLoading || loading) {
    return <SectionMain><div className="text-center py-8">Cargando órdenes...</div></SectionMain>;
  }

  return (
    <SectionMain>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Órdenes de Servicio Asignadas</h2>
        <Divider />
        <CardBox>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No tienes órdenes de servicio pendientes.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">N° Orden</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Fecha Entrada</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hora Entrada</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Fecha Salida Estimada</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.NumeroOrden} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{order.NumeroOrden}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{order.FechaOrden}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatTime(order.HoraEntrada)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{order.FechaSalidaEstimada}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{order.Estado}</td>
                      <td className="px-4 py-3">
                        {employee && (
                          <Button href={`/dashboard/service-orders/${order.NumeroOrden}`} color="info" small icon={mdiInformation} outline />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBox>
      </div>
    </SectionMain>
  );
} 