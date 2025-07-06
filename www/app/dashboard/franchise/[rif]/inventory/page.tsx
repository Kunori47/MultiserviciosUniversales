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
  mdiFilterVariant,
  mdiLeaf,
  mdiTree,
  mdiRecycle,
  mdiSprout,
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
import EcoBanner from "../../../_components/EcoBanner";

export default function InventoryPage() {
  const params = useParams();
  const rif = params?.rif as string;
  const [inventory, setInventory] = useState<any[]>([]);
  const [allInventory, setAllInventory] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showScarceProducts, setShowScarceProducts] = useState(false);
  const [showExcessProducts, setShowExcessProducts] = useState(false);

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
        setAllInventory([]);
      } else if (Array.isArray(data)) {
        setInventory(data);
        setAllInventory(data);
      } else {
        setInventory([data]);
        setAllInventory([data]);
      }
    } catch (err) {
      console.error("Error cargando inventario:", err);
      setInventory([]);
      setAllInventory([]);
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

  // Función para filtrar productos
  const filterProducts = async () => {
    // Si ambos filtros están activos, mostrar productos escasos (prioridad)
    if (showScarceProducts) {
      // Obtener productos escasos del backend
      try {
        const res = await fetch(`http://127.0.0.1:8000/product_franchise/franchise/${rif}/scarce`);
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
        console.error("Error cargando productos escasos:", err);
        setInventory([]);
      }
    } else if (showExcessProducts) {
      // Obtener productos con exceso de stock del backend
      try {
        const res = await fetch(`http://127.0.0.1:8000/product_franchise/franchise/${rif}/excess`);
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
        console.error("Error cargando productos en exceso:", err);
        setInventory([]);
      }
    } else {
      // Mostrar todos los productos
      setInventory(allInventory);
    }
  };

  // Efecto para aplicar el filtro cuando cambie el estado
  useEffect(() => {
    filterProducts();
  }, [showScarceProducts, showExcessProducts, allInventory]);

  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiTree} title="🌿 Inventario Ecológico" main>
        <div className="flex flex-col lg:flex-row gap-4 items-center">
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
                    className={`${className} border-green-300 focus:border-green-500 focus:ring-green-500`}
                    required
                    autoComplete="off"
                    value={searchInput}
                    onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                      setSearchInput(e.target.value);
                      await fetchSearchSuggestions(e.target.value);
                    }}
                  />
                  {searchSuggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border border-green-200 w-full max-h-40 overflow-auto rounded-lg shadow-lg">
                      {searchSuggestions.map((item) => (
                        <li
                          key={item.CodigoProducto}
                          className="p-2 hover:bg-green-100 cursor-pointer transition-colors"
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
            label={showScarceProducts ? "Mostrar Todos" : "Escasos"}
            icon={mdiFilterVariant}
            color={showScarceProducts ? "success" : "warning"}
            onClick={() => {
              setShowScarceProducts(!showScarceProducts);
              if (showExcessProducts) setShowExcessProducts(false);
            }}
          />
          
          <Button
            label={showExcessProducts ? "Mostrar Todos" : "Exceso"}
            icon={mdiFilterVariant}
            color={showExcessProducts ? "success" : "danger"}
            onClick={() => {
              setShowExcessProducts(!showExcessProducts);
              if (showScarceProducts) setShowScarceProducts(false);
            }}
          />

          <Button
            label="Corrección"
            icon={mdiPencil}
            color="warning"
            href={`/dashboard/franchise/${rif}/inventory/correction`}
          />
          <Button
            icon={mdiPlus}
            color="success"
            href={`/dashboard/franchise/${rif}/inventory/create`}
          />
          <Button
            icon={mdiHistory}
            color="info"
            href={`/dashboard/franchise/${rif}/inventory/correction/history`}
          />
          <Button
            href={`/dashboard/franchise/${rif}`}
            color="contrast"
            label="Atras"
            roundedFull
          />
        </div>
      </SectionTitleLineWithButton>

      <EcoBanner 
        type="tip" 
        title="Gestión Sostenible del Inventario"
        className="mb-6"
      >
        🌿 Monitorea el estado de tu inventario con un enfoque ecológico. Los productos escasos requieren atención inmediata, mientras que los productos en exceso pueden indicar oportunidades de optimización y reciclaje.
      </EcoBanner>

      {showScarceProducts && (
        <NotificationBar color="warning" icon={mdiSprout}>
          🌱 Mostrando solo productos escasos (cantidad ≤ cantidad mínima)
        </NotificationBar>
      )}

      {showExcessProducts && (
        <NotificationBar color="danger" icon={mdiRecycle}>
          ♻️ Mostrando solo productos en exceso (cantidad ≥ cantidad máxima)
        </NotificationBar>
      )}

      <CardBox className="mb-6 bg-gradient-to-br from-green-50 to-blue-50 border border-green-200" hasTable>
        <TableInventory 
          inventory={inventory} 
          rif={rif} 
          onInventoryUpdate={fetchInventoryByFranchise}
        />
      </CardBox>
    </SectionMain>
  );
} 