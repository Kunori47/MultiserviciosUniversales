"use client";

import {
  mdiBallotOutline,
  mdiText,
  mdiCheckCircle,
  mdiAlertCircle,
  mdiLoading,
  mdiInformation,
  mdiClose,
  mdiCar,
  mdiOil,
  mdiGasStation,
  mdiScale,
} from "@mdi/js";
import { Field, Form, Formik, FormikProps } from "formik";
import * as Yup from "yup";
import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Button from "../../../../../../_components/Button";
import Buttons from "../../../../../../_components/Buttons";
import Divider from "../../../../../../_components/Divider";
import CardBox from "../../../../../../_components/CardBox";
import CardBoxModal from "../../../../../../_components/CardBox/Modal";
import FormField from "../../../../../../_components/FormField";
import NotificationBar from "../../../../../../_components/NotificationBar";
import SectionMain from "../../../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../../../_components/Section/TitleLineWithButton";
import { getPageTitle } from "../../../../../../_lib/config";

// Esquema de validación
const validationSchema = Yup.object().shape({
  descripcionModelo: Yup.string()
    .min(3, "La descripción debe tener al menos 3 caracteres")
    .max(100, "La descripción no puede exceder 100 caracteres")
    .required("La descripción es obligatoria")
    .trim(),
  cantidadPuestos: Yup.number()
    .min(1, "La cantidad de puestos debe ser mayor a 0")
    .max(20, "La cantidad de puestos no puede exceder 20")
    .required("La cantidad de puestos es obligatoria"),
  tipoRefrigerante: Yup.string()
    .min(2, "El tipo de refrigerante debe tener al menos 2 caracteres")
    .max(50, "El tipo de refrigerante no puede exceder 50 caracteres")
    .required("El tipo de refrigerante es obligatorio")
    .trim(),
  tipoGasolina: Yup.string()
    .min(2, "El tipo de gasolina debe tener al menos 2 caracteres")
    .max(50, "El tipo de gasolina no puede exceder 50 caracteres")
    .required("El tipo de gasolina es obligatorio")
    .trim(),
  tipoAceite: Yup.string()
    .min(2, "El tipo de aceite debe tener al menos 2 caracteres")
    .max(50, "El tipo de aceite no puede exceder 50 caracteres")
    .required("El tipo de aceite es obligatorio")
    .trim(),
  peso: Yup.number()
    .min(100, "El peso debe ser mayor a 100 kg")
    .max(10000, "El peso no puede exceder 10000 kg")
    .required("El peso es obligatorio"),
});

