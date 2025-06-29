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
  mdiInformation,
  mdiClose,
} from "@mdi/js";
import { Field, Form, Formik, FormikProps } from "formik";
import * as Yup from "yup";
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

// Esquema de validación
const validationSchema = Yup.object().shape({
  RIF: Yup.string()
    .matches(/^\d{12}$/, "El RIF debe tener 12 dígitos")
    .required("El RIF es obligatorio")
    .trim(),
  RazonSocial: Yup.string()
    .min(3, "La razón social debe tener al menos 3 caracteres")
    .max(100, "La razón social no puede exceder 100 caracteres")
    .required("La razón social es obligatoria")
    .trim(),
  Direccion: Yup.string()
    .min(10, "La dirección debe tener al menos 10 caracteres")
    .max(200, "La dirección no puede exceder 200 caracteres")
    .required("La dirección es obligatoria")
    .trim(),
  TelefonoLocal: Yup.string()
    .matches(/^\d{12}$/, "El teléfono local debe tener 12 dígitos")
    .required("El teléfono local es obligatorio")
    .trim(),
  TelefonoCelular: Yup.string()
    .matches(/^\d{12}$/, "El teléfono celular debe tener 12 dígitos")
    .required("El teléfono celular es obligatorio")
    .trim(),
  PersonaContacto: Yup.string()
    .min(3, "La persona de contacto debe tener al menos 3 caracteres")
    .max(100, "La persona de contacto no puede exceder 100 caracteres")
    .required("La persona de contacto es obligatoria")
    .trim(),
});

