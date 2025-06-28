"use client";

import {
  mdiAccount,
  mdiBallotOutline,
  mdiMapMarker,
  mdiPhone,
  mdiPhoneClassic,
  mdiAccountGroup,
  mdiCheckCircle,
  mdiAlertCircle,
  mdiLoading,
} from "@mdi/js";
import { Field, Form, Formik } from "formik";
import Head from "next/head";
import { useState } from "react";
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
  const [formValues, setFormValues] = useState(null);

  const handleSubmit = async (values, { resetForm }) => {
    setFormValues(values);
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);
    
    try {
      const res = await fetch("http://127.0.0.1:8000/vendor/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          RIF: formValues.RIF,
          RazonSocial: formValues.razonSocial,
          Direccion: formValues.direccion,
          TelefonoLocal: formValues.telefonoLocal,
          TelefonoCelular: formValues.telefonoCelular,
          PersonaContacto: formValues.personaContacto,
        }),
      });
      
      if (!res.ok) {
        throw new Error("Error al crear el proveedor");
      }
      
      const data = await res.json();
      setShowSuccessNotification(true);
      resetForm();
      
      // Ocultar notificación de éxito después de 3 segundos
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);
      
    } catch (err) {
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
          title="Crear Proveedor"
          main
        >
          <Button
              href={`/dashboard/administration/suppliers/`}
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
            <b>¡Éxito!</b> Proveedor creado correctamente
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
          title="Confirmar creación de proveedor"
          buttonColor="info"
          buttonLabel="Confirmar"
          isActive={showConfirmModal}
          onConfirm={confirmSubmit}
          onCancel={() => setShowConfirmModal(false)}
        >
          <p>¿Estás seguro de que deseas crear el proveedor con los siguientes datos?</p>
          <div className="mt-4 space-y-2 text-sm">
            <p><strong>RIF:</strong> {formValues?.RIF}</p>
            <p><strong>Razón Social:</strong> {formValues?.razonSocial}</p>
            <p><strong>Dirección:</strong> {formValues?.direccion}</p>
            <p><strong>Persona de Contacto:</strong> {formValues?.personaContacto}</p>
          </div>
        </CardBoxModal>

        <CardBox>
          <Formik
            initialValues={{
              RIF: "",
              razonSocial: "",
              direccion: "",
              telefonoLocal: "",
              telefonoCelular: "",
              personaContacto: "",
            }}
            onSubmit={handleSubmit}
          >
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
                        disabled={isSubmitting}
                      />
                    )}
                  </FormField>
                </div>
                <div>
                  <FormField label="Razón Social" labelFor="razonSocial" icon={mdiAccountGroup}>
                    {({ className }) => (
                      <Field
                        name="razonSocial"
                        id="razonSocial"
                        placeholder="Razón Social"
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
                  <FormField
                    label="Dirección"
                    labelFor="direccion"
                    icon={mdiMapMarker}
                  >
                    {({ className }) => (
                    <Field
                        name="direccion"
                        placeholder="Dirección"
                        id="direccion"
                        className={className}
                        required
                        disabled={isSubmitting}
                    />
                    )}
                </FormField>
                </div>
                <div>
                  <FormField label="Persona de Contacto" labelFor="personaContacto" icon={mdiAccount}>
                    {({ className }) => (
                      <Field
                        name="personaContacto"
                        id="personaContacto"
                        placeholder="Persona de Contacto"
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
                  <FormField label="Teléfono Local" labelFor="telefonoLocal" icon={mdiPhoneClassic}>
                    {({ className }) => (
                      <Field
                        name="telefonoLocal"
                        id="telefonoLocal"
                        placeholder="Teléfono Local"
                        className={className}
                        required
                        disabled={isSubmitting}
                      />
                    )}
                  </FormField>
                </div>
                <div>
                  <FormField label="Teléfono Celular" labelFor="telefonoCelular" icon={mdiPhone}>
                    {({ className }) => (
                      <Field
                        name="telefonoCelular"
                        id="telefonoCelular"
                        placeholder="Teléfono Celular"
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
          </Formik>
        </CardBox>
      </SectionMain>

    </>
  );
} 