"use client";

import {
  mdiAccount,
  mdiBallotOutline,
  mdiCalendar,
  mdiCity,
  mdiMail,
  mdiPhone,
  mdiDirections,
  mdiBank,
  mdiPlus,
  mdiClose,
  mdiIdentifier,
} from "@mdi/js";
import { Field, Form, Formik } from "formik";
import Head from "next/head";
import Button from "../../../_components/Button";
import Buttons from "../../../_components/Buttons";
import Divider from "../../../_components/Divider";
import CardBox from "../../../_components/CardBox";
import FormField from "../../../_components/FormField";
import SectionMain from "../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../_components/Section/TitleLineWithButton";
import { getPageTitle } from "../../../_lib/config";
import { useState } from 'react';

export default function FormsPage() {
    const [encargadoInput, setEncargadoInput] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showCreateEncargado, setShowCreateEncargado] = useState(false);
      const [newEncargadoData, setNewEncargadoData] = useState({
      CI: "",
      NombreCompleto: "",
      Direccion: "",
      Telefono: "",
      Salario: "",
  });
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

  // Función para crear nuevo encargado
  const createNewEncargado = async () => {
    // Validaciones básicas
    if (!newEncargadoData.CI || !newEncargadoData.NombreCompleto || !newEncargadoData.Direccion || 
        !newEncargadoData.Telefono || !newEncargadoData.Salario) {
      alert("Por favor complete todos los campos requeridos");
      return;
    }

    if (parseFloat(newEncargadoData.Salario) <= 0) {
      alert("El salario debe ser mayor a 0");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/employee/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CI: newEncargadoData.CI,
          NombreCompleto: newEncargadoData.NombreCompleto,
          Direccion: newEncargadoData.Direccion,
          Telefono: newEncargadoData.Telefono,
          Salario: parseFloat(newEncargadoData.Salario),
          FranquiciaRIF: null, // Se asignará cuando se cree la franquicia
          Rol: "Encargado",
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Error al crear el encargado");
      }
      
      // Actualizar el campo encargado con el nuevo CI
      setEncargadoInput(newEncargadoData.CI);
      setShowCreateEncargado(false);
      setNewEncargadoData({
        CI: "",
        NombreCompleto: "",
        Direccion: "",
        Telefono: "",
        Salario: "",
      });
      alert("Encargado creado correctamente");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <>
      <Head>
        <title>{getPageTitle("Forms")}</title>
      </Head>

      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiBallotOutline}
          title="Crear Franquicia"
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
              RIF: "",
              nombre: "",
              ciudad: "",
              encargado: "",
              fechaInicioEncargado: "",
            }}
            onSubmit={async (values, { resetForm }) => {
                try {
                const res = await fetch("http://127.0.0.1:8000/franchise/create", {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                    RIF: values.RIF,
                    Nombre: values.nombre,
                    Ciudad: values.ciudad,
                    CI_Encargado: values.encargado,
                    FechaInicioEncargado: values.fechaInicioEncargado,
                    Estatus: "Activo",
                    }),
                });
                if (!res.ok) {
                    throw new Error("Error al crear la franquicia");
                }
                const data = await res.json();
                
                alert("Franquicia creada correctamente");
                resetForm();
                setEncargadoInput("");
                } catch (err) {
                alert("Error: " + err.message);
                }
            }}
          >
            {({ setFieldValue }) => (
            <Form>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-12 last:mb-0">
                <div>
                  <FormField label="RIF" labelFor="RIF" icon={mdiAccount}>
                    {({ className }) => (
                      <Field
                        name="RIF"
                        id="RIF"
                        placeholder="RIF"
                        className={className}
                        required
                      />
                    )}
                  </FormField>
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
                <FormField label="Encargado: *Debes crear un encargado antes de crear una franquicia*" labelFor="Encargado" icon={mdiAccount}>
                {({ className }) => (
                  <div>
                  <Field
                    name="encargado"
                    id="encargado"
                    className={className}
                    placeholder="CI"
                    autoComplete="off"
                    value={encargadoInput}
                    readOnly
                    onClick={() => {
                        if (!encargadoInput) {
                            setShowCreateEncargado(true);
                        }
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
                    <div className="mt-2 flex gap-2">
                      <Button
                        type="button"
                        onClick={() => setShowCreateEncargado(true)}
                        color="success"
                        label="Crear Nuevo"
                        icon={mdiPlus}
                        small
                      />
                      {encargadoInput && (
                        <Button
                          type="button"
                          onClick={() => {
                            setEncargadoInput("");
                            setFieldValue("encargado", "");
                            setSuggestions([]);
                          }}
                          color="danger"
                          outline
                          label="Limpiar"
                          small
                        />
                      )}
                    </div>
                  </div>
                )}
              </FormField>
              </div>
              </div>



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
            )}
          </Formik>
        </CardBox>

        {/* Modal para crear nuevo encargado */}
        {showCreateEncargado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Crear Nuevo Encargado</h2>
                <Button
                  type="button"
                  onClick={() => setShowCreateEncargado(false)}
                  color="danger"
                  icon={mdiClose}
                  small
                />
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-6">
                <div>
                  <FormField label="CI" labelFor="newCI" icon={mdiAccount}>
                    {({ className }) => (
                      <input
                        type="text"
                        id="newCI"
                        placeholder="CI"
                        className={className}
                        value={newEncargadoData.CI}
                        onChange={(e) => setNewEncargadoData({...newEncargadoData, CI: e.target.value})}
                        required
                      />
                    )}
                  </FormField>
                </div>
                <div>
                  <FormField label="Nombre Completo" labelFor="newNombreCompleto" icon={mdiMail}>
                    {({ className }) => (
                      <input
                        type="text"
                        id="newNombreCompleto"
                        placeholder="Nombre Completo"
                        className={className}
                        value={newEncargadoData.NombreCompleto}
                        onChange={(e) => setNewEncargadoData({...newEncargadoData, NombreCompleto: e.target.value})}
                        required
                      />
                    )}
                  </FormField>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-6">
                <div>
                  <FormField label="Dirección" labelFor="newDireccion" icon={mdiDirections}>
                    {({ className }) => (
                      <input
                        type="text"
                        id="newDireccion"
                        placeholder="Dirección"
                        className={className}
                        value={newEncargadoData.Direccion}
                        onChange={(e) => setNewEncargadoData({...newEncargadoData, Direccion: e.target.value})}
                        required
                      />
                    )}
                  </FormField>
                </div>
                <div>
                  <FormField label="Teléfono" labelFor="newTelefono" icon={mdiPhone}>
                    {({ className }) => (
                      <input
                        type="text"
                        id="newTelefono"
                        placeholder="Teléfono"
                        className={className}
                        value={newEncargadoData.Telefono}
                        onChange={(e) => setNewEncargadoData({...newEncargadoData, Telefono: e.target.value})}
                        required
                      />
                    )}
                  </FormField>
                </div>
              </div>

              <div className="mb-6">
                <FormField label="Salario" labelFor="newSalario" icon={mdiBank}>
                  {({ className }) => (
                    <input
                      type="number"
                      id="newSalario"
                      placeholder="Salario"
                      className={className}
                      value={newEncargadoData.Salario}
                      onChange={(e) => setNewEncargadoData({...newEncargadoData, Salario: e.target.value})}
                      required
                    />
                  )}
                </FormField>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={() => setShowCreateEncargado(false)}
                  color="info"
                  outline
                  label="Cancelar"
                />
                <Button
                  type="button"
                  onClick={createNewEncargado}
                  color="success"
                  label="Crear Encargado"
                />
              </div>
            </div>
          </div>
        )}
      </SectionMain>

    </>
  );
}
