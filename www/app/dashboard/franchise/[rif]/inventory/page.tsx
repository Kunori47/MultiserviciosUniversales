"use client";

import {
  mdiWarehouse,
  mdiGithub,
  mdiMonitorCellphone,
  mdiPlus,
  mdiSearchWeb,
  mdiTableBorder,
  mdiTableOff,
  mdiPencil,
  mdiHistory,
} from "@mdi/js";
import Button from "../../../../_components/Button";
import CardBox from "../../../../_components/CardBox";
import CardBoxComponentEmpty from "../../../../_components/CardBox/Component/Empty";
import NotificationBar from "../../../../_components/NotificationBar";
import SectionMain from "../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../_components/Section/TitleLineWithButton";
import TableInventory from "./table/Inventory";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Field, Formik } from "formik";
import FormField from "../../../../_components/FormField";

export default function InventoryPage() {
  const params = useParams();
  const rif = params?.rif as string;
  const [inventory, setInventory] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);

  useEffect(() => {
    if (rif) {
      fetchInventoryByFranchise();
    }
  }, [rif]);

  const fetchInventoryByFranchise = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/product_franchise/franchise/${rif}`);
      if (!res.ok) {
        throw new Error("Error en la respuesta del backend");
      }
      const data = await res.json();
      if (!data) {
        setInventory([]);
      } else if (Array.isArray(data)) {
        setInventory(data);
      } else {
        setInventory([data]);
      }
    } catch (err) {
      console.error("Error cargando inventario:", err);
      setInventory([]);
    }
  };

  // Función para buscar productos en el inventario
  const fetchSearchSuggestions = async (query: string) => {
    if (!query) {
      setSearchSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`http://127.0.0.1:8000/product_franchise/franchise/${rif}/search?q=${query}`);
      if (!res.ok) {
        throw new Error("Error en la respuesta del backend");
      }
      const data = await res.json();
      setSearchSuggestions(data);
      setInventory(data);
    } catch (err) {
      console.error("Error buscando productos:", err);
      setSearchSuggestions([]);
    }
  };

  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiWarehouse} title="Inventario" main>
        <Formik
          initialValues={{
            search: "",
          }}
          onSubmit={() => {}}
        >
          <FormField label="Buscar Producto" labelFor="search" icon={mdiSearchWeb}>
            {({ className }) => (
              <div className="relative">
                <Field
                  name="search"
                  id="search"
                  placeholder="Buscar por nombre o código..."
                  className={className}
                  required
                  autoComplete="off"
                  value={searchInput}
                  onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchInput(e.target.value);
                    await fetchSearchSuggestions(e.target.value);
                  }}
                />
                {searchSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-auto">
                    {searchSuggestions.map((item) => (
                      <li
                        key={item.CodigoProducto}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                          setSearchInput(item.NombreProducto);
                          setSearchSuggestions([]);
                        }}
                      >
                        {item.NombreProducto} - {item.CodigoProducto}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </FormField>
        </Formik>
        <Button
          label="Agregar Producto"
          icon={mdiPlus}
          color="info"
          href={`/dashboard/franchise/${rif}/inventory/create`}
        />
        <Button
          label="Realizar Corrección"
          icon={mdiPencil}
          color="warning"
          href={`/dashboard/franchise/${rif}/inventory/correction`}
        />
        <Button
          label="Ver Historial"
          icon={mdiHistory}
          color="contrast"
          href={`/dashboard/franchise/${rif}/inventory/correction/history`}
        />
        <Button
          href={`/dashboard/franchise/${rif}`}
          color="info"
          label="Atras"
          roundedFull
        />
      </SectionTitleLineWithButton>

      <CardBox className="mb-6" hasTable>
        <TableInventory 
          inventory={inventory} 
          rif={rif} 
          onInventoryUpdate={fetchInventoryByFranchise}
        />
      </CardBox>
    </SectionMain>
  );
} 