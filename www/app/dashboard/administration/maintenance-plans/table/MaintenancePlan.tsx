"use client";

import { mdiEye, mdiTrashCan, mdiPencil } from "@mdi/js";
import React, { useState } from "react";
import { MaintenancePlan } from "../../../../_interfaces";
import Button from "../../../../_components/Button";
import Buttons from "../../../../_components/Buttons";
import CardBoxModal from "../../../../_components/CardBox/Modal";

type Props = {
  maintenancePlans: MaintenancePlan[];
};

const TableMaintenancePlan = ({ maintenancePlans }: Props) => {
  const perPage = 5;

  const numPages = maintenancePlans.length / perPage;

  const pagesList: number[] = [];

  for (let i = 0; i < numPages; i++) {
    pagesList.push(i);
  }

  const [currentPage, setCurrentPage] = useState(0);
  const maintenancePlansPaginated = maintenancePlans.slice(
    perPage * currentPage,
    perPage * (currentPage + 1),
  );

  const [selectedMaintenancePlan, setSelectedMaintenancePlan] = useState<MaintenancePlan | null>(null);
  const [isModalInfoActive, setIsModalInfoActive] = useState(false);
  const [isModalTrashActive, setIsModalTrashActive] = useState(false);

  const handleModalAction = () => {
    setIsModalInfoActive(false);
    setIsModalTrashActive(false);
    setSelectedMaintenancePlan(null);
  };

  const handleView = (maintenancePlan: MaintenancePlan) => {
    setSelectedMaintenancePlan(maintenancePlan);
    setIsModalInfoActive(true);
  };

  const handleDelete = (maintenancePlan: MaintenancePlan) => {
    setSelectedMaintenancePlan(maintenancePlan);
    setIsModalTrashActive(true);
  };

  const confirmDelete = () => {
    if (selectedMaintenancePlan) {
      console.log(`Eliminando plan de mantenimiento: ${selectedMaintenancePlan.CodigoMantenimiento}`);
      handleModalAction();
    }
  };

  return (
    <>
      <CardBoxModal
        title="Informacion del Plan de Mantenimiento"
        buttonColor="info"
        buttonLabel="Cerrar"
        isActive={isModalInfoActive}
        onConfirm={handleModalAction}
      >
        {selectedMaintenancePlan && (
          <div className="space-y-3">
            <div>
              <strong>Codigo:</strong> {selectedMaintenancePlan.CodigoMantenimiento}
            </div>
            <div>
              <strong>Tiempo de Uso:</strong> {selectedMaintenancePlan.TiempoUso} horas
            </div>
            <div>
              <strong>Kilometraje:</strong> {selectedMaintenancePlan.Kilometraje} km
            </div>
            <div>
              <strong>Descripcion:</strong> {selectedMaintenancePlan.DescripcionMantenimiento}
            </div>
            <div>
              <strong>Codigo Marca:</strong> {selectedMaintenancePlan.CodigoMarca}
            </div>
            <div>
              <strong>Numero Modelo:</strong> {selectedMaintenancePlan.NumeroCorrelativoModelo}
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
          Estas seguro de que quieres eliminar el plan de mantenimiento <b>{selectedMaintenancePlan?.DescripcionMantenimiento}</b>?
        </p>
      </CardBoxModal>

      <table>
        <thead>
          <tr>
            <th>Codigo</th>
            <th>Tiempo de Uso</th>
            <th>Kilometraje</th>
            <th>Descripcion</th>
            <th>Codigo Marca</th>
            <th>Numero Modelo</th>
          </tr>
        </thead>
        <tbody>
          {maintenancePlansPaginated.map((maintenancePlan: MaintenancePlan) => (
            <tr key={maintenancePlan.CodigoMantenimiento}>
              <td data-label="Codigo">#{maintenancePlan.CodigoMantenimiento}</td>
              <td data-label="Tiempo de Uso">{maintenancePlan.TiempoUso} horas</td>
              <td data-label="Kilometraje">{maintenancePlan.Kilometraje} km</td>
              <td data-label="Descripcion">{maintenancePlan.DescripcionMantenimiento}</td>
              <td data-label="Codigo Marca">#{maintenancePlan.CodigoMarca}</td>
              <td data-label="Numero Modelo">#{maintenancePlan.NumeroCorrelativoModelo}</td>
              <td className="before:hidden lg:w-1 whitespace-nowrap">
                <Buttons type="justify-start lg:justify-end" noWrap>
                  <Button
                    color="info"
                    icon={mdiEye}
                    onClick={() => handleView(maintenancePlan)}
                    small
                    isGrouped
                  />
                  <Button
                    color="contrast"
                    icon={mdiPencil}
                    href={`/dashboard/maintenance-plans/edit/${maintenancePlan.CodigoMantenimiento}`}
                    small
                    isGrouped
                  />
                  <Button
                    color="danger"
                    icon={mdiTrashCan}
                    onClick={() => handleDelete(maintenancePlan)}
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

export default TableMaintenancePlan; 