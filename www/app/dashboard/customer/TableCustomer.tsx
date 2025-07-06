"use client";

import { mdiPencil, mdiTrashCan, mdiEye, mdiTagEdit, mdiMagnify, mdiPhone } from "@mdi/js";
import React, { useState, useEffect } from "react";
import Button from "../../_components/Button";
import Buttons from "../../_components/Buttons";
import CardBoxModal from "../../_components/CardBox/Modal";
import { useRouter } from "next/navigation";

type Props = {
  customers: any[];
  frequency?: Record<string, number>;
  onDelete: (ci: string) => void;
};

const TableCustomer = ({ customers, frequency = {}, onDelete }: Props) => {
  const perPage = 5;
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [isModalTrashActive, setIsModalTrashActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerPhones, setCustomerPhones] = useState<Record<string, string[]>>({});

  // Cargar teléfonos de todos los clientes
  useEffect(() => {
    const fetchPhones = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/customer_phone");
        const phonesData = await response.json();
        
        const phonesMap: Record<string, string[]> = {};
        phonesData.forEach((phone: any) => {
          if (!phonesMap[phone.Cliente]) {
            phonesMap[phone.Cliente] = [];
          }
          phonesMap[phone.Cliente].push(phone.Telefono);
        });
        
        setCustomerPhones(phonesMap);
      } catch (error) {
        console.error("Error cargando teléfonos:", error);
      }
    };

    fetchPhones();
  }, []);

  // Filtrar clientes por nombre completo
  const filteredCustomers = customers.filter((customer) =>
    customer.NombreCompleto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ordenar por frecuencia mensual descendente
  const sortedCustomers = [...filteredCustomers].sort((a, b) => (frequency[b.CI] ?? 0) - (frequency[a.CI] ?? 0));

  const numPages = Math.ceil(sortedCustomers.length / perPage);
  const pagesList: number[] = [];
  for (let i = 0; i < numPages; i++) pagesList.push(i);

  const customersPaginated = sortedCustomers.slice(
    perPage * currentPage,
    perPage * (currentPage + 1)
  );

  const handleDelete = () => {
    if (!selectedCustomer) return;
    onDelete(selectedCustomer.CI);
    setIsModalTrashActive(false);
    setSelectedCustomer(null);
  };

  // Resetear página cuando cambie la búsqueda
  React.useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  const formatPhone = (phone: string) => {
    // Mostrar como XXXX-XXXXXXX (4 dígitos, guion, 7 dígitos)
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 12) {
      return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    }
    return phone;
  };

  return (
    <>
      <CardBoxModal
        title="Por favor confirma"
        buttonColor="danger"
        buttonLabel="Confirmar"
        isActive={isModalTrashActive}
        onConfirm={handleDelete}
        onCancel={() => {
          setIsModalTrashActive(false);
          setSelectedCustomer(null);
        }}
      >
        <p>
          ¿Estás seguro de que quieres <b>eliminar</b> el cliente?
        </p>
      </CardBoxModal>
      
      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-slate-800 dark:border-slate-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 sm:text-sm"
          />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>CI</th>
            <th>Nombre Completo</th>
            <th>Email</th>
            <th>Teléfonos</th>
            <th>Frecuencia (mes)</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {customersPaginated.map((c) => (
            <tr key={c.CI}>
              <td data-label="CI">{c.CI}</td>
              <td data-label="Nombre Completo">{c.NombreCompleto}</td>
              <td data-label="Email">{c.Email}</td>
              <td data-label="Teléfonos">
                {customerPhones[c.CI] && customerPhones[c.CI].length > 0 ? (
                  <div className="space-y-1">
                    {customerPhones[c.CI].map((phone, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <i className="mdi mdi-phone text-blue-600 mr-1"></i>
                        <span className="font-mono">{formatPhone(phone)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">Sin teléfonos</span>
                )}
              </td>
              <td data-label="Frecuencia (mes)">{frequency[c.CI] ?? 0}</td>
              <td className="before:hidden lg:w-1 whitespace-nowrap">
                <Buttons type="justify-start lg:justify-end" noWrap>
                  <Button
                    color="info"
                    icon={mdiEye}
                    href={`/dashboard/customer/${c.CI}`}
                    small
                    isGrouped
                  />
                  <Button
                    color="contrast"
                    icon={mdiTagEdit}
                    href={`/dashboard/customer/edit/${c.CI}`}
                    small
                    isGrouped
                  />
                  <Button
                    color="danger"
                    icon={mdiTrashCan}
                    onClick={() => {
                      setIsModalTrashActive(true);
                      setSelectedCustomer(c);
                    }}
                    small
                    isGrouped
                  />
                </Buttons>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 md:py-0">
          <Buttons>
            {pagesList.map((page) => (
              <Button
                key={page}
                active={page === currentPage}
                label={(page + 1).toString()}
                color={page === currentPage ? "lightDark" : "whiteDark"}
                small
                onClick={() => setCurrentPage(page)}
                isGrouped
              />
            ))}
          </Buttons>
          <small className="mt-6 md:mt-0">
            Page {currentPage + 1} of {numPages}
          </small>
        </div>
      </div>
    </>
  );
};

export default TableCustomer; 