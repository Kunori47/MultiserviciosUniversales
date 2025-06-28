"use client";

import { mdiEye, mdiTrashCan, mdiPencil } from "@mdi/js";
import React, { useState } from "react";
import { Vendor } from "../../../../_interfaces";
import Button from "../../../../_components/Button";
import Buttons from "../../../../_components/Buttons";
import CardBoxModal from "../../../../_components/CardBox/Modal";

type Props = {
  vendors: Vendor[];
};

const TableVendor = ({ vendors }: Props) => {
  const perPage = 5;

  const numPages = vendors.length / perPage;

  const pagesList: number[] = [];

  for (let i = 0; i < numPages; i++) {
    pagesList.push(i);
  }

  const [currentPage, setCurrentPage] = useState(0);
  const vendorsPaginated = vendors.slice(
    perPage * currentPage,
    perPage * (currentPage + 1),
  );

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isModalInfoActive, setIsModalInfoActive] = useState(false);
  const [isModalTrashActive, setIsModalTrashActive] = useState(false);

  const handleModalAction = () => {
    setIsModalInfoActive(false);
    setIsModalTrashActive(false);
    setSelectedVendor(null);
  };

  const handleView = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsModalInfoActive(true);
  };

  const handleDelete = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsModalTrashActive(true);
  };

  const confirmDelete = () => {
    if (selectedVendor) {
      // Aquí implementarías la lógica de eliminación
      console.log(`Eliminando proveedor: ${selectedVendor.RIF}`);
      // Después de eliminar, actualizar la lista
      handleModalAction();
    }
  };

  return (
    <>
      <CardBoxModal
        title="Información del Proveedor"
        buttonColor="info"
        buttonLabel="Cerrar"
        isActive={isModalInfoActive}
        onConfirm={handleModalAction}
      >
        {selectedVendor && (
          <div className="space-y-3">
            <div>
              <strong>RIF:</strong> {selectedVendor.RIF}
            </div>
            <div>
              <strong>Razón Social:</strong> {selectedVendor.RazonSocial}
            </div>
            <div>
              <strong>Dirección:</strong> {selectedVendor.Direccion}
            </div>
            <div>
              <strong>Teléfono Local:</strong> {selectedVendor.TelefonoLocal}
            </div>
            <div>
              <strong>Teléfono Celular:</strong> {selectedVendor.TelefonoCelular}
            </div>
            <div>
              <strong>Persona de Contacto:</strong> {selectedVendor.PersonaContacto}
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
          ¿Estás seguro de que quieres eliminar el proveedor <b>{selectedVendor?.RazonSocial}</b>?
        </p>
      </CardBoxModal>

      <table>
        <thead>
          <tr>
            <th>RIF</th>
            <th>Razón Social</th>
            <th>Dirección</th>
            <th>Teléfono Local</th>
            <th>Teléfono Celular</th>
            <th>Persona de Contacto</th>
          </tr>
        </thead>
        <tbody>
          {vendorsPaginated.map((vendor: Vendor) => (
            <tr key={vendor.RIF}>
              <td data-label="RIF">{vendor.RIF}</td>
              <td data-label="Razón Social">{vendor.RazonSocial}</td>
              <td data-label="Dirección">{vendor.Direccion}</td>
              <td data-label="Teléfono Local">{vendor.TelefonoLocal}</td>
              <td data-label="Teléfono Celular">{vendor.TelefonoCelular}</td>
              <td data-label="Persona de Contacto">{vendor.PersonaContacto}</td>
              <td className="before:hidden lg:w-1 whitespace-nowrap">
                <Buttons type="justify-start lg:justify-end" noWrap>
                  <Button
                    color="info"
                    icon={mdiEye}
                    onClick={() => handleView(vendor)}
                    small
                    isGrouped
                  />
                  <Button
                    color="contrast"
                    icon={mdiPencil}
                    href={`/dashboard/suppliers/edit/${vendor.RIF}`}
                    small
                    isGrouped
                  />
                  <Button
                    color="danger"
                    icon={mdiTrashCan}
                    onClick={() => handleDelete(vendor)}
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

export default TableVendor; 