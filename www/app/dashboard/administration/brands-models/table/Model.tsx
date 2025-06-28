import { mdiEye, mdiTrashCan, mdiPencil } from "@mdi/js";
import { useState } from "react";
import Button from "../../../../_components/Button";
import Buttons from "../../../../_components/Buttons";
import CardBoxModal from "../../../../_components/CardBox/Modal";
import UserAvatar from "../../../_components/UserAvatar";
import { Model } from "../../../../_interfaces";
import ResponsiveTable from "../../../_components/Table/ResponsiveTable";

type Props = {
  models: Model[];
};

const TableModel = ({ models }: Props) => {
  const [isModalInfoActive, setIsModalInfoActive] = useState(false);
  const [isModalTrashActive, setIsModalTrashActive] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

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
      // Aquí implementarías la lógica de eliminación
      console.log(`Eliminando modelo: ${selectedModel.CodigoMarca}-${selectedModel.NumeroCorrelativoModelo}`);
      // Después de eliminar, actualizar la lista
      handleModalAction();
    }
  };

  // Configuración de columnas para la tabla responsiva
  const columns = [
    {
      key: 'CodigoMarca',
      label: 'Código Marca',
      render: (value: number) => `#${value}`,
      className: 'font-medium'
    },
    {
      key: 'NumeroCorrelativoModelo',
      label: 'Número Modelo',
      render: (value: number) => `#${value}`,
      className: 'font-medium'
    },
    {
      key: 'DescripcionModelo',
      label: 'Descripción',
      className: 'font-medium'
    },
    {
      key: 'CantidadPuestos',
      label: 'Puestos',
      render: (value: number) => `${value} puestos`,
      className: 'font-medium'
    },
    {
      key: 'TipoRefrigerante',
      label: 'Refrigerante',
      className: 'font-medium'
    },
    {
      key: 'TipoGasolina',
      label: 'Gasolina',
      className: 'font-medium'
    },
    {
      key: 'TipoAceite',
      label: 'Aceite',
      className: 'font-medium'
    },
    {
      key: 'Peso',
      label: 'Peso',
      render: (value: number) => `${value} kg`,
      className: 'font-medium'
    }
  ];

  // Función para renderizar las acciones
  const renderActions = (model: Model) => (
    <Buttons type="justify-start lg:justify-end" noWrap>
      <Button
        color="info"
        icon={mdiEye}
        onClick={() => handleView(model)}
        small
        isGrouped
      />
      <Button
        color="success"
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
  );

  return (
    <>
      <CardBoxModal
        title="Información del Modelo"
        buttonColor="info"
        buttonLabel="Cerrar"
        isActive={isModalInfoActive}
        onConfirm={handleModalAction}
      >
        {selectedModel && (
          <div className="space-y-3">
            <div>
              <strong>Código Marca:</strong> {selectedModel.CodigoMarca}
            </div>
            <div>
              <strong>Número Modelo:</strong> {selectedModel.NumeroCorrelativoModelo}
            </div>
            <div>
              <strong>Descripción:</strong> {selectedModel.DescripcionModelo}
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
        title="Confirmar Eliminación"
        buttonColor="danger"
        buttonLabel="Confirmar"
        isActive={isModalTrashActive}
        onConfirm={confirmDelete}
        onCancel={handleModalAction}
      >
        <p>
          ¿Estás seguro de que deseas eliminar el modelo{" "}
          <strong>{selectedModel?.DescripcionModelo}</strong>?
        </p>
      </CardBoxModal>

      <ResponsiveTable
        data={models}
        columns={columns}
        actions={renderActions}
        keyField="CodigoMarca"
      />
    </>
  );
};

export default TableModel; 