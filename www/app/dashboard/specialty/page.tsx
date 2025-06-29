"use client";

import { useEffect, useState } from "react";
import Button from "../../_components/Button";
import CardBox from "../../_components/CardBox";
import Divider from "../../_components/Divider";
import SectionMain from "../../_components/Section/Main";
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton";
import { mdiTag, mdiPlus, mdiPencil, mdiTrashCan } from "@mdi/js";
import { useRouter } from "next/navigation";
import TableSpecialty from "./TableSpecialty";

export default function SpecialtyListPage() {
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchSpecialties = async () => {
    setLoading(true);
    const res = await fetch("http://127.0.0.1:8000/specialty");
    const data = await res.json();
    setSpecialties(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const handleDelete = async (codigo: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta especialidad?")) return;
    const res = await fetch(`http://127.0.0.1:8000/specialty/delete?CodigoEspecialidad=${codigo}`, { method: "DELETE" });
    if (res.ok) {
      setSpecialties(specialties.filter(s => s.CodigoEspecialidad !== codigo));
    } else {
      alert("Error al eliminar la especialidad");
    }
  };

  return (
    <SectionMain>
      <SectionTitleLineWithButton
        icon={mdiTag}
        title="Gestión de Especialidades"
        main
      >
        <Button
          href="/dashboard/specialty/create"
          color="success"
          label="Crear Nueva Especialidad"
          icon={mdiPlus}
          roundedFull
        />
      </SectionTitleLineWithButton>
      <Divider />
      <CardBox>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Cargando especialidades...</span>
          </div>
        ) : specialties.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay especialidades registradas</div>
        ) : (
          <TableSpecialty specialties={specialties} onDelete={handleDelete} />
        )}
      </CardBox>
    </SectionMain>
  );
} 