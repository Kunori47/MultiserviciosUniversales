"use client";

import {
  mdiBallotOutline,
  mdiText,
  mdiCheckCircle,
  mdiAlertCircle,
  mdiLoading,
  mdiInformation,
  mdiClose,
  mdiClock,
  mdiSpeedometer,
  mdiCar,
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
  tiempoUso: Yup.number()
    .min(1, "El tiempo de uso debe ser mayor a 0")
    .required("El tiempo de uso es obligatorio"),
  kilometraje: Yup.number()
    .min(1, "El kilometraje debe ser mayor a 0")
    .required("El kilometraje es obligatorio"),
  descripcionMantenimiento: Yup.string()
    .min(5, "La descripción debe tener al menos 5 caracteres")
    .max(500, "La descripción no puede exceder 500 caracteres")
    .required("La descripción es obligatoria")
    .trim(),
  codigoMarca: Yup.number()
    .min(1, "El código de marca debe ser mayor a 0")
    .required("El código de marca es obligatorio"),
  numeroCorrelativoModelo: Yup.number()
    .min(1, "El número correlativo del modelo debe ser mayor a 0")
    .required("El número correlativo del modelo es obligatorio"),
});

export default function UpdateMaintenancePlanPage() {
  const params = useParams();
  const codigoMantenimiento = params?.codigoMantenimiento as string;
  const [maintenancePlan, setMaintenancePlan] = useState<any>(null);
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [showInfoNotification, setShowInfoNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formValues, setFormValues] = useState<any>(null);
  const formikRef = useRef<FormikProps<any>>(null);

  // Cargar datos del plan de mantenimiento
  useEffect(() => {
    if (codigoMantenimiento) {
      fetch(`http://127.0.0.1:8000/maintenanceplan/${codigoMantenimiento}`)
        .then(res => {
          if (!res.ok) {
            throw new Error("Error al cargar los datos del plan de mantenimiento");
          }
          return res.json();
        })
        .then(data => setMaintenancePlan(data))
        .catch(err => {
          setErrorMessage("Error al cargar los datos");
          setErrorDetails(err.message);
          setShowErrorNotification(true);
        });
    }
  }, [codigoMantenimiento]);

  // Cargar marcas
  useEffect(() => {
    fetch("http://127.0.0.1:8000/brand")
      .then(res => res.json())
      .then(data => setBrands(data))
      .catch(err => console.error("Error cargando marcas:", err));
  }, []);

  // Cargar modelos cuando cambie la marca seleccionada
  const loadModels = async (codigoMarca: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/model`);
      const data = await res.json();
      const filteredModels = data.filter((model: any) => model.CodigoMarca === codigoMarca);
      setModels(filteredModels);
    } catch (err) {
      console.error("Error cargando modelos:", err);
    }
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setFormValues(values);
    setShowConfirmModal(true);
    setSubmitting(false);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);
    
    try {
      const res = await fetch("http://127.0.0.1:8000/maintenanceplan/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CodigoMantenimiento: parseInt(codigoMantenimiento),
          TiempoUso: formValues?.tiempoUso,
          Kilometraje: formValues?.kilometraje,
          DescripcionMantenimiento: formValues?.descripcionMantenimiento?.trim(),
          CodigoMarca: formValues?.codigoMarca,
          NumeroCorrelativoModelo: formValues?.numeroCorrelativoModelo,
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        // Manejo específico de errores del servidor
        if (res.status === 400) {
          throw new Error("Datos inválidos. Verifica la información ingresada.");
        } else if (res.status === 404) {
          throw new Error("Plan de mantenimiento no encontrado.");
        } else if (res.status === 409) {
          throw new Error("Ya existe un plan de mantenimiento similar.");
        } else if (res.status === 500) {
          throw new Error("Error interno del servidor. Intenta nuevamente más tarde.");
        } else {
          throw new Error(data.detail || "Error al actualizar el plan de mantenimiento");
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

  if (!maintenancePlan) {
    return (
      <SectionMain>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos del plan de mantenimiento...</p>
          </div>
        </div>
      </SectionMain>
    );
  }

  return (
    <>
      <Head>
        <title>{getPageTitle("Actualizar Plan de Mantenimiento")}</title>
      </Head>

      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiBallotOutline}
          title="Actualizar Plan de Mantenimiento"
          main
        >
          <Button
            href={`/dashboard/administration/maintenance-plans/`}
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
            <b>¡Éxito!</b> Plan de mantenimiento actualizado correctamente
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
          title="Confirmar actualización de plan de mantenimiento"
          buttonColor="info"
          buttonLabel={isSubmitting ? "Actualizando..." : "Confirmar"}
          isActive={showConfirmModal}
          onConfirm={confirmSubmit}
          onCancel={() => setShowConfirmModal(false)}
        >
          <div className="space-y-4">
            <p>¿Estás seguro de que deseas actualizar el plan de mantenimiento con los siguientes datos?</p>
            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg space-y-2 text-sm">
              <p><strong>Código:</strong> {codigoMantenimiento}</p>
              <p><strong>Tiempo de Uso:</strong> {formValues?.tiempoUso} horas</p>
              <p><strong>Kilometraje:</strong> {formValues?.kilometraje} km</p>
              <p><strong>Descripción:</strong> {formValues?.descripcionMantenimiento}</p>
              <p><strong>Marca:</strong> {formValues?.codigoMarca}</p>
              <p><strong>Modelo:</strong> {formValues?.numeroCorrelativoModelo}</p>
            </div>
          </div>
        </CardBoxModal>

        <CardBox>
          <Formik
            initialValues={{
              codigoMantenimiento: maintenancePlan.CodigoMantenimiento,
              tiempoUso: maintenancePlan.TiempoUso,
              kilometraje: maintenancePlan.Kilometraje,
              descripcionMantenimiento: maintenancePlan.DescripcionMantenimiento,
              codigoMarca: maintenancePlan.CodigoMarca,
              numeroCorrelativoModelo: maintenancePlan.NumeroCorrelativoModelo,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            ref={formikRef}
          >
            {({ errors, touched, isValid, dirty, setFieldValue, values }) => (
              <Form>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-12 last:mb-0">
                  <div>
                    <FormField 
                      label="Código de Mantenimiento" 
                      labelFor="codigoMantenimiento" 
                      icon={mdiText}
                    >
                      {({ className }) => (
                        <Field
                          name="codigoMantenimiento"
                          id="codigoMantenimiento"
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
                      label="Tiempo de Uso (horas)" 
                      labelFor="tiempoUso" 
                      icon={mdiClock}
                      help={errors.tiempoUso && touched.tiempoUso ? String(errors.tiempoUso) : undefined}
                    >
                      {({ className }) => (
                        <Field
                          name="tiempoUso"
                          id="tiempoUso"
                          type="number"
                          placeholder="Ej: 5000"
                          className={`${className} ${errors.tiempoUso && touched.tiempoUso ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
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
                      label="Kilometraje (km)" 
                      labelFor="kilometraje" 
                      icon={mdiSpeedometer}
                      help={errors.kilometraje && touched.kilometraje ? String(errors.kilometraje) : undefined}
                    >
                      {({ className }) => (
                        <Field
                          name="kilometraje"
                          id="kilometraje"
                          type="number"
                          placeholder="Ej: 50000"
                          className={`${className} ${errors.kilometraje && touched.kilometraje ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                          required
                          disabled={isSubmitting}
                        />
                      )}
                    </FormField>
                  </div>
                  <div>
                    <FormField 
                      label="Código de Marca" 
                      labelFor="codigoMarca" 
                      icon={mdiCar}
                      help={errors.codigoMarca && touched.codigoMarca ? String(errors.codigoMarca) : undefined}
                    >
                      {({ className }) => (
                        <Field
                          name="codigoMarca"
                          id="codigoMarca"
                          component="select"
                          className={`${className} ${errors.codigoMarca && touched.codigoMarca ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                          required
                          disabled={isSubmitting}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            setFieldValue("codigoMarca", parseInt(e.target.value));
                            setFieldValue("numeroCorrelativoModelo", "");
                            if (e.target.value) {
                              loadModels(parseInt(e.target.value));
                            }
                          }}
                        >
                          <option value="">Selecciona una marca</option>
                          {brands.map((brand) => (
                            <option key={brand.CodigoMarca} value={brand.CodigoMarca}>
                              {brand.Nombre}
                            </option>
                          ))}
                        </Field>
                      )}
                    </FormField>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-12 last:mb-0">
                  <div>
                    <FormField 
                      label="Número Correlativo del Modelo" 
                      labelFor="numeroCorrelativoModelo" 
                      icon={mdiCar}
                      help={errors.numeroCorrelativoModelo && touched.numeroCorrelativoModelo ? String(errors.numeroCorrelativoModelo) : undefined}
                    >
                      {({ className }) => (
                        <Field
                          name="numeroCorrelativoModelo"
                          id="numeroCorrelativoModelo"
                          component="select"
                          className={`${className} ${errors.numeroCorrelativoModelo && touched.numeroCorrelativoModelo ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                          required
                          disabled={isSubmitting || !values.codigoMarca}
                        >
                          <option value="">Selecciona un modelo</option>
                          {models.map((model) => (
                            <option key={model.NumeroCorrelativoModelo} value={model.NumeroCorrelativoModelo}>
                              {model.DescripcionModelo}
                            </option>
                          ))}
                        </Field>
                      )}
                    </FormField>
                  </div>
                </div>

                <div className="mb-12 last:mb-0">
                  <FormField 
                    label="Descripción del Mantenimiento" 
                    labelFor="descripcionMantenimiento" 
                    icon={mdiText}
                    help={errors.descripcionMantenimiento && touched.descripcionMantenimiento ? String(errors.descripcionMantenimiento) : undefined}
                  >
                    {({ className }) => (
                      <Field
                        name="descripcionMantenimiento"
                        id="descripcionMantenimiento"
                        component="textarea"
                        placeholder="Describe las actividades de mantenimiento que se deben realizar..."
                        className={`${className} ${errors.descripcionMantenimiento && touched.descripcionMantenimiento ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                        rows={4}
                        required
                        disabled={isSubmitting}
                      />
                    )}
                  </FormField>
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