"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CardBox from "../../../_components/CardBox";
import Divider from "../../../_components/Divider";
import Button from "../../../_components/Button";
import SectionMain from "../../../_components/Section/Main";
import { useAuth } from "../../../_hooks/useAuth";

interface Product {
  CodigoProducto: number;
  NombreProducto: string;
  CantidadUtilizada: number;
  PrecioProducto: number;
  CodigoServicio: number;
  NumeroCorrelativoActividad: number;
  FranquiciaRIF: string;
}

interface Activity {
  CodigoServicio: number;
  NombreServicio: string;
  NumeroCorrelativoActividad: number;
  DescripcionActividad: string;
  Costo_Act: number | null;
}

export default function EmployeeOrderDetailPage() {
  const params = useParams();
  const numeroOrden = params?.numeroOrden as string;
  
  // Initialize date/time values immediately to prevent uncontrolled to controlled switch
  const now = new Date();
  const defaultDate = now.toISOString().split("T")[0];
  const defaultTime = now.toTimeString().substring(0, 5);

  const [order, setOrder] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [fechaSalidaReal, setFechaSalidaReal] = useState<string>(defaultDate);
  const [horaSalidaReal, setHoraSalidaReal] = useState<string>(defaultTime);
  const [producto, setProducto] = useState<string>("");
  const [cantidad, setCantidad] = useState<number>(1);
  const [comentario, setComentario] = useState<string>("");
  const router = useRouter();
  const { employee, franchise, loading: authLoading } = useAuth();
  const [franchiseProducts, setFranchiseProducts] = useState<any[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [orderProducts, setOrderProducts] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (numeroOrden) {
      fetchOrder();
      fetchActivities();
    }
    if (franchise?.RIF) {
      fetch(`http://127.0.0.1:8000/product_franchise/franchise/${franchise.RIF}`)
        .then(res => res.json())
        .then(data => setFranchiseProducts(Array.isArray(data) ? data : []));
    }
  }, [numeroOrden, franchise]);

  // Separate effect for client-side initialization
  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchOrder = async () => {
    if (!franchise?.RIF || !numeroOrden) return;
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/service_order/franchise/${franchise.RIF}/${numeroOrden}/details`);
      if (!res.ok) throw new Error("Error cargando orden");
      const data = await res.json();
      setOrder(data.order);
      setProducts(data.products || []);
    } catch {
      setOrder(null);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/orderxactivity/order/${numeroOrden}`);
      if (!res.ok) throw new Error("Error cargando actividades");
      const data = await res.json();
      setActivities(Array.isArray(data) ? data : []);
    } catch {
      setActivities([]);
    }
  };

  const handleSaveSalida = async () => {
    try {
      // 1. Guardar/actualizar actividades en OrdenesActividades
      for (const act of activities) {
        await fetch(`http://127.0.0.1:8000/orderxactivity/${numeroOrden}/${act.CodigoServicio}/${act.NumeroCorrelativoActividad}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Costo_Act: act.Costo_Act || 0 }),
        });
      }
      // 2. Guardar productos en ProductosOrdenesServicio
      for (const prod of orderProducts) {
        await fetch(`http://127.0.0.1:8000/product_service_order/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            CodigoOrdenServicio: numeroOrden,
            CodigoServicio: prod.CodigoServicio,
            NumeroCorrelativoActividad: prod.NumeroCorrelativoActividad,
            FranquiciaRIF: prod.FranquiciaRIF,
            CodigoProducto: prod.CodigoProducto,
            CantidadUtilizada: prod.CantidadUtilizada,
            PrecioProducto: prod.PrecioProducto
          }),
        });
      }
      // 3. Actualizar la orden en OrdenesServicio
      await fetch(`http://127.0.0.1:8000/service_order/update?ID=${numeroOrden}&FechaSalidaReal=${fechaSalidaReal}&HoraSalidaReal=${horaSalidaReal}&Comentario=${comentario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(numeroOrden),
      });
      
      // 4. Crear registro de mantenimiento del vehículo
      await fetch(`http://127.0.0.1:8000/vehicle_maintenances/create?Vehiculo=${order.CodigoVehiculo}&FechaMantenimiento=${fechaSalidaReal}&DescripcionMantenimiento=${comentario || `Mantenimiento realizado en orden de servicio #${numeroOrden}`}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order.CodigoVehiculo),
      });
      
      alert("Salida registrada y datos guardados correctamente");
      fetchOrder();
      setOrderProducts([]);
      router.push(`/dashboard/service-orders`);
    } catch (err) {
      alert("Error guardando datos de salida: " + (err?.message || err));
    }
  };

  // Función para formatear hora
  const formatTime = (timeString: string) => {
    return timeString ? timeString.substring(0, 5) : "";
  };

  const handleCostoChange = (idx: number, value: number) => {
    setActivities(prev => prev.map((a, i) => i === idx ? { ...a, Costo_Act: value } : a));
  };

  if (authLoading || !franchise) {
    return <SectionMain><div className="text-center py-8">Cargando...</div></SectionMain>;
  }
  if (loading) return <SectionMain><div className="text-center py-8">Cargando...</div></SectionMain>;
  if (!order) return <SectionMain><div className="text-center py-8">Orden no encontrada</div></SectionMain>;

  return (
    <SectionMain>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Detalle de Orden #{numeroOrden}</h2>
        <Divider />
        <CardBox>
          <div className="mb-4">
            <b>Cliente:</b> {order.NombreCliente} <br />
            <b>Vehículo:</b> {order.CodigoVehiculo} <br />
            <b>Fecha Entrada:</b> {order.FechaOrden} <br />
            <b>Hora Entrada:</b> {formatTime(order.HoraEntrada)} <br />
          </div>
          <Divider />
          {isClient && (
            <div className="mb-4 flex gap-4 items-end">
              <div>
                <label className="block text-sm font-medium">Fecha Salida Real</label>
                <input type="date" value={fechaSalidaReal} onChange={e => setFechaSalidaReal(e.target.value)} className="border rounded px-2 py-1" />
              </div>
              <div>
                <label className="block text-sm font-medium">Hora Salida Real</label>
                <input type="time" value={horaSalidaReal} onChange={e => setHoraSalidaReal(e.target.value)} className="border rounded px-2 py-1" />
              </div>
              <div>
                <label className="block text-sm font-medium">Comentario</label>
                <input type="text" value={comentario} onChange={e => setComentario(e.target.value)} className="border rounded px-2 py-1 w-56" placeholder="Comentario de salida" />
              </div>
              <Button color="success" label="Registrar Salida" onClick={handleSaveSalida} />
            </div>
          )}
          {order.HoraSalidaReal && (
            <><b>Hora Salida Real:</b> {formatTime(order.HoraSalidaReal)} <br /></>
          )}
        </CardBox>
        <Divider />
        <CardBox>
          <h3 className="font-bold mb-2">Actividades de la Orden</h3>
          <table className="w-full mb-4">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Servicio</th>
                <th className="px-4 py-2 text-left">Actividad</th>
                <th className="px-4 py-2 text-left">Costo Mano de Obra</th>
              </tr>
            </thead>
            <tbody>
              {activities.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-4 text-gray-500">No hay actividades registradas para esta orden</td></tr>
              ) : (
                activities.map((act, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-2">{act.NombreServicio}</td>
                    <td className="px-4 py-2">{act.DescripcionActividad}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={act.Costo_Act || 0}
                        onChange={e => handleCostoChange(idx, parseFloat(e.target.value) || 0)}
                        className="border rounded px-2 py-1 w-28"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardBox>
        <Divider />
        <CardBox>
          <h3 className="font-bold mb-2">Productos Utilizados</h3>
          <div className="mb-4 flex gap-2 items-end">
            <select
              value={selectedActivity}
              onChange={e => setSelectedActivity(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">Selecciona una actividad</option>
              {activities.map((act) => (
                <option key={`${act.CodigoServicio}-${act.NumeroCorrelativoActividad}`} value={`${act.CodigoServicio}|${act.NumeroCorrelativoActividad}`}>{act.NombreServicio} - {act.DescripcionActividad}</option>
              ))}
            </select>
            <select
              value={producto}
              onChange={e => setProducto(e.target.value)}
              className="border rounded px-2 py-1"
              disabled={!selectedActivity}
            >
              <option value="">Selecciona un producto</option>
              {franchiseProducts.map((prod) => (
                <option key={prod.CodigoProducto} value={prod.CodigoProducto}>
                  {prod.NombreProducto} - {prod.CodigoProducto}
                </option>
              ))}
            </select>
            <input type="number" min={1} value={cantidad || 1} onChange={e => setCantidad(Number(e.target.value) || 1)} className="border rounded px-2 py-1 w-20" />
            <Button color="info" label="Agregar Producto" onClick={() => {
              if (!selectedActivity || !producto || cantidad <= 0) return;
              const selected = franchiseProducts.find(p => String(p.CodigoProducto) === String(producto));
              if (!selected) return;
              const [codigoServicio, numeroCorrelativoActividad] = selectedActivity.split("|");
              setOrderProducts(prev => ([
                ...prev,
                {
                  CodigoOrdenServicio: numeroOrden,
                  CodigoServicio: Number(codigoServicio),
                  NumeroCorrelativoActividad: Number(numeroCorrelativoActividad),
                  FranquiciaRIF: selected.FranquiciaRIF,
                  CodigoProducto: selected.CodigoProducto,
                  CantidadUtilizada: cantidad,
                  PrecioProducto: selected.Precio,
                  NombreProducto: selected.NombreProducto
                }
              ]));
              setProducto("");
              setCantidad(1);
              setSelectedActivity("");
            }} disabled={!selectedActivity || !producto || cantidad <= 0} />
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Actividad</th>
                <th className="px-4 py-2 text-left">Producto</th>
                <th className="px-4 py-2 text-left">Cantidad</th>
                <th className="px-4 py-2 text-left">Precio</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orderProducts.map((prod, idx) => (
                <tr key={idx} className="border-b">
                  <td className="px-4 py-2">{activities.find(a => a.CodigoServicio === prod.CodigoServicio && a.NumeroCorrelativoActividad === prod.NumeroCorrelativoActividad)?.DescripcionActividad || ""}</td>
                  <td className="px-4 py-2">{prod.NombreProducto}</td>
                  <td className="px-4 py-2">{prod.CantidadUtilizada}</td>
                  <td className="px-4 py-2">{prod.PrecioProducto}</td>
                  <td className="px-4 py-2">
                    <Button color="danger" label="Eliminar" small onClick={() => setOrderProducts(orderProducts.filter((_, i) => i !== idx))} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBox>
      </div>
    </SectionMain>
  );
} 