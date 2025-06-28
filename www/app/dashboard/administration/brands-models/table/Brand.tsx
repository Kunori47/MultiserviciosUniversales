import { mdiEye, mdiTrashCan, mdiPencil } from "@mdi/js";
import { useState } from "react";
import Button from "../../../../_components/Button";
import Buttons from "../../../../_components/Buttons";
import CardBoxModal from "../../../../_components/CardBox/Modal";
import UserAvatar from "../../../_components/UserAvatar";
import { Brand } from "../../../../_interfaces";
import ResponsiveTable from "../../../_components/Table/ResponsiveTable";

type Props = {
  brands: Brand[];
};

const TableBrand = ({ brands }: Props) => {
  const [isModalInfoActive, setIsModalInfoActive] = useState(false);
  const [isModalTrashActive, setIsModalTrashActive] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

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
      // Aquí implementarías la lógica de eliminación
      console.log(`Eliminando marca: ${selectedBrand.CodigoMarca}`);
      // Después de eliminar, actualizar la lista
      handleModalAction();
    }
  };

  // Configuración de columnas para la tabla responsiva
  const columns = [
    {
      key: 'CodigoMarca',
      label: 'Código',
      render: (value: number) => `#${value}`,
      className: 'font-medium'
    },
    {
      key: 'Nombre',
      label: 'Nombre',
      className: 'font-medium'
    }
  ];

  // Función para renderizar las acciones
  const renderActions = (brand: Brand) => (
    <Buttons type="justify-start lg:justify-end" noWrap>
      <Button
        color="info"
        icon={mdiEye}
        onClick={() => handleView(brand)}
        small
        isGrouped
      />
      <Button
        color="success"
        icon={mdiPencil}
        href={`/dashboard/brands-models/edit/brand/${brand.CodigoMarca}`}
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
  );

  return (
    <>
      <CardBoxModal
        title="Información de la Marca"
        buttonColor="info"
        buttonLabel="Cerrar"
        isActive={isModalInfoActive}
        onConfirm={handleModalAction}
      >
        {selectedBrand && (
          <div className="space-y-3">
            <div>
              <strong>Código:</strong> {selectedBrand.CodigoMarca}
            </div>
            <div>
              <strong>Nombre:</strong> {selectedBrand.Nombre}
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
          ¿Estás seguro de que deseas eliminar la marca{" "}
          <strong>{selectedBrand?.Nombre}</strong>?
        </p>
      </CardBoxModal>

      <ResponsiveTable
        data={brands}
        columns={columns}
        actions={renderActions}
        keyField="CodigoMarca"
      />
    </>
  );
};

export default TableBrand; 