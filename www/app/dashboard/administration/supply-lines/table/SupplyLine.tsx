"use client";

import { mdiEye, mdiTrashCan, mdiPencil } from "@mdi/js";
import React, { useState } from "react";
import { SupplyLine } from "../../../../_interfaces";
import Button from "../../../../_components/Button";
import Buttons from "../../../../_components/Buttons";
import CardBoxModal from "../../../../_components/CardBox/Modal";

type Props = {
  supplyLines: SupplyLine[];
};

const TableSupplyLine = ({ supplyLines }: Props) => {
  const perPage = 5;

  const numPages = supplyLines.length / perPage;

  const pagesList: number[] = [];

  for (let i = 0; i < numPages; i++) {
    pagesList.push(i);
  }

  const [currentPage, setCurrentPage] = useState(0);
  const supplyLinesPaginated = supplyLines.slice(
    perPage * currentPage,
    perPage * (currentPage + 1),
  );

  const [selectedSupplyLine, setSelectedSupplyLine] = useState<SupplyLine | null>(null);
  const [isModalInfoActive, setIsModalInfoActive] = useState(false);
  const [isModalTrashActive, setIsModalTrashActive] = useState(false);

  const handleModalAction = () => {
    setIsModalInfoActive(false);
    setIsModalTrashActive(false);
    setSelectedSupplyLine(null);
  };

  const handleView = (supplyLine: SupplyLine) => {
    setSelectedSupplyLine(supplyLine);
    setIsModalInfoActive(true);
  };

  const handleDelete = (supplyLine: SupplyLine) => {
    setSelectedSupplyLine(supplyLine);
    setIsModalTrashActive(true);
  };

  const confirmDelete = () => {
    if (selectedSupplyLine) {
      // Aquí implementarías la lógica de eliminación
      console.log(`Eliminando línea de suministro: ${selectedSupplyLine.CodigoLinea}`);
      // Después de eliminar, actualizar la lista
      handleModalAction();
    }
  };

  return (
    <>
      <CardBoxModal
        title="Información de Línea de Suministro"
        buttonColor="info"
        buttonLabel="Cerrar"
        isActive={isModalInfoActive}
        onConfirm={handleModalAction}
      >
        {selectedSupplyLine && (
          <div className="space-y-3">
            <div>
              <strong>Código:</strong> {selectedSupplyLine.CodigoLinea}
            </div>
            <div>
              <strong>Descripción:</strong> {selectedSupplyLine.DescripcionLinea}
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
          ¿Estás seguro de que quieres eliminar la línea de suministro <b>{selectedSupplyLine?.DescripcionLinea}</b>?
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
          {supplyLinesPaginated.map((supplyLine: SupplyLine) => (
            <tr key={supplyLine.CodigoLinea}>
              <td data-label="Código">#{supplyLine.CodigoLinea}</td>
              <td data-label="Descripción">{supplyLine.DescripcionLinea}</td>
              <td className="before:hidden lg:w-1 whitespace-nowrap">
                <Buttons type="justify-start lg:justify-end" noWrap>
                  <Button
                    color="info"
                    icon={mdiEye}
                    onClick={() => handleView(supplyLine)}
                    small
                    isGrouped
                  />
                  <Button
                    color="contrast"
                    icon={mdiPencil}
                    href={`/dashboard/administration/supply-lines/update/${supplyLine.CodigoLinea}`}
                    small
                    isGrouped
                  />
                  <Button
                    color="danger"
                    icon={mdiTrashCan}
                    onClick={() => handleDelete(supplyLine)}
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

export default TableSupplyLine; 