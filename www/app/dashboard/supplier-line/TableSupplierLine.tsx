"use client";

import { mdiPencil, mdiTrashCan, mdiMagnify } from "@mdi/js";
import React, { useState } from "react";
import Button from "../../_components/Button";
import Buttons from "../../_components/Buttons";
import CardBoxModal from "../../_components/CardBox/Modal";
import { useRouter } from "next/navigation";

type Props = {
  lines: any[];
  onDelete: (codigo: number) => void;
};

const TableSupplierLine = ({ lines, onDelete }: Props) => {
  const perPage = 5;
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedLine, setSelectedLine] = useState<any | null>(null);
  const [isModalTrashActive, setIsModalTrashActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar líneas de suministro por descripción
  const filteredLines = lines.filter((line) =>
    line.DescripcionLinea.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const numPages = Math.ceil(filteredLines.length / perPage);
  const pagesList: number[] = [];
  for (let i = 0; i < numPages; i++) pagesList.push(i);

  const linesPaginated = filteredLines.slice(
    perPage * currentPage,
    perPage * (currentPage + 1)
  );

  const handleDelete = () => {
    if (!selectedLine) return;
    onDelete(selectedLine.CodigoLinea);
    setIsModalTrashActive(false);
    setSelectedLine(null);
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
          setSelectedLine(null);
        }}
      >
        <p>
          ¿Estás seguro de que quieres <b>eliminar</b> la línea de suministro?
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
            placeholder="Buscar por descripción..."
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
            <th>Descripción</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {linesPaginated.map((l) => (
            <tr key={l.CodigoLinea}>
              <td data-label="Código">{l.CodigoLinea}</td>
              <td data-label="Descripción">{l.DescripcionLinea}</td>
              <td className="before:hidden lg:w-1 whitespace-nowrap">
                <Buttons type="justify-start lg:justify-end" noWrap>
                  <Button
                    color="info"
                    icon={mdiPencil}
                    href={`/dashboard/supplier-line/edit/${l.CodigoLinea}`}
                    small
                    isGrouped
                  />
                  <Button
                    color="danger"
                    icon={mdiTrashCan}
                    onClick={() => {
                      setIsModalTrashActive(true);
                      setSelectedLine(l);
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

export default TableSupplierLine; 