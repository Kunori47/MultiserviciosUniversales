"use client";

import {
  mdiWarehouse,
  mdiPlus,
  mdiTagEdit,
} from "@mdi/js";
import Button from "../../../../../../_components/Button";
import Divider from "../../../../../../_components/Divider";
import CardBox from "../../../../../../_components/CardBox";
import SectionMain from "../../../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../../../_components/Section/TitleLineWithButton";
import FormField from "../../../../../../_components/FormField";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Field, Formik } from "formik";

export default function UpdateProductPage() {
  const params = useParams();
  const rif = params?.rif as string;
  const codigo = params?.codigo as string;
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (rif && codigo) {
      fetchProduct();
    }
  }, [rif, codigo]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/product_franchise/product?FranquiciaRIF=${rif}&CodigoProducto=${codigo}`);
      if (!res.ok) {
        throw new Error("Error al cargar el producto");
      }
      const data = await res.json();
      setProduct(data);
    } catch (err) {
      console.error("Error cargando producto:", err);
      alert("Error al cargar el producto");
    } finally {
      setInitialLoading(false);
    }
  };

  const validateForm = (values: any) => {
    const errors: any = {};
    if (!values.Precio || values.Precio <= 0) {
      errors.Precio = "El precio debe ser positivo";
    }
    if (!values.CantidadMinima || values.CantidadMinima < 0) {
      errors.CantidadMinima = "La cantidad mínima no puede ser negativa";
    }
    if (!values.CantidadMaxima || values.CantidadMaxima < 0) {
      errors.CantidadMaxima = "La cantidad máxima no puede ser negativa";
    }
    if (parseInt(values.CantidadMaxima) <= parseInt(values.CantidadMinima)) {
      errors.CantidadMaxima = "La cantidad máxima debe ser mayor que la mínima";
    }
    return errors;
  };

  const handleSubmit = async (values: any, { setSubmitting, setErrors }: any) => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/product_franchise/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          FranquiciaRIF: rif,
          CodigoProducto: parseInt(codigo),
          Precio: parseFloat(values.Precio),
          Cantidad: product.Cantidad, // Mantener la cantidad actual
          CantidadMinima: parseInt(values.CantidadMinima),
          CantidadMaxima: parseInt(values.CantidadMaxima),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al actualizar el producto");
      }

      // Redirigir a la página de inventario
      router.push(`/dashboard/franchise/${rif}/inventory`);
    } catch (error: any) {
      console.error("Error:", error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
      <SectionMain>
        <div className="max-w-2xl mx-auto">
          <CardBox className="bg-white shadow-sm border border-gray-200">
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando producto...</p>
            </div>
          </CardBox>
        </div>
      </SectionMain>
    );
  }

  if (!product) {
    return (
      <SectionMain>
        <div className="max-w-2xl mx-auto">
          <CardBox className="bg-white shadow-sm border border-gray-200">
            <div className="p-8 text-center">
              <p className="text-red-600">Producto no encontrado</p>
              <Button
                href={`/dashboard/franchise/${rif}/inventory`}
                color="info"
                label="Volver al Inventario"
                className="mt-4"
              />
            </div>
          </CardBox>
        </div>
      </SectionMain>
    );
  }

  return (
    <>
      <SectionMain>
        <div className="max-w-2xl mx-auto">
          <SectionTitleLineWithButton
            icon={mdiTagEdit}
            title={`Editar Producto: ${product.NombreProducto}`}
            main
          >
            <Button
              href={`/dashboard/franchise/${rif}/inventory`}
              color="info"
              label="Atras"
              roundedFull
            />
          </SectionTitleLineWithButton>

          <Divider />

          {/* Información del Producto */}
          <CardBox className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm border border-blue-200 mb-6">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Información del Producto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-700">Código:</p>
                  <p className="font-medium text-blue-900">{product.CodigoProducto}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Nombre:</p>
                  <p className="font-medium text-blue-900">{product.NombreProducto}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Categoría:</p>
                  <p className="font-medium text-blue-900">{product.Categoria}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Cantidad Actual:</p>
                  <p className="font-medium text-blue-900">{product.Cantidad}</p>
                </div>
              </div>
            </div>
          </CardBox>

          {/* Formulario de Edición */}
          <CardBox className="bg-white shadow-sm border border-gray-200">
            <div className="p-8">
              <Formik
                initialValues={{
                  Precio: product.Precio || "",
                  CantidadMinima: product.CantidadMinima || "",
                  CantidadMaxima: product.CantidadMaxima || "",
                }}
                validate={validateForm}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <FormField label="Precio" labelFor="Precio" icon={mdiPlus}>
                        {({ className }) => (
                          <Field
                            type="number"
                            name="Precio"
                            id="Precio"
                            placeholder="0.00"
                            step="0.01"
                            className={className}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.Precio}
                          />
                        )}
                      </FormField>
                      {errors.Precio && touched.Precio && (
                        <div className="text-red-500 text-sm">{errors.Precio as string}</div>
                      )}

                      <FormField label="Cantidad Mínima" labelFor="CantidadMinima" icon={mdiPlus}>
                        {({ className }) => (
                          <Field
                            type="number"
                            name="CantidadMinima"
                            id="CantidadMinima"
                            placeholder="0"
                            min="0"
                            className={className}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.CantidadMinima}
                          />
                        )}
                      </FormField>
                      {errors.CantidadMinima && touched.CantidadMinima && (
                        <div className="text-red-500 text-sm">{errors.CantidadMinima as string}</div>
                      )}

                      <FormField label="Cantidad Máxima" labelFor="CantidadMaxima" icon={mdiPlus}>
                        {({ className }) => (
                          <Field
                            type="number"
                            name="CantidadMaxima"
                            id="CantidadMaxima"
                            placeholder="0"
                            min="0"
                            className={className}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.CantidadMaxima}
                          />
                        )}
                      </FormField>
                      {errors.CantidadMaxima && touched.CantidadMaxima && (
                        <div className="text-red-500 text-sm">{errors.CantidadMaxima as string}</div>
                      )}
                    </div>

                    {errors.submit && (
                      <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {errors.submit as string}
                      </div>
                    )}

                    <div className="flex justify-center gap-4">
                      <Button
                        type="submit"
                        color="success"
                        label={loading ? "Actualizando..." : "Actualizar Producto"}
                        icon={mdiTagEdit}
                        disabled={isSubmitting || loading}
                      />
                      <Button
                        type="button"
                        color="info"
                        label="Cancelar"
                        href={`/dashboard/franchise/${rif}/inventory`}
                        outline
                      />
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </CardBox>
        </div>
      </SectionMain>
    </>
  );
} 