import { mdiEye, mdiTrashCan, mdiPencil } from "@mdi/js";
import { useState } from "react";
import Button from "../../../../_components/Button";
import Buttons from "../../../../_components/Buttons";
import CardBoxModal from "../../../../_components/CardBox/Modal";
import UserAvatar from "../../../_components/UserAvatar";
import { Vendor } from "../../../../_interfaces";
import ResponsiveTable from "../../../_components/Table/ResponsiveTable";

type Props = {
  vendors: Vendor[];
};

const TableVendor = ({ vendors }: Props) => {
  const [isModalInfoActive, setIsModalInfoActive] = useState(false);
  const [isModalTrashActive, setIsModalTrashActive] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

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

  // Configuración de columnas para la tabla responsiva
  const columns = [
    {
      key: 'RIF',
      label: 'RIF',
      render: (value: string) => value,
      className: 'font-medium'
    },
    {
      key: 'RazonSocial',
      label: 'Razón Social',
      className: 'font-medium'
    },
    {
      key: 'Direccion',
      label: 'Dirección',
      className: 'font-medium'
    },
    {
      key: 'TelefonoLocal',
      label: 'Teléfono Local',
      className: 'font-medium'
    },
    {
      key: 'TelefonoCelular',
      label: 'Teléfono Celular',
      className: 'font-medium'
    },
    {
      key: 'PersonaContacto',
      label: 'Persona de Contacto',
      className: 'font-medium'
    }
  ];

  // Función para renderizar las acciones
  const renderActions = (vendor: Vendor) => (
    <Buttons type="justify-start lg:justify-end" noWrap>
      <Button
        color="info"
        icon={mdiEye}
        onClick={() => handleView(vendor)}
        small
        isGrouped
      />
      <Button
        color="success"
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
  );

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
        title="Confirmar Eliminación"
        buttonColor="danger"
        buttonLabel="Confirmar"
        isActive={isModalTrashActive}
        onConfirm={confirmDelete}
        onCancel={handleModalAction}
      >
        <p>
          ¿Estás seguro de que deseas eliminar el proveedor{" "}
          <strong>{selectedVendor?.RazonSocial}</strong>?
        </p>
      </CardBoxModal>

      <ResponsiveTable
        data={vendors}
        columns={columns}
        actions={renderActions}
        keyField="RIF"
      />
    </>
  );
};

export default TableVendor; 