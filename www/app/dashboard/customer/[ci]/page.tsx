"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "../../../_components/Button";
import CardBox from "../../../_components/CardBox";
import Divider from "../../../_components/Divider";
import SectionMain from "../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../_components/Section/TitleLineWithButton";
import { mdiAccount, mdiArrowLeft, mdiCar, mdiPhone } from "@mdi/js";

export default function CustomerInfoPage() {
  const params = useParams();
  const router = useRouter();
  const ci = params?.ci as string;
  const [customer, setCustomer] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [phones, setPhones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [loadingPhones, setLoadingPhones] = useState(true);

  useEffect(() => {
    if (!ci) return;
    
    const fetchCustomerData = async () => {
      try {
        // Cargar datos del cliente
        const customerRes = await fetch(`http://127.0.0.1:8000/customer/${ci}`);
        const customerData = await customerRes.json();
        setCustomer(customerData);
        setLoading(false);

        // Cargar vehículos
        const vehiclesRes = await fetch(`http://127.0.0.1:8000/vehicle`);
        const vehiclesData = await vehiclesRes.json();
        setVehicles(Array.isArray(vehiclesData) ? vehiclesData.filter((v: any) => v.CedulaCliente === ci) : []);
        setLoadingVehicles(false);

        // Cargar teléfonos
        const phonesRes = await fetch(`http://127.0.0.1:8000/customer_phone/${ci}`);
        const phonesData = await phonesRes.json();
        setPhones(phonesData);
        setLoadingPhones(false);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setLoading(false);
        setLoadingVehicles(false);
        setLoadingPhones(false);
      }
    };

    fetchCustomerData();
  }, [ci]);

  // Copia la función de formateo de TableCustomer.tsx
  const formatPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 12) {
      return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    }
    return phone;
  };

  if (loading || !customer) {
    return (
      <SectionMain>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Cargando cliente...</span>
        </div>
      </SectionMain>
    );
  }

  return (
    <SectionMain>
      <SectionTitleLineWithButton
        icon={mdiAccount}
        title={`Información del Cliente: ${customer.NombreCompleto}`}
        main
      >
        <Button
          href="/dashboard/customer"
          color="info"
          label="Atras"
          icon={mdiArrowLeft}
          roundedFull
        />
      </SectionTitleLineWithButton>
      <Divider />
      <CardBox className="mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Datos del Cliente
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1">Cédula</label>
            <p className="text-gray-800 dark:text-gray-200">{customer.CI}</p>
          </div>
          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1">Nombre Completo</label>
            <p className="text-gray-800 dark:text-gray-200">{customer.NombreCompleto}</p>
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1">Email</label>
            <p className="text-gray-800 dark:text-gray-200">{customer.Email}</p>
          </div>
        </div>
      </CardBox>

      {/* Sección de Teléfonos */}
      <CardBox className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-gray-800 dark:text-gray-200">Teléfonos del Cliente</span>
          <span className="text-gray-500">({phones.length})</span>
        </div>
        {loadingPhones ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Cargando teléfonos...</span>
          </div>
        ) : (Array.isArray(phones) ? phones : []).length === 0 ? (
          <div className="text-center py-8 text-gray-500">Este cliente no tiene teléfonos registrados</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Array.isArray(phones) ? phones : []).map((phone, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <i className="mdi mdi-phone text-blue-600"></i>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    Teléfono {index + 1}
                  </span>
                </div>
                <p className="font-mono text-lg text-gray-900 dark:text-gray-100 mt-1">
                  {formatPhone(phone.Telefono)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardBox>

      <CardBox>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-gray-800 dark:text-gray-200">Vehículos del Cliente</span>
          <span className="text-gray-500">({vehicles.length})</span>
        </div>
        {loadingVehicles ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Cargando vehículos...</span>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Este cliente no tiene vehículos registrados</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Código</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Placa</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Fecha Adquisición</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Tipo Aceite</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v, idx) => (
                  <tr key={v.CodigoVehiculo} className={idx % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-900"}>
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200 font-mono">{v.CodigoVehiculo}</td>
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200 font-semibold">{v.Placa}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{v.FechaAdquisicion}</td>
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{v.TipoAceite}</td>
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