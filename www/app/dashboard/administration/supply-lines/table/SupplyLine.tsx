import { mdiEye, mdiTrashCan, mdiPencil } from "@mdi/js";
import { useState } from "react";
import Button from "../../../../_components/Button";
import Buttons from "../../../../_components/Buttons";
import CardBoxModal from "../../../../_components/CardBox/Modal";
import UserAvatar from "../../../_components/UserAvatar";
import { SupplyLine } from "../../../../_interfaces";
import ResponsiveTable from "../../../_components/Table/ResponsiveTable";

type Props = {
  supplyLines: SupplyLine[];
};

const TableSupplyLine = ({ supplyLines }: Props) => {
  const [isModalInfoActive, setIsModalInfoActive] = useState(false);
  const [isModalTrashActive, setIsModalTrashActive] = useState(false);
  const [selectedSupplyLine, setSelectedSupplyLine] = useState<SupplyLine | null>(null);

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

  // Configuración de columnas para la tabla responsiva
  const columns = [
    {
      key: 'CodigoLinea',
      label: 'Código',
      render: (value: number) => `#${value}`,
      className: 'font-medium'
    },
    {
      key: 'DescripcionLinea',
      label: 'Descripción',
      className: 'font-medium'
    }
  ];

  // Función para renderizar las acciones
  const renderActions = (supplyLine: SupplyLine) => (
    <Buttons type="justify-start lg:justify-end" noWrap>
      <Button
        color="info"
        icon={mdiEye}
        onClick={() => handleView(supplyLine)}
        small
        isGrouped
      />
      <Button
        color="success"
        icon={mdiPencil}
        href={`/dashboard/supply-lines/edit/${supplyLine.CodigoLinea}`}
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
  );

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
        title="Confirmar Eliminación"
        buttonColor="danger"
        buttonLabel="Confirmar"
        isActive={isModalTrashActive}
        onConfirm={confirmDelete}
        onCancel={handleModalAction}
      >
        <p>
          ¿Estás seguro de que deseas eliminar la línea de suministro{" "}
          <strong>{selectedSupplyLine?.DescripcionLinea}</strong>?
        </p>
      </CardBoxModal>

      <ResponsiveTable
        data={supplyLines}
        columns={columns}
        actions={renderActions}
        keyField="CodigoLinea"
      />
    </>
  );
};

export default TableSupplyLine;