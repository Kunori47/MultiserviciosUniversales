"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "../../../_components/Button";
import CardBox from "../../../_components/CardBox";
import Divider from "../../../_components/Divider";
import SectionMain from "../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../_components/Section/TitleLineWithButton";
import { mdiCar, mdiArrowLeft, mdiAccount, mdiInformation } from "@mdi/js";

interface Brand {
  CodigoMarca: number;
  Nombre: string;
}

interface Model {
  CodigoMarca: number;
  NumeroCorrelativoModelo: number;
  DescripcionModelo: string;
  CantidadPuestos: number;
  TipoRefrigerante: string;
  TipoGasolina: string;
  TipoAceite: string;
  Peso: number;
}

interface Customer {
  CI: string;
  NombreCompleto: string;
  Email: string;
}

export default function VehicleInfoPage() {
  const params = useParams();
  const router = useRouter();
  const codigoVehiculo = params?.codigoVehiculo as string;
  const [vehicle, setVehicle] = useState<any>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [model, setModel] = useState<Model | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!codigoVehiculo) return;
    
    const fetchData = async () => {
      try {
        // Fetch vehicle data
        const vehicleRes = await fetch(`http://127.0.0.1:8000/vehicle/${codigoVehiculo}`);
        const vehicleData = await vehicleRes.json();
        setVehicle(vehicleData);

        // Fetch brand data
        const brandRes = await fetch(`http://127.0.0.1:8000/brand/${vehicleData.CodigoMarca}`);
        const brandData = await brandRes.json();
        setBrand(brandData);

        // Fetch model data
        const modelRes = await fetch(`http://127.0.0.1:8000/model/${vehicleData.CodigoMarca}/${vehicleData.NumeroCorrelativoModelo}`);
        const modelData = await modelRes.json();
        setModel(modelData);

        // Fetch customer data
        const customerRes = await fetch(`http://127.0.0.1:8000/customer/${vehicleData.CedulaCliente}`);
        const customerData = await customerRes.json();
        setCustomer(customerData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const res = await fetch(`http://127.0.0.1:8000/service_order/vehicle/${codigoVehiculo}`);
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchData();
    fetchOrders();
  }, [codigoVehiculo]);

  if (loading || !vehicle) {
    return (
      <SectionMain>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Cargando vehículo...</span>
        </div>
      </SectionMain>
    );
  }

  return (
    <SectionMain>
      <SectionTitleLineWithButton
        icon={mdiCar}
        title={`Información del Vehículo: ${vehicle.Placa}`}
        main
      >
        <Button
          href="/dashboard/vehicle"
          color="info"
          label="Atras"
          icon={mdiArrowLeft}
          roundedFull
        />
      </SectionTitleLineWithButton>
      <Divider />
      
      {/* Información del Vehículo */}
      <CardBox className="mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Datos del Vehículo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1">Código del Vehículo</label>
            <p className="text-gray-800 dark:text-gray-200 font-mono text-lg">{vehicle.CodigoVehiculo}</p>
          </div>
          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1">Placa</label>
            <p className="text-gray-800 dark:text-gray-200 font-semibold text-lg">{vehicle.Placa}</p>
          </div>
          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1">Fecha de Adquisición</label>
            <p className="text-gray-800 dark:text-gray-200">{vehicle.FechaAdquisicion}</p>
          </div>
          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1">Tipo de Aceite</label>
            <p className="text-gray-800 dark:text-gray-200">{vehicle.TipoAceite}</p>
          </div>
        </div>
      </CardBox>

      {/* Información de la Marca y Modelo */}
      <CardBox className="mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Información de Marca y Modelo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1">Marca</label>
            <p className="text-gray-800 dark:text-gray-200 font-semibold">{brand?.Nombre || 'Cargando...'}</p>
          </div>
          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1">Modelo</label>
            <p className="text-gray-800 dark:text-gray-200">{model?.DescripcionModelo || 'Cargando...'}</p>
          </div>
          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1">Cantidad de Puestos</label>
            <p className="text-gray-800 dark:text-gray-200">{model?.CantidadPuestos || 'N/A'}</p>
          </div>
          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1">Peso</label>
            <p className="text-gray-800 dark:text-gray-200">{model?.Peso ? `${model.Peso} kg` : 'N/A'}</p>
          </div>
          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1">Tipo de Refrigerante</label>
            <p className="text-gray-800 dark:text-gray-200">{model?.TipoRefrigerante || 'N/A'}</p>
          </div>
          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1">Tipo de Gasolina</label>
            <p className="text-gray-800 dark:text-gray-200">{model?.TipoGasolina || 'N/A'}</p>
          </div>
        </div>
      </CardBox>

      {/* Información del Propietario */}
      <CardBox>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-gray-800 dark:text-gray-200">Información del Propietario</span>
          <span className="text-gray-500">({customer?.NombreCompleto || 'Cargando...'})</span>
        </div>
        {customer ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1">Cédula</label>
              <p className="text-gray-800 dark:text-gray-200 font-mono">{customer.CI}</p>
            </div>
            <div>
              <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1">Nombre Completo</label>
              <p className="text-gray-800 dark:text-gray-200 font-semibold">{customer.NombreCompleto}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1">Email</label>
              <p className="text-gray-800 dark:text-gray-200">{customer.Email}</p>
            </div>
            <div className="md:col-span-2">
              <Button
                href={`/dashboard/customer/${customer.CI}`}
                color="info"
                label="Ver Detalles del Cliente"
                icon={mdiAccount}
                small
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <span>Cargando información del propietario...</span>
          </div>
        )}
      </CardBox>

      {/* Órdenes de Servicio del Vehículo */}
      <CardBox className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Órdenes de Servicio Realizadas a este Vehículo
        </h2>
        {ordersLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Cargando órdenes...</span>
          </div>
        ) : (
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
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      No se encontraron órdenes de servicio para este vehículo
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.NumeroOrden} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        #{order.NumeroOrden}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {order.FechaOrden ? new Date(order.FechaOrden).toLocaleDateString('es-ES') : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {order.HoraEntrada ? order.HoraEntrada.substring(0,5) : "-"}
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
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.Estado === "Completado" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                          {order.Estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {order.FechaSalidaReal ? new Date(order.FechaSalidaReal).toLocaleDateString('es-ES') : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                        {order.Comentario || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardBox>
    </SectionMain>
  );
} 