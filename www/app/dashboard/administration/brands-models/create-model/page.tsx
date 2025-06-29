"use client";

import {
  mdiBallotOutline,
  mdiText,
  mdiCheckCircle,
  mdiAlertCircle,
  mdiLoading,
  mdiCar,
  mdiSeat,
  mdiWeight,
  mdiGasStation,
  mdiOil,
  mdiSnowflake,
} from "@mdi/js";
import { Field, Form, Formik, FormikProps } from "formik";
import Head from "next/head";
import { useState, useRef } from "react";
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

  // Estados para búsqueda de marcas
  const [brandInput, setBrandInput] = useState("");
  const [brandSuggestions, setBrandSuggestions] = useState<any[]>([]);

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

  const handleSubmit = async (values: any, { resetForm }: any) => {
    setFormValues(values);
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);
    
    try {
      const res = await fetch("http://127.0.0.1:8000/model/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CodigoMarca: formValues.codigoMarca,
          DescripcionModelo: formValues.descripcionModelo,
          CantidadPuestos: formValues.cantidadPuestos,
          TipoRefrigerante: formValues.tipoRefrigerante,
          TipoGasolina: formValues.tipoGasolina,
          TipoAceite: formValues.tipoAceite,
          Peso: formValues.peso,
        }),
      });
      
      if (!res.ok) {
        throw new Error("Error al crear el modelo");
      }
      
      const data = await res.json();
      setShowSuccessNotification(true);
      formikRef.current?.resetForm();
      setBrandInput("");
      
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
          title="Crear Modelo"
          main
        >
          <Button
              href={`/dashboard/administration/brands-models/`}
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
            <b>¡Éxito!</b> Modelo creado correctamente
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
          title="Confirmar creación de modelo"
          buttonColor="info"
          buttonLabel="Confirmar"
          isActive={showConfirmModal}
          onConfirm={confirmSubmit}
          onCancel={() => setShowConfirmModal(false)}
        >
          <p>¿Estás seguro de que deseas crear el modelo con los siguientes datos?</p>
          <div className="mt-4 space-y-2 text-sm">
            <p><strong>Marca:</strong> {brandInput}</p>
            <p><strong>Descripción:</strong> {formValues?.descripcionModelo}</p>
            <p><strong>Cantidad de Puestos:</strong> {formValues?.cantidadPuestos}</p>
            <p><strong>Tipo de Refrigerante:</strong> {formValues?.tipoRefrigerante}</p>
            <p><strong>Tipo de Gasolina:</strong> {formValues?.tipoGasolina}</p>
            <p><strong>Tipo de Aceite:</strong> {formValues?.tipoAceite}</p>
            <p><strong>Peso:</strong> {formValues?.peso} kg</p>
          </div>
        </CardBoxModal>

        <CardBox>
          <Formik
            initialValues={{
              codigoMarca: "",
              descripcionModelo: "",
              cantidadPuestos: "",
              tipoRefrigerante: "",
              tipoGasolina: "",
              tipoAceite: "",
              peso: "",
            }}
            onSubmit={handleSubmit}
            ref={formikRef}
          >
            {({ setFieldValue }) => (
              <Form>
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
                    <FormField label="Descripción del Modelo" labelFor="descripcionModelo" icon={mdiText}>
                      {({ className }) => (
                        <Field
                          name="descripcionModelo"
                          id="descripcionModelo"
                          placeholder="Descripción del modelo"
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
                    <FormField label="Cantidad de Puestos" labelFor="cantidadPuestos" icon={mdiSeat}>
                      {({ className }) => (
                        <Field
                          name="cantidadPuestos"
                          id="cantidadPuestos"
                          type="number"
                          placeholder="Número de puestos"
                          className={className}
                          required
                          disabled={isSubmitting}
                        />
                      )}
                    </FormField>
                  </div>
                  <div>
                    <FormField label="Peso (kg)" labelFor="peso" icon={mdiWeight}>
                      {({ className }) => (
                        <Field
                          name="peso"
                          id="peso"
                          type="number"
                          step="0.1"
                          placeholder="Peso en kg"
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
                    <FormField label="Tipo de Refrigerante" labelFor="tipoRefrigerante" icon={mdiSnowflake}>
                      {({ className }) => (
                        <Field
                          name="tipoRefrigerante"
                          id="tipoRefrigerante"
                          placeholder="Tipo de refrigerante"
                          className={className}
                          required
                          disabled={isSubmitting}
                        />
                      )}
                    </FormField>
                  </div>
                  <div>
                    <FormField label="Tipo de Gasolina" labelFor="tipoGasolina" icon={mdiGasStation}>
                      {({ className }) => (
                        <Field
                          name="tipoGasolina"
                          id="tipoGasolina"
                          as="select"
                          className={className}
                          required
                          disabled={isSubmitting}
                        >
                          <option value="">Seleccionar tipo de combustible</option>
                          <option value="Gasolina">Gasolina</option>
                          <option value="Diésel">Diésel</option>
                          <option value="Eléctrico">Eléctrico</option>
                          <option value="Híbrido">Híbrido</option>
                        </Field>
                      )}
                    </FormField>
                  </div>
                </div>

                <Divider />

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-12 last:mb-0">
                  <div>
                    <FormField label="Tipo de Aceite" labelFor="tipoAceite" icon={mdiOil}>
                      {({ className }) => (
                        <Field
                          name="tipoAceite"
                          id="tipoAceite"
                          as="select"
                          className={className}
                          required
                          disabled={isSubmitting}
                        >
                          <option value="">Seleccionar tipo de aceite</option>
                          <option value="Sintético">Sintético</option>
                          <option value="Mineral">Mineral</option>
                          <option value="Semisintético">Semisintético</option>
                        </Field>
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