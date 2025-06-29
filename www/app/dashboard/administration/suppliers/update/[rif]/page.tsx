"use client";

import {
  mdiBallotOutline,
  mdiText,
  mdiCheckCircle,
  mdiAlertCircle,
  mdiLoading,
  mdiInformation,
  mdiClose,
  mdiAccount,
  mdiPhone,
  mdiMapMarker,
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
  RIF: Yup.string().required("El RIF es obligatorio"),
  RazonSocial: Yup.string().required("La razón social es obligatoria"),
  Direccion: Yup.string().required("La dirección es obligatoria"),
  TelefonoLocal: Yup.string().required("El teléfono local es obligatorio"),
  TelefonoCelular: Yup.string().required("El teléfono celular es obligatorio"),
  PersonaContacto: Yup.string().required("La persona de contacto es obligatoria"),
});

export default function UpdateSupplierPage() {
  const params = useParams();
  const rif = params?.rif as string;
  const [supplier, setSupplier] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [showInfoNotification, setShowInfoNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formValues, setFormValues] = useState<any>(null);
  const formikRef = useRef<FormikProps<any>>(null);

  // Cargar datos del proveedor
  useEffect(() => {
    if (rif) {
      fetch(`http://127.0.0.1:8000/vendor/${rif}`)
        .then(res => {
          if (!res.ok) {
            throw new Error("Error al cargar los datos del proveedor");
          }
          return res.json();
        })
        .then(data => setSupplier(data))
        .catch(err => {
          setErrorMessage("Error al cargar los datos");
          setErrorDetails(err.message);
          setShowErrorNotification(true);
        });
    }
  }, [rif]);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setFormValues(values);
    setShowConfirmModal(true);
    setSubmitting(false);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);
    try {
      const res = await fetch("http://127.0.0.1:8000/vendor/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          RIF: formValues?.RIF,
          RazonSocial: formValues?.RazonSocial,
          Direccion: formValues?.Direccion,
          TelefonoLocal: formValues?.TelefonoLocal,
          TelefonoCelular: formValues?.TelefonoCelular,
          PersonaContacto: formValues?.PersonaContacto,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 400) {
          throw new Error("Datos inválidos. Verifica la información ingresada.");
        } else if (res.status === 404) {
          throw new Error("Proveedor no encontrado.");
        } else if (res.status === 409) {
          throw new Error("Ya existe un proveedor con ese RIF.");
        } else if (res.status === 500) {
          throw new Error("Error interno del servidor. Intenta nuevamente más tarde.");
        } else {
          throw new Error(data.detail || "Error al actualizar el proveedor");
        }
      }
      setShowSuccessNotification(true);
      setShowInfoNotification(true);
      setTimeout(() => {
        setShowSuccessNotification(false);
        setShowInfoNotification(false);
      }, 5000);
    } catch (err: any) {
      setErrorMessage(err.message);
      setErrorDetails("Si el problema persiste, contacta al administrador del sistema.");
      setShowErrorNotification(true);
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

  if (!supplier) {
    return (
      <SectionMain>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos del proveedor...</p>
          </div>
        </div>
      </SectionMain>
    );
  }

  return (
    <>
      <Head>
        <title>{getPageTitle("Actualizar Proveedor")}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiBallotOutline}
          title="Actualizar Proveedor"
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
            <b>¡Éxito!</b> Proveedor actualizado correctamente
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
          title="Confirmar actualización de proveedor"
          buttonColor="info"
          buttonLabel={isSubmitting ? "Actualizando..." : "Confirmar"}
          isActive={showConfirmModal}
          onConfirm={confirmSubmit}
          onCancel={() => setShowConfirmModal(false)}
        >
          <div className="space-y-4">
            <p>¿Estás seguro de que deseas actualizar el proveedor con los siguientes datos?</p>
            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg space-y-2 text-sm">
              <p><strong>RIF:</strong> {formValues?.RIF}</p>
              <p><strong>Razón Social:</strong> {formValues?.RazonSocial}</p>
              <p><strong>Dirección:</strong> {formValues?.Direccion}</p>
              <p><strong>Teléfono Local:</strong> {formValues?.TelefonoLocal}</p>
              <p><strong>Teléfono Celular:</strong> {formValues?.TelefonoCelular}</p>
              <p><strong>Persona de Contacto:</strong> {formValues?.PersonaContacto}</p>
            </div>
            <div className="text-xs text-gray-500 dark:text-slate-400">
              <p>• El RIF debe ser único en el sistema</p>
              <p>• Los cambios se aplicarán inmediatamente</p>
            </div>
          </div>
        </CardBoxModal>

        <CardBox>
          <Formik
            initialValues={{
              RIF: supplier.RIF,
              RazonSocial: supplier.RazonSocial,
              Direccion: supplier.Direccion,
              TelefonoLocal: supplier.TelefonoLocal,
              TelefonoCelular: supplier.TelefonoCelular,
              PersonaContacto: supplier.PersonaContacto,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            ref={formikRef}
            enableReinitialize
          >
            {({ errors, touched, isValid, dirty }) => (
              <Form>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-12 last:mb-0">
                  <div>
                    <FormField 
                      label="RIF" 
                      labelFor="RIF" 
                      icon={mdiAccount}
                    >
                      {({ className }) => (
                        <Field
                          name="RIF"
                          id="RIF"
                          placeholder="RIF"
                          className={`${className} bg-gray-100 text-gray-400 font-semibold`}
                          required
                          readOnly
                        />
                      )}
                    </FormField>
                  </div>
                  <div>
                    <FormField 
                      label="Razón Social" 
                      labelFor="RazonSocial" 
                      icon={mdiText}
                      help={errors.RazonSocial && touched.RazonSocial ? String(errors.RazonSocial) : undefined}
                    >
                      {({ className }) => (
                        <Field
                          name="RazonSocial"
                          id="RazonSocial"
                          placeholder="Razón Social"
                          className={`${className} ${errors.RazonSocial && touched.RazonSocial ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                          required
                          disabled={isSubmitting}
                        />
                      )}
                    </FormField>
                  </div>
                </div>
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
                          id="Direccion"
                          placeholder="Dirección"
                          className={`${className} ${errors.Direccion && touched.Direccion ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                          required
                          disabled={isSubmitting}
                        />
                      )}
                    </FormField>
                  </div>
                  <div>
                    <FormField 
                      label="Teléfono Local" 
                      labelFor="TelefonoLocal" 
                      icon={mdiPhone}
                      help={errors.TelefonoLocal && touched.TelefonoLocal ? String(errors.TelefonoLocal) : undefined}
                    >
                      {({ className }) => (
                        <Field
                          name="TelefonoLocal"
                          id="TelefonoLocal"
                          placeholder="Teléfono Local"
                          className={`${className} ${errors.TelefonoLocal && touched.TelefonoLocal ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                          required
                          disabled={isSubmitting}
                        />
                      )}
                    </FormField>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-12 last:mb-0">
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
                          placeholder="Teléfono Celular"
                          className={`${className} ${errors.TelefonoCelular && touched.TelefonoCelular ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
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
                          placeholder="Persona de Contacto"
                          className={`${className} ${errors.PersonaContacto && touched.PersonaContacto ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
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