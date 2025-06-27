"use client";

import { mdiEye, mdiInformation, mdiTagEdit, mdiTrashCan } from "@mdi/js";
import React, { useState } from "react";
import { Franchise } from "../../../_interfaces";
import Button from "../../../_components/Button";
import Buttons from "../../../_components/Buttons";
import CardBoxModal from "../../../_components/CardBox/Modal";
import { useRouter } from "next/navigation";

type Props = {
  franchise: Franchise[];
};

const TableFranchise = ({ franchise }: Props) => {
  const perPage = 5;

  const router = useRouter();

  const numPages = franchise.length / perPage;

  const pagesList: number[] = [];

  for (let i = 0; i < numPages; i++) {
    pagesList.push(i);
  }


  const [currentPage, setCurrentPage] = useState(0);
  const clientsPaginated = franchise.slice(
    perPage * currentPage,
    perPage * (currentPage + 1),
  );

  const [selectedRIF, setSelectedRIF] = useState<any | null>(null);
  const [isModalInfoActive, setIsModalInfoActive] = useState(false);
  const [isModalTrashActive, setIsModalTrashActive] = useState(false);

const handleSetInactive = async () => {
  if (!selectedRIF) return;
  try {
    const res = await fetch(`http://127.0.0.1:8000/franchise/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...selectedRIF,
        Estatus: "No activo",
      }),
    });
    if (!res.ok) throw new Error("Error al actualizar franquicia");
    // Actualiza el estado local:
    const updated = franchise.map(f =>
      f.RIF === selectedRIF.RIF ? { ...f, Estatus: "No activo" } : f
    );
    // Si franchise viene de props, deberías levantar el estado al padre o recargar desde el backend.
    setIsModalTrashActive(false);
    setSelectedRIF(null);
  } catch (err) {
    alert("No se pudo actualizar la franquicia");
  }
};

  return (
    <>

      <CardBoxModal
        title="Por favor confirma"
        buttonColor="danger"
        buttonLabel="Confirmar"
        isActive={isModalTrashActive}
        onConfirm={handleSetInactive}
        onCancel={() => {
          setIsModalTrashActive(false);
          setSelectedRIF(null);
        }}
      >
        <p>
            ¿Estás seguro de que quieres colocar<b>inactivo</b> esta franquicia?
        </p>
      </CardBoxModal>

      <table>
        <thead>
          <tr>
            <th>RIF</th>
            <th>Franquicia</th>
            <th>Ciudad</th>
            <th>Cedula del Encargado</th>
            <th>Estatus</th>
          </tr>
        </thead>
        <tbody>
          {clientsPaginated.map((franchise: Franchise) => (
            <tr key={franchise.RIF} >
              <td data-label="RIF">{franchise.RIF}</td>
              <td data-label="Franquicia">{franchise.Nombre}</td>
              <td data-label="Ciudad">{franchise.Ciudad}</td>
              <td data-label="Encargado">{franchise.CI_Encargado}</td>
              <td data-label="Estatus" className="lg:w-1 whitespace-nowrap">
                <small className="text-gray-500 dark:text-slate-400">
                  {franchise.Estatus}
                </small>
              </td>
              <td className="before:hidden lg:w-1 whitespace-nowrap">
                <Buttons type="justify-start lg:justify-end" noWrap>
                  <Button
                    color="info"
                    icon={mdiInformation}
                    href={`/dashboard/franchise/${franchise.RIF}`}
                    small
                    isGrouped>
                    
                  </Button>
                  <Button
                    color="contrast"
                    icon={mdiTagEdit}
                    href={`/dashboard/franchise/update/${franchise.RIF}`}
                    small
                    isGrouped
                  />
                  <Button
                    color="danger"
                    icon={mdiTrashCan}
                    onClick={() => {
                      setIsModalTrashActive(true);
                      setSelectedRIF(franchise);
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

export default TableFranchise;
