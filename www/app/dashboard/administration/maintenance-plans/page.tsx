"use client"

import {
  mdiAccount,
  mdiPlus,
  mdiSearchWeb,
  mdiTableBorder,
} from "@mdi/js";
import Button from "../../../_components/Button";
import CardBox from "../../../_components/CardBox";
import SectionMain from "../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../_components/Section/TitleLineWithButton";
import { getPageTitle } from "../../../_lib/config";
import { fetchMaintenancePlans } from "../../_lib/db";
import { Metadata } from "next";
import TableMaintenancePlan from "./table/MaintenancePlan";
import { useState, useEffect} from "react";
import FormField from "../../../_components/FormField";
import { Field, Formik } from "formik";


export default function MaintenancePlansPage() {

  const [ maintenancePlans, setMaintenancePlans] = useState([]);
  const [ descripcionInput, setDescripcionInput] = useState("");
  const [ descripcionSuggestions, setDescripcionSuggestions] = useState<any[]>([]);
  
  useEffect(() => {
      fetchMaintenancePlans().then(data => setMaintenancePlans(data));
  }, []);

    // Función para buscar sugerencias de Descripción
  const fetchDescripcionSuggestions = async (query: string) => {
      if (!query) {
        setDescripcionSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`http://127.0.0.1:8000/maintenanceplan/search?q=${query}`);
        if (!res.ok) {
          throw new Error("Error en la respuesta del backend");
        }
        const data = await res.json();
        setDescripcionSuggestions(data);
        setMaintenancePlans(data);
      } catch (err) {
        console.error("Error buscando sugerencias de descripción:", err);
        setDescripcionSuggestions([]);
      }
  };


  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiTableBorder} title="Planes de Mantenimiento" main>
        <Formik
          initialValues={{
              DescripcionMantenimiento: "",
            }}
          onSubmit={() => {}}>
          <FormField label="Buscar" labelFor="DescripcionMantenimiento" icon={mdiSearchWeb}>
                    {({ className }) => (
                      <div className="relative">
                        <Field
                          name="DescripcionMantenimiento"
                          id="DescripcionMantenimiento"
                          placeholder="Descripción del plan"
                          className={className}
                          required
                          autoComplete="off"
                          value={descripcionInput}
                          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                            setDescripcionInput(e.target.value);
                            await fetchDescripcionSuggestions(e.target.value);
                          }}
                        />
                        {descripcionSuggestions.length > 0 && (
                          <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-auto">
                            {descripcionSuggestions.map((item) => (
                              <li
                                key={item.CodigoMantenimiento}
                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => {
                                  setDescripcionInput(item.DescripcionMantenimiento);
                                  setDescripcionSuggestions([]);
                                }}
                              >
                                {item.DescripcionMantenimiento}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
          </FormField>
        </Formik>
        
        <Button
            label={"Agregar"}
            icon={mdiPlus}
            color="info"
            href="/dashboard/maintenance-plans/create">

        </Button>
      </SectionTitleLineWithButton>


      <CardBox className="mb-6" hasTable>
        <TableMaintenancePlan maintenancePlans={maintenancePlans} />
      </CardBox>
      
    </SectionMain>
  );
} 