"use client";

import { mdiPencil, mdiTrashCan } from "@mdi/js";
import React, { useState } from "react";
import Button from "../../_components/Button";
import Buttons from "../../_components/Buttons";
import CardBoxModal from "../../_components/CardBox/Modal";
import { useRouter } from "next/navigation";

type Props = {
  specialties: any[];
  onDelete: (codigo: number) => void;
};

const TableSpecialty = ({ specialties, onDelete }: Props) => {
  const perPage = 5;
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedSpecialty, setSelectedSpecialty] = useState<any | null>(null);
  const [isModalTrashActive, setIsModalTrashActive] = useState(false);

  const numPages = Math.ceil(specialties.length / perPage);
  const pagesList: number[] = [];
  for (let i = 0; i < numPages; i++) pagesList.push(i);

  const specialtiesPaginated = specialties.slice(
    perPage * currentPage,
    perPage * (currentPage + 1)
  );

  const handleDelete = () => {
    if (!selectedSpecialty) return;
    onDelete(selectedSpecialty.CodigoEspecialidad);
    setIsModalTrashActive(false);
    setSelectedSpecialty(null);
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
          ¿Estás seguro de que quieres <b>eliminar</b> la especialidad?
        </p>
      </CardBoxModal>
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {specialtiesPaginated.map((s) => (
            <tr key={s.CodigoEspecialidad}>
              <td data-label="Código">{s.CodigoEspecialidad}</td>
              <td data-label="Descripción">{s.DescripcionEspecialidad}</td>
              <td className="before:hidden lg:w-1 whitespace-nowrap">
                <Buttons type="justify-start lg:justify-end" noWrap>
                  <Button
                    color="info"
                    icon={mdiPencil}
                    href={`/dashboard/specialty/edit/${s.CodigoEspecialidad}`}
                    small
                    isGrouped
                  />
                  <Button
                    color="danger"
                    icon={mdiTrashCan}
                    onClick={() => {
                      setIsModalTrashActive(true);
                      setSelectedSpecialty(s);
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

export default TableSpecialty; 