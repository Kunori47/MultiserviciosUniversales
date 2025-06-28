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
import { fetchSpecialties } from "../../_lib/db";
import { Metadata } from "next";
import TableSpecialty from "./table/Specialty";
import { useState, useEffect} from "react";
import FormField from "../../../_components/FormField";
import { Field, Formik } from "formik";


export default function SpecialtyPage() {

  const [ specialties, setSpecialties] = useState([]);
  const [ specialtyInput, setSpecialtyInput] = useState("");
  const [ specialtySuggestions, setSpecialtySuggestions] = useState<any[]>([]);
  
  useEffect(() => {
      fetchSpecialties().then(data => setSpecialties(data));
  }, []);

  // Efecto para manejar cuando el input está vacío
  useEffect(() => {
    if (!specialtyInput) {
      fetchSpecialties().then(data => setSpecialties(data));
    }
  }, [specialtyInput]);

    // Función para buscar sugerencias de Especialidades
  const fetchSpecialtySuggestions = async (query: string) => {
      if (!query) {
        setSpecialtySuggestions([]);
        // Cuando el buscador está vacío, cargar todos los datos
        const allSpecialties = await fetchSpecialties();
        setSpecialties(allSpecialties);
        return;
      }
      try {
        const res = await fetch(`http://127.0.0.1:8000/specialty/search?q=${query}`);
        if (!res.ok) {
          throw new Error("Error en la respuesta del backend");
        }
        const data = await res.json();
        setSpecialtySuggestions(data);
        setSpecialties(data);
        
      } catch (err) {
        console.error("Error buscando sugerencias de especialidades:", err);
        setSpecialtySuggestions([]);
      }
  };


  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiTableBorder} title="Especialidades" main>
        <Formik
          initialValues={{
              DescripcionEspecialidad: "",
            }}
          onSubmit={() => {}}>
          <FormField label="Buscar" labelFor="DescripcionEspecialidad" icon={mdiSearchWeb}>
                    {({ className }) => (
                      <div className="relative">
                        <Field
                          name="DescripcionEspecialidad"
                          id="DescripcionEspecialidad"
                          placeholder="Descripción de la especialidad"
                          className={className}
                          required
                          autoComplete="off"
                          value={specialtyInput}
                          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = e.target.value;
                            setSpecialtyInput(value);
                            await fetchSpecialtySuggestions(value);
                          }}
                        />
                        {specialtySuggestions?.length > 0 && (
                          <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-auto">
                            {specialtySuggestions.map((item) => (
                              <li
                                key={item.CodigoEspecialidad}
                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => {
                                  setSpecialtyInput(item.DescripcionEspecialidad);
                                  setSpecialtySuggestions([]);
                                }}
                              >
                                <div className="flex justify-between">
                                  <span className="font-medium">{item.DescripcionEspecialidad}</span>
                                  <span className="text-gray-500 text-sm">#{item.CodigoEspecialidad}</span>
                                </div>
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
            href="/dashboard/administration/specialty/create">
        </Button>
      </SectionTitleLineWithButton>

      <CardBox className="mb-6" hasTable>
        <TableSpecialty specialties={specialties} />
      </CardBox>
      
    </SectionMain>
  );
} 