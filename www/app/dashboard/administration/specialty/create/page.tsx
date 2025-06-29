"use client";

import {
  mdiAccount,
  mdiBallotOutline,
  mdiText,
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
  descripcionEspecialidad: Yup.string()
    .min(3, "La descripción debe tener al menos 3 caracteres")
    .max(50, "La descripción no puede exceder 50 caracteres")
    .required("La descripción es obligatoria")
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

  const handleSubmit = async (values: any, { setSubmitting, setFieldError }: any) => {
    setFormValues(values);
    setShowConfirmModal(true);
    setSubmitting(false);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);
    
    try {
      const res = await fetch("http://127.0.0.1:8000/specialty/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          DescripcionEspecialidad: formValues?.descripcionEspecialidad?.trim(),
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        // Manejo específico de errores del servidor
        if (res.status === 400) {
          throw new Error("Datos inválidos. Verifica la información ingresada.");
        } else if (res.status === 409) {
          throw new Error("Ya existe una especialidad con esa descripción.");
        } else if (res.status === 500) {
          throw new Error("Error interno del servidor. Intenta nuevamente más tarde.");
        } else {
          throw new Error(data.detail || "Error al crear la especialidad");
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
        <title>{getPageTitle("Crear Especialidad")}</title>
      </Head>

      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiBallotOutline}
          title="Crear Especialidad"
          main
        >
          <Button
              href={`/dashboard/administration/specialty/`}
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
            <b>¡Éxito!</b> Especialidad creada correctamente
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
            <b>Información:</b> La nueva especialidad ya está disponible para asignar a empleados
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
          title="Confirmar creación de especialidad"
          buttonColor="info"
          buttonLabel={isSubmitting ? "Creando..." : "Confirmar"}
          isActive={showConfirmModal}
          onConfirm={confirmSubmit}
          onCancel={() => setShowConfirmModal(false)}
        >
          <div className="space-y-4">
            <p>¿Estás seguro de que deseas crear la especialidad con los siguientes datos?</p>
            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg space-y-2 text-sm">
              <p><strong>Descripción:</strong> {formValues?.descripcionEspecialidad}</p>
            </div>
            <div className="text-xs text-gray-500 dark:text-slate-400">
              <p>• La descripción debe ser única en el sistema</p>
              <p>• Una vez creada, podrás asignarla a empleados</p>
            </div>
          </div>
        </CardBoxModal>

        <CardBox>
          <Formik
            initialValues={{
              descripcionEspecialidad: "",
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
                      label="Descripción de la Especialidad" 
                      labelFor="descripcionEspecialidad" 
                      icon={mdiText}
                      help={errors.descripcionEspecialidad && touched.descripcionEspecialidad ? String(errors.descripcionEspecialidad) : undefined}
                    >
                      {({ className }) => (
                        <Field
                          name="descripcionEspecialidad"
                          id="descripcionEspecialidad"
                          placeholder="Ej: Mecánico, Electricista, etc."
                          className={`${className} ${errors.descripcionEspecialidad && touched.descripcionEspecialidad ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
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