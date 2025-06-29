"use client";

import {
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
import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Button from "../../../../../_components/Button";
import Buttons from "../../../../../_components/Buttons";
import Divider from "../../../../../_components/Divider";
import CardBox from "../../../../../_components/CardBox";
import CardBoxModal from "../../../../../_components/CardBox/Modal";
import FormField from "../../../../../_components/FormField";
import NotificationBar from "../../../../../_components/NotificationBar";
import SectionMain from "../../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../../_components/Section/TitleLineWithButton";
import { getPageTitle } from "../../../../../_lib/config";

// Esquema de validación
const validationSchema = Yup.object().shape({
  descripcionEspecialidad: Yup.string()
    .min(3, "La descripción debe tener al menos 3 caracteres")
    .max(100, "La descripción no puede exceder 100 caracteres")
    .required("La descripción es obligatoria")
    .trim(),
});

export default function UpdateSpecialtyPage() {
  const params = useParams();
  const codigoEspecialidad = params?.codigoEspecialidad as string;
  const [specialty, setSpecialty] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [showInfoNotification, setShowInfoNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formValues, setFormValues] = useState<any>(null);
  const formikRef = useRef<FormikProps<any>>(null);

  // Cargar datos de la especialidad
  useEffect(() => {
    if (codigoEspecialidad) {
      fetch(`http://127.0.0.1:8000/specialty/${codigoEspecialidad}`)
        .then(res => {
          if (!res.ok) {
            throw new Error("Error al cargar los datos de la especialidad");
          }
          return res.json();
        })
        .then(data => setSpecialty(data))
        .catch(err => {
          setErrorMessage("Error al cargar los datos");
          setErrorDetails(err.message);
          setShowErrorNotification(true);
        });
    }
  }, [codigoEspecialidad]);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setFormValues(values);
    setShowConfirmModal(true);
    setSubmitting(false);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);
    
    try {
      const res = await fetch("http://127.0.0.1:8000/specialty/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CodigoEspecialidad: parseInt(codigoEspecialidad),
          DescripcionEspecialidad: formValues?.descripcionEspecialidad?.trim(),
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        // Manejo específico de errores del servidor
        if (res.status === 400) {
          throw new Error("Datos inválidos. Verifica la información ingresada.");
        } else if (res.status === 404) {
          throw new Error("Especialidad no encontrada.");
        } else if (res.status === 409) {
          throw new Error("Ya existe una especialidad con esa descripción.");
        } else if (res.status === 500) {
          throw new Error("Error interno del servidor. Intenta nuevamente más tarde.");
        } else {
          throw new Error(data.detail || "Error al actualizar la especialidad");
        }
      }
      
      setShowSuccessNotification(true);
      
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

  if (!specialty) {
    return (
      <SectionMain>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos de la especialidad...</p>
          </div>
        </div>
      </SectionMain>
    );
  }

  return (
    <>
      <Head>
        <title>{getPageTitle("Actualizar Especialidad")}</title>
      </Head>

      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiBallotOutline}
          title="Actualizar Especialidad"
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
            <b>¡Éxito!</b> Especialidad actualizada correctamente
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
            <b>Información:</b> Los cambios han sido aplicados exitosamente
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
          title="Confirmar actualización de especialidad"
          buttonColor="info"
          buttonLabel={isSubmitting ? "Actualizando..." : "Confirmar"}
          isActive={showConfirmModal}
          onConfirm={confirmSubmit}
          onCancel={() => setShowConfirmModal(false)}
        >
          <div className="space-y-4">
            <p>¿Estás seguro de que deseas actualizar la especialidad con los siguientes datos?</p>
            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg space-y-2 text-sm">
              <p><strong>Código:</strong> {codigoEspecialidad}</p>
              <p><strong>Descripción:</strong> {formValues?.descripcionEspecialidad}</p>
            </div>
            <div className="text-xs text-gray-500 dark:text-slate-400">
              <p>• La descripción debe ser única en el sistema</p>
              <p>• Los cambios se aplicarán inmediatamente</p>
            </div>
          </div>
        </CardBoxModal>

        <CardBox>
          <Formik
            initialValues={{
              codigoEspecialidad: specialty.CodigoEspecialidad,
              descripcionEspecialidad: specialty.DescripcionEspecialidad,
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
                      label="Código de Especialidad" 
                      labelFor="codigoEspecialidad" 
                      icon={mdiText}
                    >
                      {({ className }) => (
                        <Field
                          name="codigoEspecialidad"
                          id="codigoEspecialidad"
                          placeholder="Código"
                          className={`${className} bg-gray-100 text-gray-400 font-semibold`}
                          required
                          readOnly
                        />
                      )}
                    </FormField>
                  </div>
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
                          placeholder="Ej: Mecánica automotriz, Electricidad, etc."
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
                    label={isSubmitting ? "Actualizando..." : "Actualizar"} 
                    icon={isSubmitting ? mdiLoading : undefined}
                    disabled={isSubmitting || !isValid || !dirty}
                    isGrouped 
                  />
                  <Button
                    type="reset"
                    color="info"
                    outline
                    label="Restaurar"
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