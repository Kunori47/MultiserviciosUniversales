"use client";

import { useEffect, useState } from "react";
import Button from "../../_components/Button";
import CardBox from "../../_components/CardBox";
import Divider from "../../_components/Divider";
import SectionMain from "../../_components/Section/Main";
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton";
import { mdiPackageVariant, mdiPlus, mdiPencil, mdiTrashCan } from "@mdi/js";
import TableSupplierLine from "./TableSupplierLine";

export default function SupplierLineListPage() {
  const [lines, setLines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLines = async () => {
    setLoading(true);
    const res = await fetch("http://127.0.0.1:8000/supplier_line");
    const data = await res.json();
    setLines(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLines();
  }, []);

  const handleDelete = async (codigo: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta línea de suministro?")) return;
    const res = await fetch(`http://127.0.0.1:8000/supplier_line/delete?CodigoLinea=${codigo}`, { method: "DELETE" });
    if (res.ok) {
      setLines(lines.filter(l => l.CodigoLinea !== codigo));
    } else {
      alert("Error al eliminar la línea de suministro");
    }
  };

  return (
    <SectionMain>
      <SectionTitleLineWithButton
        icon={mdiPackageVariant}
        title="Gestión de Líneas de Suministro"
        main
      >
        <Button
          href="/dashboard/supplier-line/create"
          color="success"
          label="Crear Nueva Línea"
          icon={mdiPlus}
          roundedFull
        />
      </SectionTitleLineWithButton>
      <Divider />
      <CardBox>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Cargando líneas de suministro...</span>
          </div>
        ) : lines.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay líneas de suministro registradas</div>
        ) : (
          <TableSupplierLine lines={lines} onDelete={handleDelete} />
        )}
      </CardBox>
    </SectionMain>
  );
} 