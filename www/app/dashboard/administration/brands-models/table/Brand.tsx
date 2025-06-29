"use client";

import { mdiEye, mdiTrashCan, mdiPencil } from "@mdi/js";
import React, { useState } from "react";
import { Brand } from "../../../../_interfaces";
import Button from "../../../../_components/Button";
import Buttons from "../../../../_components/Buttons";
import CardBoxModal from "../../../../_components/CardBox/Modal";

type Props = {
  brands: Brand[];
};

const TableBrand = ({ brands }: Props) => {
  const perPage = 5;

  const numPages = brands.length / perPage;

  const pagesList: number[] = [];

  for (let i = 0; i < numPages; i++) {
    pagesList.push(i);
  }

  const [currentPage, setCurrentPage] = useState(0);
  const brandsPaginated = brands.slice(
    perPage * currentPage,
    perPage * (currentPage + 1),
  );

  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isModalInfoActive, setIsModalInfoActive] = useState(false);
  const [isModalTrashActive, setIsModalTrashActive] = useState(false);

  const handleModalAction = () => {
    setIsModalInfoActive(false);
    setIsModalTrashActive(false);
    setSelectedBrand(null);
  };

  const handleView = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsModalInfoActive(true);
  };

  const handleDelete = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsModalTrashActive(true);
  };

  const confirmDelete = () => {
    if (selectedBrand) {
      console.log(`Eliminando marca: ${selectedBrand.CodigoMarca}`);
      handleModalAction();
    }
  };

  return (
    <>
      <CardBoxModal
        title="Informacion de la Marca"
        buttonColor="info"
        buttonLabel="Cerrar"
        isActive={isModalInfoActive}
        onConfirm={handleModalAction}
      >
        {selectedBrand && (
          <div className="space-y-3">
            <div>
              <strong>Codigo:</strong> {selectedBrand.CodigoMarca}
            </div>
            <div>
              <strong>Nombre:</strong> {selectedBrand.Nombre}
            </div>
          </div>
        )}
      </CardBoxModal>

      <CardBoxModal
        title="Por favor confirma"
        buttonColor="danger"
        buttonLabel="Confirmar"
        isActive={isModalTrashActive}
        onConfirm={confirmDelete}
        onCancel={handleModalAction}
      >
        <p>
          Estas seguro de que quieres eliminar la marca <b>{selectedBrand?.Nombre}</b>?
        </p>
      </CardBoxModal>

      <table>
        <thead>
          <tr>
            <th>Codigo</th>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {brandsPaginated.map((brand: Brand) => (
            <tr key={brand.CodigoMarca}>
              <td data-label="Codigo">#{brand.CodigoMarca}</td>
              <td data-label="Nombre">{brand.Nombre}</td>
              <td className="before:hidden lg:w-1 whitespace-nowrap">
                <Buttons type="justify-start lg:justify-end" noWrap>
                  <Button
                    color="info"
                    icon={mdiEye}
                    onClick={() => handleView(brand)}
                    small
                    isGrouped
                  />
                  <Button
                    color="contrast"
                    icon={mdiPencil}
                    href={`/dashboard/administration/brands-models/update-brand/${brand.CodigoMarca}`}
                    small
                    isGrouped
                  />
                  <Button
                    color="danger"
                    icon={mdiTrashCan}
                    onClick={() => handleDelete(brand)}
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
            Pagina {currentPage + 1} de {(numPages < 0) ? numPages : 1}
          </small>
        </div>
      </div>
    </>
  );
};

export default TableBrand;
