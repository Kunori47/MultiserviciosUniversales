"use client";

import { useEffect, useState } from "react";
import Button from "../../_components/Button";
import CardBox from "../../_components/CardBox";
import Divider from "../../_components/Divider";
import SectionMain from "../../_components/Section/Main";
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton";
import { mdiCar, mdiPlus } from "@mdi/js";
import TableVehicle from "./TableVehicle";

export default function VehicleListPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    setLoading(true);
    const res = await fetch("http://127.0.0.1:8000/vehicle");
    const data = await res.json();
    setVehicles(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDelete = async (codigo: number) => {
    if (!confirm("¿Seguro que deseas eliminar este vehículo?")) return;
    const res = await fetch(`http://127.0.0.1:8000/vehicle/delete?CodigoVehiculo=${codigo}`, { method: "DELETE" });
    if (res.ok) {
      setVehicles(vehicles.filter(v => v.CodigoVehiculo !== codigo));
    } else {
      alert("Error al eliminar el vehículo");
    }
  };

  return (
    <SectionMain>
      <SectionTitleLineWithButton
        icon={mdiCar}
        title="Gestión de Vehículos"
        main
      >
        <Button
          href="/dashboard/vehicle/create"
          color="success"
          label="Agregar Vehículo"
          icon={mdiPlus}
          roundedFull
        />
      </SectionTitleLineWithButton>
      <Divider />
      <CardBox>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Cargando vehículos...</span>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay vehículos registrados</div>
        ) : (
          <TableVehicle vehicles={vehicles} onDelete={handleDelete} />
        )}
      </CardBox>
    </SectionMain>
  );
} 