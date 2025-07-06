"use client";

import {
  mdiAccount,
  mdiBallotOutline,
  mdiCalendar,
  mdiCity,
  mdiListStatus,
  mdiMail,
} from "@mdi/js";
import { Field, Form, Formik } from "formik";
import Head from "next/head";
import Button from "../../../../_components/Button";
import Buttons from "../../../../_components/Buttons";
import Divider from "../../../../_components/Divider";
import CardBox from "../../../../_components/CardBox";
import FormField from "../../../../_components/FormField";
import SectionMain from "../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../_components/Section/TitleLineWithButton";
import { getPageTitle } from "../../../../_lib/config";
import { useEffect, useState } from "react";
import { useParams} from "next/navigation";


export default function UpdateFPage() {
    const params = useParams();
    const rif = params?.rif as string;
    const [franchise, setFranchise] = useState<any>(null);
    const [encargadoInput, setEncargadoInput] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);


    useEffect(() => {
        if (rif) {
        fetch(`http://127.0.0.1:8000/franchise/${rif}`)
            .then(res => res.json())
            .then(data => setFranchise(data));
        }
    }, [rif]);

    useEffect(() => {
      if (franchise && franchise.CI_Encargado) {
        setEncargadoInput(franchise.CI_Encargado);
      }
    }, [franchise]);

    if (!franchise) {
      return <div>Cargando datos de la franquicia...</div>;
    }
  

  // Función para buscar sugerencias
  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
        const res = await fetch(`http://127.0.0.1:8000/employee/search?q=${query}`);
        if (!res.ok) {
        throw new Error("Error en la respuesta del backend");
        }
        const data = await res.json();
        setSuggestions(data);
    } catch (err) {
        console.error("Error buscando sugerencias:", err);
        setSuggestions([]);
    }
  };

  const validateRIF = (rif: string) => {
    if (!rif) return true;
    return rif.length === 12;
  };
  return (
    <>
      <Head>
        <title>{getPageTitle("Forms")}</title>
      </Head>

      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiBallotOutline}
          title="Actualizar Franquicia"
          main
        >
                    <Button
                        href={`/dashboard/franchise/`}
                        color="info"
                        label="Atras"
                        roundedFull
                    />
        </SectionTitleLineWithButton>

        <CardBox>
          <Formik
            initialValues={{
              RIF: franchise.RIF,
              nombre: franchise.Nombre,
              ciudad: franchise.Ciudad,
              encargado: franchise.CI_Encargado,
              fechaInicioEncargado: franchise.FechaInicioEncargado,
              Estatus: franchise.Estatus,
            }}
            onSubmit={async (values, { resetForm }) => {
                try {
                if (!validateRIF(values.RIF)) {
                  alert("El RIF debe tener exactamente 12 caracteres");
                  return;
                }
                const res = await fetch("http://127.0.0.1:8000/franchise/update", {
                    method: "PUT",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                    RIF: values.RIF,
                    Nombre: values.nombre,
                    Ciudad: values.ciudad,
                    CI_Encargado: values.encargado,
                    FechaInicioEncargado: values.fechaInicioEncargado, // agrega el campo si lo tienes en el form
                    Estatus: values.Estatus, // agrega el campo si lo tienes en el form
                    }),
                });
                if (!res.ok) {
                    throw new Error("Error al actualizar la franquicia");
                }
                const data = await res.json();
                alert("Franquicia actualizada correctamente");
                resetForm();
                } catch (err) {
                alert("Error: " + err.message);
                }
            }}
          >
            {({ setFieldValue, values }) =>
            <Form>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-12 last:mb-0">
                <div>
                  <FormField label="RIF" labelFor="RIF" icon={mdiAccount}>
                    {({ className }) => (
                      <Field
                        name="RIF"
                        id="RIF"
                        placeholder="RIF"
                        className={`${className} bg-gray-100 text-gray-400 font-semibold ${values.RIF && !validateRIF(values.RIF) ? 'border-red-500' : ''}`}
                        required
                        readOnly
                      />
                    )}
                  </FormField>
                  {values.RIF && !validateRIF(values.RIF) && (
                    <p className="text-red-500 text-xs mt-1">El RIF debe tener exactamente 12 caracteres</p>
                  )}
                </div>
                <div>
                  <FormField label="Nombre" labelFor="nombre" icon={mdiMail}>
                    {({ className }) => (
                      <Field
                        name="nombre"
                        id="nombre"
                        placeholder="Nombre"
                        className={className}
                        required
                      />
                    )}
                    </FormField>
                </div>
              </div>

              <Divider />

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-12 last:mb-0">
                <div>                  
                  <FormField
                    label="Ciudad"
                    labelFor="Ciudad"
                    icon={mdiCity}                >
                    {({ className }) => (
                    <Field
                        name="ciudad"
                        placeholder="Ciudad"
                        id="ciudad"
                        className={className}
                        required
                    />
                    )}
                </FormField>
                </div>
                <div>
                <FormField label="Encargado" labelFor="encargado" icon={mdiAccount}>
                {({ className }) => (
                  <div>
                  <Field
                    name="encargado"
                    id="encargado"
                    className={className}
                    placeholder="CI"
                    autoComplete="off"
                    value={encargadoInput}
                    onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                        setEncargadoInput(e.target.value);
                        await fetchSuggestions(e.target.value);
                        setFieldValue("encargado", e.target.value);
                    }}
                  />
                    {suggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-auto">
                    {suggestions.map((item) => (
                        <li
                        key={item.CI}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                                setEncargadoInput(item.CI);
                                setFieldValue("encargado", item.CI);
                                setSuggestions([]);
                        }}
                        >
                            {item.NombreCompleto ? `${item.NombreCompleto} (${item.CI})` : item.CI}
                        </li>
                        ))}
                        </ul>
                    )}
                  </div>
                )}
              </FormField>
              </div>
              </div>

                 <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-12 last:mb-0">
                  <div>
                  <FormField label="Fecha de Inicio Encargado" labelFor="fechaInicioEncargado" icon={mdiCalendar}>
                      {({ className }) => (
                      <Field
                          name="fechaInicioEncargado"
                          id="fechaInicioEncargado"
                          type="date"
                          className={className}
                          required
                      />
                      )}
                  </FormField>
                  </div>
                  <div>
                    <FormField label="Estatus" labelFor="Estatus" icon={mdiListStatus}>
                      {({ className }) => (
                      <Field 
                        name="Estatus"
                        id="Estatus"
                        component="select"
                        className={className}
                        required
                      >
                        <option value="Activo">Activo</option>
                        <option value="No activo">No activo</option>
                      
                      </Field>
                      )}
                    </FormField>
                  </div>
                </div>

              <Divider />

              <Buttons>
                <Button type="submit" color="info" label="Submit" isGrouped />
                <Button
                  type="reset"
                  color="info"
                  outline
                  label="Reset"
                  isGrouped
                />
              </Buttons>
            </Form>
            }
          </Formik>
        </CardBox>
      </SectionMain>

    </>
  );
}
