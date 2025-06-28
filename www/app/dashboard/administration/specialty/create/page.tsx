"use client";

import {
  mdiAccount,
  mdiBallotOutline,
  mdiText,
  mdiCheckCircle,
  mdiAlertCircle,
  mdiLoading,
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

  const handleSubmit = async (values: any, { resetForm }: any) => {
    setFormValues(values);
    setShowConfirmModal(true);
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
          DescripcionEspecialidad: formValues?.descripcionEspecialidad,
        }),
      });
      
      if (!res.ok) {
        throw new Error("Error al crear la especialidad");
      }
      
      const data = await res.json();
      setShowSuccessNotification(true);
      formikRef.current?.resetForm();
      
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
            <b>¡Éxito!</b> Especialidad creada correctamente
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
          title="Confirmar creación de especialidad"
          buttonColor="info"
          buttonLabel="Confirmar"
          isActive={showConfirmModal}
          onConfirm={confirmSubmit}
          onCancel={() => setShowConfirmModal(false)}
        >
          <p>¿Estás seguro de que deseas crear la especialidad con los siguientes datos?</p>
          <div className="mt-4 space-y-2 text-sm">
            <p><strong>Descripción:</strong> {formValues?.descripcionEspecialidad}</p>
          </div>
        </CardBoxModal>

        <CardBox>
          <Formik
            initialValues={{
              descripcionEspecialidad: "",
            }}
            onSubmit={handleSubmit}
            ref={formikRef}
          >
            <Form>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-12 last:mb-0">
                <div>
                  <FormField label="Descripción de la Especialidad" labelFor="descripcionEspecialidad" icon={mdiText}>
                    {({ className }) => (
                      <Field
                        name="descripcionEspecialidad"
                        id="descripcionEspecialidad"
                        placeholder="Descripción de la especialidad"
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