export default function UpdateModelPage() {
  const params = useParams();
  const codigoMarca = params?.codigoMarca as string;
  const numeroCorrelativoModelo = params?.numeroCorrelativoModelo as string;
  const [model, setModel] = useState<any>(null);
  const [brands, setBrands] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [showInfoNotification, setShowInfoNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formValues, setFormValues] = useState<any>(null);
  const formikRef = useRef<FormikProps<any>>(null);

  // Cargar datos del modelo
  useEffect(() => {
    if (codigoMarca && numeroCorrelativoModelo) {
      fetch(`http://127.0.0.1:8000/model/${codigoMarca}/${numeroCorrelativoModelo}`)
        .then(res => {
          if (!res.ok) {
            throw new Error("Error al cargar los datos del modelo");
          }
          return res.json();
        })
        .then(data => setModel(data))
        .catch(err => {
          setErrorMessage("Error al cargar los datos");
          setErrorDetails(err.message);
          setShowErrorNotification(true);
        });
    }
  }, [codigoMarca, numeroCorrelativoModelo]);

  // Cargar marcas
  useEffect(() => {
    fetch("http://127.0.0.1:8000/brand")
      .then(res => res.json())
      .then(data => setBrands(data))
      .catch(err => console.error("Error cargando marcas:", err));
  }, []);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setFormValues(values);
    setShowConfirmModal(true);
    setSubmitting(false);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);
    try {
      const res = await fetch("http://127.0.0.1:8000/model/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CodigoMarca: parseInt(codigoMarca),
          NumeroCorrelativoModelo: parseInt(numeroCorrelativoModelo),
          DescripcionModelo: formValues?.descripcionModelo?.trim(),
          CantidadPuestos: formValues?.cantidadPuestos,
          TipoRefrigerante: formValues?.tipoRefrigerante?.trim(),
          TipoGasolina: formValues?.tipoGasolina?.trim(),
          TipoAceite: formValues?.tipoAceite?.trim(),
          Peso: formValues?.peso,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 400) {
          throw new Error("Datos inválidos. Verifica la información ingresada.");
        } else if (res.status === 404) {
          throw new Error("Modelo no encontrado.");
        } else if (res.status === 409) {
          throw new Error("Ya existe un modelo similar.");
        } else if (res.status === 500) {
          throw new Error("Error interno del servidor. Intenta nuevamente más tarde.");
        } else {
          throw new Error(data.detail || "Error al actualizar el modelo");
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

  if (!model) {
    return (
      <SectionMain>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos del modelo...</p>
          </div>
        </div>
      </SectionMain>
    );
  }

  return (
    <>
      <Head>
        <title>{getPageTitle("Actualizar Modelo")}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiBallotOutline}
          title="Actualizar Modelo"
          main
        >
          <Button
            href={`/dashboard/administration/brands-models/`}
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
            <b>¡Éxito!</b> Modelo actualizado correctamente
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
          title="Confirmar actualización de modelo"
          buttonColor="info"
          buttonLabel={isSubmitting ? "Actualizando..." : "Confirmar"}
          isActive={showConfirmModal}
          onConfirm={confirmSubmit}
          onCancel={() => setShowConfirmModal(false)}
        >
          <div className="">
            <p>¿Estás seguro de que deseas actualizar el modelo con los siguientes datos?</p>
            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg space-y-2 text-sm">
              <p><strong>Código de Marca:</strong> {codigoMarca}</p>
              <p><strong>Número Correlativo:</strong> {numeroCorrelativoModelo}</p>
              <p><strong>Descripción:</strong> {formValues?.descripcionModelo}</p>
              <p><strong>Cantidad de Puestos:</strong> {formValues?.cantidadPuestos}</p>
              <p><strong>Tipo de Refrigerante:</strong> {formValues?.tipoRefrigerante}</p>
              <p><strong>Tipo de Gasolina:</strong> {formValues?.tipoGasolina}</p>
              <p><strong>Tipo de Aceite:</strong> {formValues?.tipoAceite}</p>
              <p><strong>Peso:</strong> {formValues?.peso} kg</p>
            </div>
          </div>
        </CardBoxModal>

        <CardBox>
          <Formik
            initialValues={{
              codigoMarca: model.CodigoMarca,
              numeroCorrelativoModelo: model.NumeroCorrelativoModelo,
              descripcionModelo: model.DescripcionModelo,
              cantidadPuestos: model.CantidadPuestos,
              tipoRefrigerante: model.TipoRefrigerante,
              tipoGasolina: model.TipoGasolina,
              tipoAceite: model.TipoAceite,
              peso: model.Peso,
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
                      label="Código de Marca" 
                      labelFor="codigoMarca" 
                      icon={mdiCar}
                    >
                      {({ className }) => (
                        <Field
                          name="codigoMarca"
                          id="codigoMarca"
                          component="select"
                          className={`${className} bg-gray-100 text-gray-400 font-semibold`}
                          required
                          disabled
                        >
                          {brands.map((brand) => (
                            <option key={brand.CodigoMarca} value={brand.CodigoMarca}>
                              {brand.Nombre}
                            </option>
                          ))}
                        </Field>
                      )}
                    </FormField>
                  </div>
                  <div>
                    <FormField 
                      label="Número Correlativo del Modelo" 
                      labelFor="numeroCorrelativoModelo" 
                      icon={mdiCar}
                    >
                      {({ className }) => (
                        <Field
                          name="numeroCorrelativoModelo"
                          id="numeroCorrelativoModelo"
                          placeholder="Número"
                          className={`${className} bg-gray-100 text-gray-400 font-semibold`}
                          required
                          readOnly
                        />
                      )}
                    </FormField>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-12 last:mb-0">
                  <div>
                    <FormField 
                      label="Descripción del Modelo" 
                      labelFor="descripcionModelo" 
                      icon={mdiText}
                      help={errors.descripcionModelo && touched.descripcionModelo ? String(errors.descripcionModelo) : undefined}
                    >
                      {({ className }) => (
                        <Field
                          name="descripcionModelo"
                          id="descripcionModelo"
                          placeholder="Ej: Corolla 2023, Civic LX, etc."
                          className={`${className} ${errors.descripcionModelo && touched.descripcionModelo ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                          required
                          disabled={isSubmitting}
                        />
                      )}
                    </FormField>
                  </div>
                  <div>
                    <FormField 
                      label="Cantidad de Puestos" 
                      labelFor="cantidadPuestos" 
                      icon={mdiCar}
                      help={errors.cantidadPuestos && touched.cantidadPuestos ? String(errors.cantidadPuestos) : undefined}
                    >
                      {({ className }) => (
                        <Field
                          name="cantidadPuestos"
                          id="cantidadPuestos"
                          type="number"
                          placeholder="Ej: 5"
                          className={`${className} ${errors.cantidadPuestos && touched.cantidadPuestos ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
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
                      label="Tipo de Refrigerante" 
                      labelFor="tipoRefrigerante" 
                      icon={mdiOil}
                      help={errors.tipoRefrigerante && touched.tipoRefrigerante ? String(errors.tipoRefrigerante) : undefined}
                    >
                      {({ className }) => (
                        <Field
                          name="tipoRefrigerante"
                          id="tipoRefrigerante"
                          placeholder="Ej: R134a, R1234yf"
                          className={`${className} ${errors.tipoRefrigerante && touched.tipoRefrigerante ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                          required
                          disabled={isSubmitting}
                        />
                      )}
                    </FormField>
                  </div>
                  <div>
                    <FormField 
                      label="Tipo de Gasolina" 
                      labelFor="tipoGasolina" 
                      icon={mdiGasStation}
                      help={errors.tipoGasolina && touched.tipoGasolina ? String(errors.tipoGasolina) : undefined}
                    >
                      {({ className }) => (
                        <Field
                          name="tipoGasolina"
                          id="tipoGasolina"
                          placeholder="Ej: 91, 95, 97"
                          className={`${className} ${errors.tipoGasolina && touched.tipoGasolina ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
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
                      label="Tipo de Aceite" 
                      labelFor="tipoAceite" 
                      icon={mdiOil}
                      help={errors.tipoAceite && touched.tipoAceite ? String(errors.tipoAceite) : undefined}
                    >
                      {({ className }) => (
                        <Field
                          name="tipoAceite"
                          id="tipoAceite"
                          placeholder="Ej: 5W-30, 10W-40"
                          className={`${className} ${errors.tipoAceite && touched.tipoAceite ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                          required
                          disabled={isSubmitting}
                        />
                      )}
                    </FormField>
                  </div>
                  <div>
                    <FormField 
                      label="Peso (kg)" 
                      labelFor="peso" 
                      icon={mdiScale}
                      help={errors.peso && touched.peso ? String(errors.peso) : undefined}
                    >
                      {({ className }) => (
                        <Field
                          name="peso"
                          id="peso"
                          type="number"
                          placeholder="Ej: 1500"
                          className={`${className} ${errors.peso && touched.peso ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
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