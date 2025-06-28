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
import { fetchSupplyLines } from "../../_lib/db";
import { Metadata } from "next";
import TableSupplyLine  from "./table/SupplyLine";
import { useState, useEffect} from "react";
import FormField from "../../../_components/FormField";
import { Field, Formik } from "formik";


export default function SupplyLinesPage() {

  const [ supplyLines, setSupplyLines] = useState([]);
  const [ descriptionInput, setDescriptionInput] = useState("");
  const [ descriptionSuggestions, setDescriptionSuggestions] = useState<any[]>([]);
  
  useEffect(() => {
      fetchSupplyLines().then(data => setSupplyLines(data));
  }, []);

  // Efecto para manejar cuando el input está vacío
  useEffect(() => {
    if (!descriptionInput) {
      fetchSupplyLines().then(data => setSupplyLines(data));
    }
  }, [descriptionInput]);

    // Función para buscar sugerencias de Descripción
  const fetchDescriptionSuggestions = async (query: string) => {
      if (!query) {
        setDescriptionSuggestions([]);
        // Cuando el buscador está vacío, cargar todos los datos
        const allSupplyLines = await fetchSupplyLines();
        setSupplyLines(allSupplyLines);
        return;
      }
      try {
        const res = await fetch(`http://127.0.0.1:8000/supplier_line/search?q=${query}`);
        if (!res.ok) {
          throw new Error("Error en la respuesta del backend");
        }
        const data = await res.json();
        setDescriptionSuggestions(data);
        setSupplyLines(data);
      } catch (err) {
        console.error("Error buscando sugerencias de descripción:", err);
        setDescriptionSuggestions([]);
      }
  };


  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiTableBorder} title="Líneas de Suministro" main>
        <Formik
          initialValues={{
              Descripcion: "",
            }}
            onSubmit={() => {}}>
          <FormField label="Buscar" labelFor="Descripcion" icon={mdiSearchWeb}>
                    {({ className }) => (
                      <div className="relative">
                        <Field
                          name="Descripcion"
                          id="Descripcion"
                          placeholder="Descripción de la línea"
                          className={className}
                          required
                          autoComplete="off"
                          value={descriptionInput}
                          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                            setDescriptionInput(e.target.value);
                            await fetchDescriptionSuggestions(e.target.value);
                          }}
                        />
                        {descriptionSuggestions.length > 0 && (
                          <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-auto">
                            {descriptionSuggestions.map((item) => (
                              <li
                                key={item.CodigoLinea}
                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => {
                                  setDescriptionInput(item.DescripcionLinea);
                                  setDescriptionSuggestions([]);
                                }}
                              >
                                {item.DescripcionLinea}
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
            href="/dashboard/administration/supply-lines/create">

        </Button>
      </SectionTitleLineWithButton>


      <CardBox className="mb-6" hasTable>
        <TableSupplyLine supplyLines={supplyLines} />
      </CardBox>
      
    </SectionMain>
  );
}