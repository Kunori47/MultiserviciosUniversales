"use client";

import { useEffect, useState } from "react";
import Button from "../../_components/Button";
import CardBox from "../../_components/CardBox";
import Divider from "../../_components/Divider";
import SectionMain from "../../_components/Section/Main";
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton";
import { mdiAccount, mdiPlus } from "@mdi/js";
import TableCustomer from "./TableCustomer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function getMonthYear(date: Date) {
  return { mes: date.getMonth() + 1, anio: date.getFullYear() };
}

export default function CustomerListPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [frequency, setFrequency] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [loadingFreq, setLoadingFreq] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    const res = await fetch("http://127.0.0.1:8000/customer");
    const data = await res.json();
    setCustomers(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const fetchFrequencyTotal = async () => {
    setLoadingFreq(true);
    const res = await fetch(`http://127.0.0.1:8000/customer/frequency_total`);
    const data = await res.json();
    const freqMap: Record<string, number> = {};
    (Array.isArray(data) ? data : []).forEach((c: any) => {
      freqMap[c.CI] = c.FrecuenciaTotal ?? 0;
    });
    setFrequency(freqMap);
    setLoadingFreq(false);
  };

  const fetchFrequency = async (mes: number, anio: number) => {
    setLoadingFreq(true);
    const res = await fetch(`http://127.0.0.1:8000/customer/frequency?mes=${mes}&anio=${anio}`);
    const data = await res.json();
    const freqMap: Record<string, number> = {};
    (Array.isArray(data) ? data : []).forEach((c: any) => {
      freqMap[c.CI] = c.FrecuenciaMensual ?? 0;
    });
    setFrequency(freqMap);
    setLoadingFreq(false);
  };

  useEffect(() => {
    fetchCustomers();
    fetchFrequencyTotal();
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      fetchFrequencyTotal();
    } else {
      const { mes, anio } = getMonthYear(selectedDate);
      fetchFrequency(mes, anio);
    }
  }, [selectedDate]);

  const handleDelete = async (ci: string) => {
    if (!confirm("¿Seguro que deseas eliminar este cliente?")) return;
    const res = await fetch(`http://127.0.0.1:8000/customer/delete_with_phones?CI=${ci}`, { method: "DELETE" });
    if (res.ok) {
      setCustomers(customers.filter(c => c.CI !== ci));
    } else {
      alert("Error al eliminar el cliente");
    }
  };

  return (
    <SectionMain>
      <SectionTitleLineWithButton
        icon={mdiAccount}
        title="Gestión de Clientes"
        main
      >
        <Button
          href="/dashboard/customer/create"
          color="success"
          label="Crear Nuevo Cliente"
          icon={mdiPlus}
          roundedFull
        />
      </SectionTitleLineWithButton>
      <Divider />
      <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
        <label className="font-bold">Frecuencia de visitas para el mes:</label>
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          showFullMonthYearPicker
          isClearable
          className="border-2 border-gray-300 rounded-lg px-3 py-2"
        />
        {loadingFreq && <span className="ml-2 text-gray-500">Cargando frecuencia...</span>}
      </div>
      <CardBox>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Cargando clientes...</span>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay clientes registrados</div>
        ) : (
          <TableCustomer customers={customers} frequency={frequency} onDelete={handleDelete} />
        )}
      </CardBox>
    </SectionMain>
  );
} 