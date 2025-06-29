"use client";

import {
  mdiBallotOutline,
  mdiAccountGroup,
  mdiPackage,
  mdiInformation,
  mdiCalendar,
  mdiClock,
} from "@mdi/js";
import Button from "../../../../../_components/Button";
import Divider from "../../../../../_components/Divider";
import CardBox from "../../../../../_components/CardBox";
import SectionMain from "../../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../../_components/Section/TitleLineWithButton";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderDetailsPage() {
  const params = useParams();
  const rif = params?.rif as string;
  const numeroOrden = params?.numeroOrden as string;
  const [franchise, setFranchise] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (rif && numeroOrden) {
      fetchFranchiseInfo();
      fetchOrderDetails();
    }
  }, [rif, numeroOrden]);

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

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/service_order/franchise/${rif}/${numeroOrden}/details`);
      if (!res.ok) throw new Error("Error cargando detalles de la orden");
      const data = await res.json();
      setOrderDetails(data);
    } catch (err) {
      console.error("Error:", err);
      setOrderDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalProducts = () => {
    if (!orderDetails?.products) return 0;
    return orderDetails.products.reduce((total: number, item: any) => total + (item.CantidadUtilizada || 0), 0);
  };

  const calculateTotalCost = () => {
    if (!orderDetails?.products) return 0;
    return orderDetails.products.reduce((total: number, item: any) => {
      const quantity = item.CantidadUtilizada || 0;
      const price = item.PrecioProducto || 0;
      return total + (quantity * price);
    }, 0);
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

  if (loading) {
    return (
      <SectionMain>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando detalles de la orden...</p>
        </div>
      </SectionMain>
    );
  }

  if (!orderDetails) {
    return (
      <SectionMain>
        <div className="text-center py-8">
          <i className="mdi mdi-clipboard-text text-6xl text-gray-400 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Orden No Encontrada</h3>
          <p className="text-gray-500 mb-4">
            No se encontraron detalles para la orden #{numeroOrden}
          </p>
          <Button
            href={`/dashboard/franchise/${rif}/orders`}
            color="info"
            label="Volver al Historial"
          />
        </div>
      </SectionMain>
    );
  }

  const order = orderDetails.order;

  return (
    <>
      <SectionMain>
        <div className="max-w-6xl mx-auto">
          <SectionTitleLineWithButton
            icon={mdiBallotOutline}
            title={`Detalles de Orden #${numeroOrden} - ${franchise.Nombre}`}
            main
          >
            <Button
              href={`/dashboard/franchise/${rif}/orders`}
              color="info"
              label="Volver al Historial"
              roundedFull
            />
          </SectionTitleLineWithButton>

          <Divider />

          {/* Información de la Orden */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <CardBox className="bg-white shadow-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <i className="mdi mdi-information text-blue-600 mr-2"></i>
                  Información de la Orden
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Número de Orden:</span>
                    <span className="font-semibold">#{order.NumeroOrden}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Fecha de Entrada:</span>
                    <span className="font-semibold">{formatDate(order.FechaOrden)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Hora de Entrada:</span>
                    <span className="font-semibold">{formatTime(order.HoraEntrada)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Estado:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.Estado === "Completado" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {order.Estado}
                    </span>
                  </div>
                  {order.FechaSalidaReal && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Fecha de Salida:</span>
                      <span className="font-semibold">{formatDate(order.FechaSalidaReal)}</span>
                    </div>
                  )}
                  {order.HoraSalidaReal && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Hora de Salida:</span>
                      <span className="font-semibold">{formatTime(order.HoraSalidaReal)}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardBox>

            <CardBox className="bg-white shadow-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <i className="mdi mdi-account text-blue-600 mr-2"></i>
                  Información del Cliente
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Nombre:</span>
                    <span className="font-semibold">{order.NombreCliente}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">CI:</span>
                    <span className="font-semibold">{order.CI_Cliente}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Vehículo:</span>
                    <span className="font-semibold">#{order.CodigoVehiculo}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Placa:</span>
                    <span className="font-semibold">{order.Placa}</span>
                  </div>
                  {order.Comentario && (
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600">Comentario:</span>
                      <span className="font-semibold text-right max-w-xs">{order.Comentario}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardBox>
          </div>

          {/* Empleados que Trabajaron */}
          <CardBox className="bg-white shadow-lg mb-8">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <i className="mdi mdi-account-group text-blue-600 mr-2"></i>
                Empleados que Trabajaron en la Orden
              </h3>

              {orderDetails.employees.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay empleados registrados para esta orden
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">CI</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nombre Completo</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Rol</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Teléfono</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails.employees.map((employee: any, index: number) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                            {employee.CI}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {employee.NombreCompleto}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {employee.Rol}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {employee.Telefono}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </CardBox>

          {/* Productos Utilizados */}
          <CardBox className="bg-white shadow-lg">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <i className="mdi mdi-package text-blue-600 mr-2"></i>
                Productos Utilizados en la Orden
              </h3>

              {orderDetails.products.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay productos registrados para esta orden
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Servicio</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actividad</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Producto</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Categoría</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cantidad Utilizada</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Precio Unitario</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderDetails.products.map((product: any, index: number) => (
                          <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {product.NombreServicio}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {product.DescripcionActividad}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              <div>
                                <div className="font-medium">{product.NombreProducto}</div>
                                <div className="text-xs text-gray-500">{product.DescripcionProducto}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {product.Categoria}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {product.CantidadUtilizada}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {formatCurrency(product.PrecioProducto)}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-red-600">
                              {formatCurrency(product.CantidadUtilizada * product.PrecioProducto)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <Divider />

                  <div className="flex justify-between items-center mt-6">
                    <div className="text-left">
                      <p className="text-sm text-gray-600">Total Productos Utilizados:</p>
                      <p className="text-lg font-semibold text-gray-800">{calculateTotalProducts()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg text-gray-600">Total Costo de Productos:</p>
                      <p className="text-3xl font-bold text-red-600">{formatCurrency(calculateTotalCost())}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardBox>
        </div>
      </SectionMain>
    </>
  );
} 