"use client";

import { mdiEye, mdiInformation, mdiTagEdit, mdiTrashCan } from "@mdi/js";
import React, { useState } from "react";
import { Specialty } from "../../../../_interfaces";
import Button from "../../../../_components/Button";
import Buttons from "../../../../_components/Buttons";
import CardBoxModal from "../../../../_components/CardBox/Modal";
import { useRouter } from "next/navigation";

type Props = {
  specialties: Specialty[];
};

const TableSpecialty = ({ specialties }: Props) => {
  const perPage = 5;

  const router = useRouter();

  const numPages = specialties.length / perPage;

  const pagesList: number[] = [];

  for (let i = 0; i < numPages; i++) {
    pagesList.push(i);
  }

  const [currentPage, setCurrentPage] = useState(0);
  const specialtiesPaginated = specialties.slice(
    perPage * currentPage,
    perPage * (currentPage + 1),
  );

  const [selectedSpecialty, setSelectedSpecialty] = useState<any | null>(null);
  const [isModalTrashActive, setIsModalTrashActive] = useState(false);

  const handleDelete = async () => {
    if (!selectedSpecialty) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/specialty/delete?CodigoEspecialidad=${selectedSpecialty.CodigoEspecialidad}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar especialidad");
      // Actualiza el estado local:
      const updated = specialties.filter(s => s.CodigoEspecialidad !== selectedSpecialty.CodigoEspecialidad);
      setIsModalTrashActive(false);
      setSelectedSpecialty(null);
    } catch (err) {
      alert("No se pudo eliminar la especialidad");
    }
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
          setSelectedSpecialty(null);
        }}
      >
        <p>
            ¿Estás seguro de que quieres eliminar la especialidad <b>{selectedSpecialty?.DescripcionEspecialidad}</b>?
        </p>
      </CardBoxModal>

      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {specialtiesPaginated.map((specialty: Specialty) => (
            <tr key={specialty.CodigoEspecialidad} >
              <td data-label="Código">#{specialty.CodigoEspecialidad}</td>
              <td data-label="Descripción">{specialty.DescripcionEspecialidad}</td>
              <td className="before:hidden lg:w-1 whitespace-nowrap">
                <Buttons type="justify-start lg:justify-end" noWrap>
                  <Button
                    color="info"
                    icon={mdiInformation}
                    href={`/dashboard/administration/specialty/${specialty.CodigoEspecialidad}`}
                    small
                    isGrouped>
                    
                  </Button>
                  <Button
                    color="contrast"
                    icon={mdiTagEdit}
                    href={`/dashboard/administration/specialty/update/${specialty.CodigoEspecialidad}`}
                    small
                    isGrouped
                  />
                  <Button
                    color="danger"
                    icon={mdiTrashCan}
                    onClick={() => {
                      setIsModalTrashActive(true);
                      setSelectedSpecialty(specialty);
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
            Página {currentPage + 1} de {(numPages < 0) ? numPages : 1}
          </small>
        </div>
      </div>
    </>
  );
};

export default TableSpecialty; 