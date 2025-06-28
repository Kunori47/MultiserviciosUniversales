"use client";

import { mdiEye, mdiTrashCan, mdiPencil } from "@mdi/js";
import React, { useState } from "react";
import { Model } from "../../../../_interfaces";
import Button from "../../../../_components/Button";
import Buttons from "../../../../_components/Buttons";
import CardBoxModal from "../../../../_components/CardBox/Modal";

type Props = {
  models: Model[];
};

const TableModel = ({ models }: Props) => {
  const perPage = 5;

  const numPages = models.length / perPage;

  const pagesList: number[] = [];

  for (let i = 0; i < numPages; i++) {
    pagesList.push(i);
  }

  const [currentPage, setCurrentPage] = useState(0);
  const modelsPaginated = models.slice(
    perPage * currentPage,
    perPage * (currentPage + 1),
  );

  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [isModalInfoActive, setIsModalInfoActive] = useState(false);
  const [isModalTrashActive, setIsModalTrashActive] = useState(false);

  const handleModalAction = () => {
    setIsModalInfoActive(false);
    setIsModalTrashActive(false);
    setSelectedModel(null);
  };

  const handleView = (model: Model) => {
    setSelectedModel(model);
    setIsModalInfoActive(true);
  };

  const handleDelete = (model: Model) => {
    setSelectedModel(model);
    setIsModalTrashActive(true);
  };

  const confirmDelete = () => {
    if (selectedModel) {
      console.log(`Eliminando modelo: ${selectedModel.CodigoMarca}-${selectedModel.NumeroCorrelativoModelo}`);
      handleModalAction();
    }
  };

  return (
    <>
      <CardBoxModal
        title="Informacion del Modelo"
        buttonColor="info"
        buttonLabel="Cerrar"
        isActive={isModalInfoActive}
        onConfirm={handleModalAction}
      >
        {selectedModel && (
          <div className="space-y-3">
            <div>
              <strong>Codigo Marca:</strong> {selectedModel.CodigoMarca}
            </div>
            <div>
              <strong>Numero Modelo:</strong> {selectedModel.NumeroCorrelativoModelo}
            </div>
            <div>
              <strong>Descripcion:</strong> {selectedModel.DescripcionModelo}
            </div>
            <div>
              <strong>Cantidad de Puestos:</strong> {selectedModel.CantidadPuestos} puestos
            </div>
            <div>
              <strong>Tipo Refrigerante:</strong> {selectedModel.TipoRefrigerante}
            </div>
            <div>
              <strong>Tipo Gasolina:</strong> {selectedModel.TipoGasolina}
            </div>
            <div>
              <strong>Tipo Aceite:</strong> {selectedModel.TipoAceite}
            </div>
            <div>
              <strong>Peso:</strong> {selectedModel.Peso} kg
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
          Estas seguro de que quieres eliminar el modelo <b>{selectedModel?.DescripcionModelo}</b>?
        </p>
      </CardBoxModal>

      <table>
        <thead>
          <tr>
            <th>Codigo Marca</th>
            <th>Numero Modelo</th>
            <th>Descripcion</th>
            <th>Puestos</th>
            <th>Refrigerante</th>
            <th>Gasolina</th>
            <th>Aceite</th>
            <th>Peso</th>
          </tr>
        </thead>
        <tbody>
          {modelsPaginated.map((model: Model) => (
            <tr key={`${model.CodigoMarca}-${model.NumeroCorrelativoModelo}`}>
              <td data-label="Codigo Marca">#{model.CodigoMarca}</td>
              <td data-label="Numero Modelo">#{model.NumeroCorrelativoModelo}</td>
              <td data-label="Descripcion">{model.DescripcionModelo}</td>
              <td data-label="Puestos">{model.CantidadPuestos} puestos</td>
              <td data-label="Refrigerante">{model.TipoRefrigerante}</td>
              <td data-label="Gasolina">{model.TipoGasolina}</td>
              <td data-label="Aceite">{model.TipoAceite}</td>
              <td data-label="Peso">{model.Peso} kg</td>
              <td className="before:hidden lg:w-1 whitespace-nowrap">
                <Buttons type="justify-start lg:justify-end" noWrap>
                  <Button
                    color="info"
                    icon={mdiEye}
                    onClick={() => handleView(model)}
                    small
                    isGrouped
                  />
                  <Button
                    color="contrast"
                    icon={mdiPencil}
                    href={`/dashboard/brands-models/edit/model/${model.CodigoMarca}/${model.NumeroCorrelativoModelo}`}
                    small
                    isGrouped
                  />
                  <Button
                    color="danger"
                    icon={mdiTrashCan}
                    onClick={() => handleDelete(model)}
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

export default TableModel; 