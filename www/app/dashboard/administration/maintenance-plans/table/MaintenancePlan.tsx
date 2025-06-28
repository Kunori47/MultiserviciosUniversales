import { mdiEye, mdiTrashCan, mdiPencil } from "@mdi/js";
import { useState } from "react";
import Button from "../../../../_components/Button";
import Buttons from "../../../../_components/Buttons";
import CardBoxModal from "../../../../_components/CardBox/Modal";
import UserAvatar from "../../../_components/UserAvatar";
import { MaintenancePlan } from "../../../../_interfaces";
import ResponsiveTable from "../../../_components/Table/ResponsiveTable";

type Props = {
  maintenancePlans: MaintenancePlan[];
};

const TableMaintenancePlan = ({ maintenancePlans }: Props) => {
  const [isModalInfoActive, setIsModalInfoActive] = useState(false);
  const [isModalTrashActive, setIsModalTrashActive] = useState(false);
  const [selectedMaintenancePlan, setSelectedMaintenancePlan] = useState<MaintenancePlan | null>(null);

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
      // Aquí implementarías la lógica de eliminación
      console.log(`Eliminando plan de mantenimiento: ${selectedMaintenancePlan.CodigoMantenimiento}`);
      // Después de eliminar, actualizar la lista
      handleModalAction();
    }
  };

  // Configuración de columnas para la tabla responsiva
  const columns = [
    {
      key: 'CodigoMantenimiento',
      label: 'Código',
      render: (value: number) => `#${value}`,
      className: 'font-medium'
    },
    {
      key: 'TiempoUso',
      label: 'Tiempo de Uso',
      render: (value: number) => `${value} horas`,
      className: 'font-medium'
    },
    {
      key: 'Kilometraje',
      label: 'Kilometraje',
      render: (value: number) => `${value} km`,
      className: 'font-medium'
    },
    {
      key: 'DescripcionMantenimiento',
      label: 'Descripción',
      className: 'font-medium'
    },
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
    }
  ];

  // Función para renderizar las acciones
  const renderActions = (maintenancePlan: MaintenancePlan) => (
    <Buttons type="justify-start lg:justify-end" noWrap>
      <Button
        color="info"
        icon={mdiEye}
        onClick={() => handleView(maintenancePlan)}
        small
        isGrouped
      />
      <Button
        color="success"
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
  );

  return (
    <>
      <CardBoxModal
        title="Información del Plan de Mantenimiento"
        buttonColor="info"
        buttonLabel="Cerrar"
        isActive={isModalInfoActive}
        onConfirm={handleModalAction}
      >
        {selectedMaintenancePlan && (
          <div className="space-y-3">
            <div>
              <strong>Código:</strong> {selectedMaintenancePlan.CodigoMantenimiento}
            </div>
            <div>
              <strong>Tiempo de Uso:</strong> {selectedMaintenancePlan.TiempoUso} horas
            </div>
            <div>
              <strong>Kilometraje:</strong> {selectedMaintenancePlan.Kilometraje} km
            </div>
            <div>
              <strong>Descripción:</strong> {selectedMaintenancePlan.DescripcionMantenimiento}
            </div>
            <div>
              <strong>Código Marca:</strong> {selectedMaintenancePlan.CodigoMarca}
            </div>
            <div>
              <strong>Número Modelo:</strong> {selectedMaintenancePlan.NumeroCorrelativoModelo}
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
          ¿Estás seguro de que deseas eliminar el plan de mantenimiento{" "}
          <strong>{selectedMaintenancePlan?.DescripcionMantenimiento}</strong>?
        </p>
      </CardBoxModal>

      <ResponsiveTable
        data={maintenancePlans}
        columns={columns}
        actions={renderActions}
        keyField="CodigoMantenimiento"
      />
    </>
  );
};

export default TableMaintenancePlan; 