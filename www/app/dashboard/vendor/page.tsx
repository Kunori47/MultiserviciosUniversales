"use client";

import { useEffect, useState } from "react";
import Button from "../../_components/Button";
import CardBox from "../../_components/CardBox";
import Divider from "../../_components/Divider";
import SectionMain from "../../_components/Section/Main";
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton";
import { mdiTruck, mdiPlus } from "@mdi/js";
import TableVendor from "./TableVendor";

export default function VendorListPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVendors = async () => {
    setLoading(true);
    const res = await fetch("http://127.0.0.1:8000/vendor");
    const data = await res.json();
    setVendors(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleDelete = async (rif: string) => {
    if (!confirm("¿Seguro que deseas eliminar este proveedor?")) return;
    const res = await fetch(`http://127.0.0.1:8000/vendor/delete?RIF=${rif}`, { method: "DELETE" });
    if (res.ok) {
      setVendors(vendors.filter(v => v.RIF !== rif));
    } else {
      alert("Error al eliminar el proveedor");
    }
  };

  return (
    <SectionMain>
      <SectionTitleLineWithButton
        icon={mdiTruck}
        title="Gestión de Proveedores"
        main
      >
        <Button
          href="/dashboard/vendor/create"
          color="success"
          label="Crear Nuevo Proveedor"
          icon={mdiPlus}
          roundedFull
        />
      </SectionTitleLineWithButton>
      <Divider />
      <CardBox>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Cargando proveedores...</span>
          </div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay proveedores registrados</div>
        ) : (
          <TableVendor vendors={vendors} onDelete={handleDelete} />
        )}
      </CardBox>
    </SectionMain>
  );
} 