"use client";

import {
  mdiBallotOutline,
  mdiCurrencyUsd,
  mdiCalendar,
  mdiChartLine,
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

export default function RevenuePage() {
  const params = useParams();
  const rif = params?.rif as string;
  const [franchise, setFranchise] = useState<any>(null);
  const [fecha, setFecha] = useState<Date | null>(null);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);

  useEffect(() => {
    if (rif) {
      fetchFranchiseInfo();
    }
  }, [rif]);

  useEffect(() => {
    if (franchise) {
      fetchRevenueData();
      fetchPurchases();
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

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const mes = fecha ? fecha.getMonth() + 1 : new Date().getMonth() + 1;
      const anio = fecha ? fecha.getFullYear() : new Date().getFullYear();
      
      const res = await fetch(`http://127.0.0.1:8000/views/remenfranq?FranquiciaRIF=${rif}&Anio=${anio}&Mes=${mes}`);
      if (!res.ok) throw new Error("Error cargando datos de ingresos");
      const data = await res.json();
      setRevenueData(data && data.length > 0 ? data[0] : null);
    } catch (err) {
      console.error("Error:", err);
      setRevenueData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchases = async () => {
    setLoadingPurchases(true);
    try {
      let url = `http://127.0.0.1:8000/purchase/franchise/${rif}`;
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
      if (!res.ok) throw new Error("Error cargando compras");
      const data = await res.json();
      setPurchases(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error:", err);
      setPurchases([]);
    } finally {
      setLoadingPurchases(false);
    }
  };

  const calculateTotalPurchases = () => {
    return purchases.reduce((total, purchase) => total + (purchase.Monto || 0), 0);
  };

  const handleDateChange = (date: Date | null) => {
    setFecha(date);
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
      month: 'long'
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

  return (
    <>
      <SectionMain>
        <div className="max-w-6xl mx-auto">
          <SectionTitleLineWithButton
            icon={mdiCurrencyUsd}
            title={`Análisis de Gastos - ${franchise.Nombre}`}
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

          {/* Selector de Fecha */}
          <CardBox className="mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <i className="mdi mdi-calendar text-gray-600"></i>
                <h3 className="text-lg font-semibold text-gray-800">
                  {fecha ? 'Filtrar por Mes' : 'Mostrar Todas las Compras'}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <DatePicker
                  selected={fecha}
                  onChange={handleDateChange}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  placeholderText="Selecciona mes y año"
                  className="border-2 border-gray-300 rounded-lg px-4 py-2 text-center focus:border-blue-500 focus:outline-none"
                />
                {fecha && (
                  <Button
                    color="danger"
                    outline
                    small
                    onClick={() => setFecha(null)}
                    label="Limpiar Filtro"
                  />
                )}
              </div>
            </div>
          </CardBox>

          {/* Historial de Compras */}
          <CardBox className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Historial de Compras</h3>
              {!loadingPurchases && purchases.length > 0 && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Gastos:</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(calculateTotalPurchases())}</p>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">N° Compra</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Fecha</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Proveedor</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Producto</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Categoría</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cantidad Pedida</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cantidad Disponible</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Monto</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingPurchases ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2">Cargando compras...</p>
                      </td>
                    </tr>
                  ) : purchases.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                        {fecha ? 'No se encontraron compras para este período' : 'No se encontraron compras'}
                      </td>
                    </tr>
                  ) : (
                    purchases.map((purchase) => (
                      <tr key={`${purchase.NumeroCompra}-${purchase.NombreProducto}`} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          #{purchase.NumeroCompra}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {formatDate(purchase.Fecha)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <div>
                            <div className="font-medium">{purchase.NombreProveedor}</div>
                            <div className="text-xs text-gray-500">{purchase.RIFProveedor}</div>
                            <div className="text-xs text-gray-500">{purchase.PersonaContacto}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <div>
                            <div className="font-medium">{purchase.NombreProducto}</div>
                            <div className="text-xs text-gray-500">{purchase.DescripcionProducto}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {purchase.Categoria}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {purchase.CantidadPedida}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {purchase.CantidadDisponible}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-red-600">
                          {formatCurrency(purchase.Monto)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <Button
                            color="info"
                            outline
                            small
                            href={`/dashboard/franchise/${rif}/revenue/purchase/${purchase.NumeroCompra}`}
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