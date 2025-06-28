"use client";

import {
  mdiBallotOutline,
  mdiText,
  mdiCheckCircle,
  mdiAlertCircle,
  mdiLoading,
  mdiClock,
  mdiSpeedometer,
  mdiCar,
} from "@mdi/js";
import { Field, Form, Formik, FormikProps } from "formik";
import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import Button from "../../../../_components/Button";
import Buttons from "../../../../_components/Buttons";
import Divider from "../../../../_components/Divider";
import CardBox from "../../../../_components/CardBox";
import CardBoxModal from "../../../../_components/CardBox/Modal";
import FormField from "../../../../_components/FormField";
import NotificationBar from "../../../../_components/NotificationBar";
import SectionMain from "../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../_components/Section/TitleLineWithButton";
import { getPageTitle } from "../../../../_lib/config";

export default function FormsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formValues, setFormValues] = useState<any>(null);
  const formikRef = useRef<FormikProps<any>>(null);

  // Estados para búsqueda de marcas y modelos
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [brandInput, setBrandInput] = useState("");
  const [brandSuggestions, setBrandSuggestions] = useState<any[]>([]);
  const [modelInput, setModelInput] = useState("");
  const [modelSuggestions, setModelSuggestions] = useState<any[]>([]);

  const fetchBrandSuggestions = async (query: string) => {
    if (!query) {
      setBrandSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`http://127.0.0.1:8000/brand/search?q=${query}`);
      if (res.ok) {
        const data = await res.json();
        setBrandSuggestions(data);
      }
    } catch (err) {
      console.error("Error buscando marcas:", err);
      setBrandSuggestions([]);
    }
  };

  const fetchModelSuggestions = async (query: string) => {
    if (!query || !selectedBrand) {
      setModelSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`http://127.0.0.1:8000/model/search?q=${query}`);
      if (res.ok) {
        const allModels = await res.json();
        const filteredModels = allModels.filter((model: any) => 
          model.CodigoMarca === selectedBrand.CodigoMarca
        );
        setModelSuggestions(filteredModels);
      }
    } catch (err) {
      console.error("Error buscando modelos:", err);
      setModelSuggestions([]);
    }
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    setFormValues(values);
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);
    
    try {
      const res = await fetch("http://127.0.0.1:8000/maintenanceplan/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          TiempoUso: formValues.tiempoUso,
          Kilometraje: formValues.kilometraje,
          DescripcionMantenimiento: formValues.descripcionMantenimiento,
          CodigoMarca: formValues.codigoMarca,
          NumeroCorrelativoModelo: formValues.numeroCorrelativoModelo,
        }),
      });
      
      if (!res.ok) {
        throw new Error("Error al crear el plan de mantenimiento");
      }
      
      const data = await res.json();
      setShowSuccessNotification(true);
      formikRef.current?.resetForm();
      setSelectedBrand(null);
      setBrandInput("");
      setModelInput("");
      
      // Ocultar notificación de éxito después de 3 segundos
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);
      
    } catch (err: any) {
      setErrorMessage(err.message);
      setShowErrorNotification(true);
      
      // Ocultar notificación de error después de 5 segundos
      setTimeout(() => {
        setShowErrorNotification(false);
      }, 5000);
    } finally {
      setIsSubmitting(false);
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
          title="Crear Plan de Mantenimiento"
          main
        >
          <Button
              href={`/dashboard/administration/maintenance-plans/`}
              color="info"
              label="Atras"
              roundedFull
          />
        </SectionTitleLineWithButton>

        {/* Notificaciones */}
        {showSuccessNotification && (
          <NotificationBar
            color="success"
            icon={mdiCheckCircle}
            button={
              <Button
                color="white"
                label="Cerrar"
                roundedFull
                small
                onClick={() => setShowSuccessNotification(false)}
              />
            }
          >
            <b>¡Éxito!</b> Plan de mantenimiento creado correctamente
          </NotificationBar>
        )}

        {showErrorNotification && (
          <NotificationBar
            color="danger"
            icon={mdiAlertCircle}
            button={
              <Button
                color="white"
                label="Cerrar"
                roundedFull
                small
                onClick={() => setShowErrorNotification(false)}
              />
            }
          >
            <b>Error:</b> {errorMessage}
          </NotificationBar>
        )}

        {/* Modal de confirmación */}
        <CardBoxModal
          title="Confirmar creación de plan de mantenimiento"
          buttonColor="info"
          buttonLabel="Confirmar"
          isActive={showConfirmModal}
          onConfirm={confirmSubmit}
          onCancel={() => setShowConfirmModal(false)}
        >
          <p>¿Estás seguro de que deseas crear el plan de mantenimiento con los siguientes datos?</p>
          <div className="mt-4 space-y-2 text-sm">
            <p><strong>Tiempo de Uso:</strong> {formValues?.tiempoUso} horas</p>
            <p><strong>Kilometraje:</strong> {formValues?.kilometraje} km</p>
            <p><strong>Descripción:</strong> {formValues?.descripcionMantenimiento}</p>
            <p><strong>Marca:</strong> {selectedBrand?.Nombre}</p>
            <p><strong>Modelo:</strong> {modelInput}</p>
          </div>
        </CardBoxModal>

        <CardBox>
          <Formik
            initialValues={{
              tiempoUso: "",
              kilometraje: "",
              descripcionMantenimiento: "",
              codigoMarca: "",
              numeroCorrelativoModelo: "",
            }}
            onSubmit={handleSubmit}
            ref={formikRef}
          >
            {({ setFieldValue }) => (
              <Form>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-12 last:mb-0">
                  <div>
                    <FormField label="Tiempo de Uso (horas)" labelFor="tiempoUso" icon={mdiClock}>
                      {({ className }) => (
                        <Field
                          name="tiempoUso"
                          id="tiempoUso"
                          type="number"
                          placeholder="Horas de uso"
                          className={className}
                          required
                          disabled={isSubmitting}
                        />
                      )}
                    </FormField>
                  </div>
                  <div>
                    <FormField label="Kilometraje (km)" labelFor="kilometraje" icon={mdiSpeedometer}>
                      {({ className }) => (
                        <Field
                          name="kilometraje"
                          id="kilometraje"
                          type="number"
                          placeholder="Kilometraje"
                          className={className}
                          required
                          disabled={isSubmitting}
                        />
                      )}
                    </FormField>
                  </div>
                </div>

                <Divider />

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-12 last:mb-0">
                  <div>
                    <FormField label="Marca" labelFor="codigoMarca" icon={mdiCar}>
                      {({ className }) => (
                        <div className="relative">
                          <Field
                            name="codigoMarca"
                            id="codigoMarca"
                            className={className}
                            placeholder="Buscar marca"
                            autoComplete="off"
                            value={brandInput}
                            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                              const value = e.target.value;
                              setBrandInput(value);
                              await fetchBrandSuggestions(value);
                              setFieldValue("codigoMarca", "");
                              setSelectedBrand(null);
                              setModelInput("");
                              setFieldValue("numeroCorrelativoModelo", "");
                            }}
                            required
                            disabled={isSubmitting}
                          />
                          {brandSuggestions.length > 0 && (
                            <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-auto">
                              {brandSuggestions.map((brand) => (
                                <li
                                  key={brand.CodigoMarca}
                                  className="p-2 hover:bg-gray-200 cursor-pointer"
                                  onClick={() => {
                                    setBrandInput(brand.Nombre);
                                    setFieldValue("codigoMarca", brand.CodigoMarca);
                                    setSelectedBrand(brand);
                                    setBrandSuggestions([]);
                                  }}
                                >
                                  {brand.Nombre}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </FormField>
                  </div>
                  <div>
                    <FormField label="Modelo" labelFor="numeroCorrelativoModelo" icon={mdiCar}>
                      {({ className }) => (
                        <div className="relative">
                          <Field
                            name="numeroCorrelativoModelo"
                            id="numeroCorrelativoModelo"
                            className={className}
                            placeholder="Buscar modelo"
                            autoComplete="off"
                            value={modelInput}
                            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                              const value = e.target.value;
                              setModelInput(value);
                              await fetchModelSuggestions(value);
                              setFieldValue("numeroCorrelativoModelo", "");
                            }}
                            required
                            disabled={isSubmitting || !selectedBrand}
                          />
                          {modelSuggestions.length > 0 && (
                            <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-auto">
                              {modelSuggestions.map((model) => (
                                <li
                                  key={`${model.CodigoMarca}-${model.NumeroCorrelativoModelo}`}
                                  className="p-2 hover:bg-gray-200 cursor-pointer"
                                  onClick={() => {
                                    setModelInput(model.DescripcionModelo);
                                    setFieldValue("numeroCorrelativoModelo", model.NumeroCorrelativoModelo);
                                    setModelSuggestions([]);
                                  }}
                                >
                                  {model.DescripcionModelo}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </FormField>
                  </div>
                </div>

                <Divider />

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-12 last:mb-0">
                  <div className="md:col-span-2">
                    <FormField label="Descripción del Mantenimiento" labelFor="descripcionMantenimiento" icon={mdiText}>
                      {({ className }) => (
                        <Field
                          name="descripcionMantenimiento"
                          id="descripcionMantenimiento"
                          as="textarea"
                          rows={4}
                          placeholder="Descripción detallada del mantenimiento"
                          className={className}
                          required
                          disabled={isSubmitting}
                        />
                      )}
                    </FormField>
                  </div>
                </div>

                <Divider />

                <Buttons>
                  <Button 
                    type="submit" 
                    color="info" 
                    label={isSubmitting ? "Enviando..." : "Enviar"} 
                    icon={isSubmitting ? mdiLoading : undefined}
                    disabled={isSubmitting}
                    isGrouped 
                  />
                  <Button
                    type="reset"
                    color="info"
                    outline
                    label="Vaciar"
                    disabled={isSubmitting}
                    isGrouped
                  />
                </Buttons>
              </Form>
            )}
          </Formik>
        </CardBox>
      </SectionMain>

    </>
  );
} 