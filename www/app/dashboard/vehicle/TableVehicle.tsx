"use client";

import { mdiPencil, mdiTrashCan, mdiEye, mdiMagnify, mdiTagEdit } from "@mdi/js";
import React, { useState } from "react";
import Button from "../../_components/Button";
import Buttons from "../../_components/Buttons";
import CardBoxModal from "../../_components/CardBox/Modal";
import { useRouter } from "next/navigation";

type Props = {
  vehicles: any[];
  onDelete: (codigo: number) => void;
};

const TableVehicle = ({ vehicles, onDelete }: Props) => {
  const perPage = 5;
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [isModalTrashActive, setIsModalTrashActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar vehículos por placa
  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.Placa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const numPages = Math.ceil(filteredVehicles.length / perPage);
  const pagesList: number[] = [];
  for (let i = 0; i < numPages; i++) pagesList.push(i);

  const vehiclesPaginated = filteredVehicles.slice(
    perPage * currentPage,
    perPage * (currentPage + 1)
  );

  const handleDelete = () => {
    if (!selectedVehicle) return;
    onDelete(selectedVehicle.CodigoVehiculo);
    setIsModalTrashActive(false);
    setSelectedVehicle(null);
  };

  // Resetear página cuando cambie la búsqueda
  React.useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

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
          setSelectedVehicle(null);
        }}
      >
        <p>
          ¿Estás seguro de que quieres <b>eliminar</b> el vehículo?
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
            placeholder="Buscar por placa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-slate-800 dark:border-slate-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 sm:text-sm"
          />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Placa</th>
            <th>Fecha Adquisición</th>
            <th>Tipo Aceite</th>
            <th>Cédula Cliente</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehiclesPaginated.map((v) => (
            <tr key={v.CodigoVehiculo}>
              <td data-label="Código">{v.CodigoVehiculo}</td>
              <td data-label="Placa">{v.Placa}</td>
              <td data-label="Fecha Adquisición">{v.FechaAdquisicion}</td>
              <td data-label="Tipo Aceite">{v.TipoAceite}</td>
              <td data-label="Cédula Cliente">{v.CedulaCliente}</td>
              <td className="before:hidden lg:w-1 whitespace-nowrap">
                <Buttons type="justify-start lg:justify-end" noWrap>
                  <Button
                    color="info"
                    icon={mdiEye}
                    href={`/dashboard/vehicle/${v.CodigoVehiculo}`}
                    small
                    isGrouped
                  />
                  <Button
                    color="contrast"
                    icon={mdiTagEdit}
                    href={`/dashboard/vehicle/edit/${v.CodigoVehiculo}`}
                    small
                    isGrouped
                  />
                  <Button
                    color="danger"
                    icon={mdiTrashCan}
                    onClick={() => {
                      setIsModalTrashActive(true);
                      setSelectedVehicle(v);
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

export default TableVehicle; 