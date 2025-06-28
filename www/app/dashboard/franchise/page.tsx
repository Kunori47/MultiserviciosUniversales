"use client"

import {
  mdiAccount,
  mdiPlus,
  mdiSearchWeb,
  mdiTableBorder,
} from "@mdi/js";
import Button from "../../_components/Button";
import CardBox from "../../_components/CardBox";
import SectionMain from "../../_components/Section/Main";
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton";
import { getPageTitle } from "../../_lib/config";
import { fetchFranchises } from "../_lib/db";
import { Metadata } from "next";
import TableFranchise from "./table/Franchise";
import { useState, useEffect} from "react";
import FormField from "../../_components/FormField";
import { Field, Formik } from "formik";


export default function TablesPage() {

  const [ franchises, setFranchises] = useState([]);
  const [ rifInput, setRifInput] = useState("");
  const [ rifSuggestions, setRifSuggestions] = useState<any[]>([]);
  
  useEffect(() => {
      fetchFranchises().then(data => setFranchises(data));
  }, []);

    // Función para buscar sugerencias de RIF
  const fetchRifSuggestions = async (query: string) => {
      if (!query) {
        setRifSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`http://127.0.0.1:8000/franchise/search?q=${query}`);
        if (!res.ok) {
          throw new Error("Error en la respuesta del backend");
        }
        const data = await res.json();
        setRifSuggestions(data);
        setFranchises(data);
      } catch (err) {
        console.error("Error buscando sugerencias de RIF:", err);
        setRifSuggestions([]);
      }
  };


  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiTableBorder} title="Franquicia" main>
        <Formik
          initialValues={{
              RIF: "",
            }}
            onSubmit={() => {}}>
          <FormField label="Buscar" labelFor="RIF" icon={mdiSearchWeb}>
                    {({ className }) => (
                      <div className="relative">
                        <Field
                          name="RIF"
                          id="RIF"
                          placeholder="RIF"
                          className={className}
                          required
                          autoComplete="off"
                          value={rifInput}
                          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                            setRifInput(e.target.value);
                            await fetchRifSuggestions(e.target.value);
                            // setFieldValue is not available here, so you may need to handle form state differently
                          }}
                        />
                        {rifSuggestions.length > 0 && (
                          <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-auto">
                            {rifSuggestions.map((item) => (
                              <li
                                key={item.RIF}
                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => {
                                  setRifInput(item.RIF);
                                  // setFieldValue is not available here, so you may need to handle form state differently
                                  setRifSuggestions([]);
                                }}
                              >
                                {item.RIF}
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
            href="/dashboard/franchise/create">

        </Button>
      </SectionTitleLineWithButton>


      <CardBox className="mb-6" hasTable>
        <TableFranchise franchise={franchises} />
      </CardBox>
      
    </SectionMain>
  );
}
