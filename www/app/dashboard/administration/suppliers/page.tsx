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
import { fetchVendors } from "../../_lib/db";
import { Metadata } from "next";
import TableVendor from "./table/Vendor";
import { useState, useEffect} from "react";
import FormField from "../../../_components/FormField";
import { Field, Formik } from "formik";


export default function SuppliersPage() {

  const [ vendors, setVendors] = useState([]);
  const [ razonSocialInput, setRazonSocialInput] = useState("");
  const [ razonSocialSuggestions, setRazonSocialSuggestions] = useState<any[]>([]);
  
  useEffect(() => {
      fetchVendors().then(data => setVendors(data));
  }, []);

    // Función para buscar sugerencias de Razón Social
  const fetchRazonSocialSuggestions = async (query: string) => {
      if (!query) {
        setRazonSocialSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`http://127.0.0.1:8000/vendor/search?q=${query}`);
        if (!res.ok) {
          throw new Error("Error en la respuesta del backend");
        }
        const data = await res.json();
        setRazonSocialSuggestions(data);
        setVendors(data);
      } catch (err) {
        console.error("Error buscando sugerencias de razón social:", err);
        setRazonSocialSuggestions([]);
      }
  };


  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiTableBorder} title="Proveedores" main>
        <Formik
          initialValues={{
              RazonSocial: "",
            }}
            onSubmit={() => {}}>
          <FormField label="Buscar" labelFor="RazonSocial" icon={mdiSearchWeb}>
                    {({ className }) => (
                      <div className="relative">
                        <Field
                          name="RazonSocial"
                          id="RazonSocial"
                          placeholder="Razón social proveedor"
                          className={className}
                          required
                          autoComplete="off"
                          value={razonSocialInput}
                          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                            setRazonSocialInput(e.target.value);
                            await fetchRazonSocialSuggestions(e.target.value);
                          }}
                        />
                        {razonSocialSuggestions.length > 0 && (
                          <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-auto">
                            {razonSocialSuggestions.map((item) => (
                              <li
                                key={item.RIF}
                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => {
                                  setRazonSocialInput(item.RazonSocial);
                                  setRazonSocialSuggestions([]);
                                }}
                              >
                                {item.RazonSocial}
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
            href="/dashboard/administration/suppliers/create">

        </Button>
      </SectionTitleLineWithButton>


      <CardBox className="mb-6" hasTable>
        <TableVendor vendors={vendors} />
      </CardBox>
      
    </SectionMain>
  );
} 