export default function FormsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [showInfoNotification, setShowInfoNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formValues, setFormValues] = useState<any>(null);
  const formikRef = useRef<FormikProps<any>>(null);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setFormValues(values);
    setShowConfirmModal(true);
    setSubmitting(false);
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
          RIF: formValues?.RIF?.trim() || "",
          RazonSocial: formValues?.RazonSocial?.trim() || "",
          Direccion: formValues?.Direccion?.trim() || "",
          TelefonoLocal: formValues?.TelefonoLocal?.trim() || "",
          TelefonoCelular: formValues?.TelefonoCelular?.trim() || "",
          PersonaContacto: formValues?.PersonaContacto?.trim() || "",
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        // Manejo específico de errores del servidor
        if (res.status === 400) {
          throw new Error("Datos inválidos. Verifica la información ingresada.");
        } else if (res.status === 409) {
          throw new Error("Ya existe un proveedor con ese RIF.");
        } else if (res.status === 500) {
          throw new Error("Error interno del servidor. Intenta nuevamente más tarde.");
        } else {
          throw new Error(data.detail || "Error al crear el proveedor");
        }
      }
      
      setShowSuccessNotification(true);
      formikRef.current?.resetForm();
      
      // Mostrar información adicional
      setShowInfoNotification(true);
      
      // Ocultar notificaciones después de un tiempo
      setTimeout(() => {
        setShowSuccessNotification(false);
        setShowInfoNotification(false);
      }, 5000);
      
    } catch (err: any) {
      setErrorMessage(err.message);
      setErrorDetails("Si el problema persiste, contacta al administrador del sistema.");
      setShowErrorNotification(true);
      
      // Ocultar notificación de error después de 8 segundos
      setTimeout(() => {
        setShowErrorNotification(false);
      }, 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setShowErrorNotification(false);
    setShowConfirmModal(true);
  };

  return (
    <>
      <Head>
        <title>{getPageTitle("Crear Proveedor")}</title>
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

        {/* Notificación de éxito */}
        {showSuccessNotification && (
          <NotificationBar
            color="success"
            icon={mdiCheckCircle}
            button={
              <Button
                color="white"
                icon={mdiClose}
                roundedFull
                small
                onClick={() => setShowSuccessNotification(false)}
              />
            }
          >
            <b>¡Éxito!</b> Proveedor creado correctamente
          </NotificationBar>
        )}

        {/* Notificación informativa */}
        {showInfoNotification && (
          <NotificationBar
            color="info"
            icon={mdiInformation}
            button={
              <Button
                color="white"
                icon={mdiClose}
                roundedFull
                small
                onClick={() => setShowInfoNotification(false)}
              />
            }
          >
            <b>Información:</b> El nuevo proveedor ya está disponible para gestionar suministros
          </NotificationBar>
        )}

        {/* Notificación de error mejorada */}
        {showErrorNotification && (
          <NotificationBar
            color="danger"
            icon={mdiAlertCircle}
            button={
              <Buttons>
                <Button
                  color="white"
                  label="Reintentar"
                  roundedFull
                  small
                  onClick={handleRetry}
                />
                <Button
                  color="white"
                  icon={mdiClose}
                  roundedFull
                  small
                  onClick={() => setShowErrorNotification(false)}
                />
              </Buttons>
            }
          >
            <div className="space-y-1">
              <div><b>Error:</b> {errorMessage}</div>
              {errorDetails && (
                <div className="text-sm opacity-90">{errorDetails}</div>
              )}
            </div>
          </NotificationBar>
        )}

        {/* Modal de confirmación mejorado */}
        <CardBoxModal
          title="Confirmar creación de proveedor"
          buttonColor="info"
          buttonLabel={isSubmitting ? "Creando..." : "Confirmar"}
          isActive={showConfirmModal}
          onConfirm={confirmSubmit}
          onCancel={() => setShowConfirmModal(false)}
        >
          <div className="space-y-4">
            <p>¿Estás seguro de que deseas crear el proveedor con los siguientes datos?</p>
            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg space-y-2 text-sm">
              <p><strong>RIF:</strong> {formValues?.RIF || ""}</p>
              <p><strong>Razón Social:</strong> {formValues?.RazonSocial || ""}</p>
              <p><strong>Dirección:</strong> {formValues?.Direccion || ""}</p>
              <p><strong>Teléfono Local:</strong> {formValues?.TelefonoLocal || ""}</p>
              <p><strong>Teléfono Celular:</strong> {formValues?.TelefonoCelular || ""}</p>
              <p><strong>Persona de Contacto:</strong> {formValues?.PersonaContacto || ""}</p>
            </div>
            <div className="text-xs text-gray-500 dark:text-slate-400">
              <p>• El RIF debe ser único en el sistema</p>
            </div>
          </div>
        </CardBoxModal>

        <CardBox>
          <Formik
            initialValues={{
              RIF: "",
              RazonSocial: "",
              Direccion: "",
              TelefonoLocal: "",
              TelefonoCelular: "",
              PersonaContacto: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            ref={formikRef}
          >
            {({ errors, touched, isValid, dirty }) => (
              <Form>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-12 last:mb-0">
                  <div>
                    <FormField 
                      label="RIF" 
                      labelFor="RIF" 
                      icon={mdiAccount}
                      help={errors.RIF && touched.RIF ? String(errors.RIF) : undefined}
                    >
                      {({ className }) => (
                        <Field
                          name="RIF"
                          id="RIF"
                          placeholder="Ej: J-12345678-9"
                          className={`${className} ${errors.RIF && touched.RIF ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                          required
                          disabled={isSubmitting}
                        />
                      )}
                    </FormField>
                  </div>
                  <div>
                    <FormField 
                      label="Razón Social" 
                      labelFor="RazonSocial" 
                      icon={mdiAccountGroup}
                      help={errors.RazonSocial && touched.RazonSocial ? String(errors.RazonSocial) : undefined}
                    >
                      {({ className }) => (
                        <Field
                          name="RazonSocial"
                          id="RazonSocial"
                          placeholder="Nombre de la empresa"
                          className={`${className} ${errors.RazonSocial && touched.RazonSocial ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
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
                      labelFor="Direccion"
                      icon={mdiMapMarker}
                      help={errors.Direccion && touched.Direccion ? String(errors.Direccion) : undefined}
                    >
                      {({ className }) => (
                      <Field
                          name="Direccion"
                          placeholder="Dirección completa"
                          id="Direccion"
                          className={`${className} ${errors.Direccion && touched.Direccion ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                          required
                          disabled={isSubmitting}
                      />
                      )}
                  </FormField>
                  </div>
                  <div>
                    <FormField 
                      label="Persona de Contacto" 
                      labelFor="PersonaContacto" 
                      icon={mdiAccount}
                      help={errors.PersonaContacto && touched.PersonaContacto ? String(errors.PersonaContacto) : undefined}
                    >
                      {({ className }) => (
                        <Field
                          name="PersonaContacto"
                          id="PersonaContacto"
                          placeholder="Nombre completo"
                          className={`${className} ${errors.PersonaContacto && touched.PersonaContacto ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
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
                      label="Teléfono Local" 
                      labelFor="TelefonoLocal" 
                      icon={mdiPhoneClassic}
                      help={errors.TelefonoLocal && touched.TelefonoLocal ? String(errors.TelefonoLocal) : undefined}
                    >
                      {({ className }) => (
                        <Field
                          name="TelefonoLocal"
                          id="TelefonoLocal"
                          placeholder="Ej: 0212-1234567"
                          className={`${className} ${errors.TelefonoLocal && touched.TelefonoLocal ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                          required
                          disabled={isSubmitting}
                        />
                      )}
                    </FormField>
                  </div>
                  <div>
                    <FormField 
                      label="Teléfono Celular" 
                      labelFor="TelefonoCelular" 
                      icon={mdiPhone}
                      help={errors.TelefonoCelular && touched.TelefonoCelular ? String(errors.TelefonoCelular) : undefined}
                    >
                      {({ className }) => (
                        <Field
                          name="TelefonoCelular"
                          id="TelefonoCelular"
                          placeholder="Ej: 0412-1234567"
                          className={`${className} ${errors.TelefonoCelular && touched.TelefonoCelular ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
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
                    disabled={isSubmitting || !isValid || !dirty}
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