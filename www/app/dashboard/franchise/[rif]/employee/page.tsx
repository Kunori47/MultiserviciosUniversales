"use client";

import {
    mdiAccount,
  mdiGithub,
  mdiMonitorCellphone,
  mdiPlus,
  mdiSearchWeb,
  mdiTableBorder,
  mdiTableOff,
} from "@mdi/js";
import Button from "../../../../_components/Button";
import CardBox from "../../../../_components/CardBox";
import CardBoxComponentEmpty from "../../../../_components/CardBox/Component/Empty";
import NotificationBar from "../../../../_components/NotificationBar";
import SectionMain from "../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../_components/Section/TitleLineWithButton";
import TableSampleClients from "../../../_components/Table/SampleClients";
import TableEmployee from "./table/Employee";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchEmployeeNameByFranchise } from "../../../_lib/db";
import { Field, Formik } from "formik";
import FormField from "../../../../_components/FormField";

export default function TablesPage() {

    const params = useParams();
    const rif = params?.rif as string;
    const [ employee, setEmployee] = useState<any[]>([]);
    const [ ciInput, setCiInput] = useState("");
    const [ ciSuggestions, setCiSuggestions] = useState<any[]>([]);


      
      useEffect(() => {
          fetchEmployeeNameByFranchise(rif).then(data => {
            if (!data) {
            setEmployee([]);
            } else if (Array.isArray(data)) {
            setEmployee(data);
            } else {
            setEmployee([data]);
            }
        });
        }, [rif]);
    
        // Función para buscar sugerencias de RIF
      const fetchCiSuggestions = async (query: string) => {
          if (!query) {
            setCiSuggestions([]);
            return;
          }
          try {
            const res = await fetch(`http://127.0.0.1:8000/employee/franchise/${rif}/search?q=${query}`);
            if (!res.ok) {
              throw new Error("Error en la respuesta del backend");
            }
            const data = await res.json();
            setCiSuggestions(data);
            setEmployee(data);
          } catch (err) {
            console.error("Error buscando sugerencias de CI:", err);
            setCiSuggestions([]);
          }
      };
  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiAccount} title="Empleados" main>
         <Formik
          initialValues={{
              CI: "",
            }}
            onSubmit={() => {}}>
          <FormField label="Buscar" labelFor="CI" icon={mdiSearchWeb}>
                    {({ className }) => (
                      <div className="relative">
                        <Field
                          name="CI"
                          id="CI"
                          placeholder="CI"
                          className={className}
                          required
                          autoComplete="off"
                          value={ciInput}
                          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                            setCiInput(e.target.value);
                            await fetchCiSuggestions(e.target.value);
                            // setFieldValue is not available here, so you may need to handle form state differently
                          }}
                        />
                        {ciSuggestions.length > 0 && (
                          <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-auto">
                            {ciSuggestions.map((item) => (
                              <li
                                key={item.CI}
                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => {
                                  setCiInput(item.CI);
                                  // setFieldValue is not available here, so you may need to handle form state differently
                                  setCiSuggestions([]);
                                }}
                              >
                                {item.CI}
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
             href={`/dashboard/franchise/${rif}/employee/create`}>
 
         </Button>

        <Button
            href={`/dashboard/franchise/${rif}`}
            color="info"
            label="Atras"
            roundedFull
        />

      </SectionTitleLineWithButton>

      <CardBox className="mb-6" hasTable>
        <TableEmployee employee={employee} />
      </CardBox>
    </SectionMain>
  );
}
