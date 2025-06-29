"use client";

import {
  mdiWarehouse,
  mdiPlus,
  mdiMagnify,
} from "@mdi/js";
import Button from "../../../../../_components/Button";
import Divider from "../../../../../_components/Divider";
import CardBox from "../../../../../_components/CardBox";
import SectionMain from "../../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../../_components/Section/TitleLineWithButton";
import FormField from "../../../../../_components/FormField";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Field, Formik } from "formik";

export default function CreateProductPage() {
  const params = useParams();
  const rif = params?.rif as string;
  const router = useRouter();
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [franchiseProducts, setFranchiseProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (rif) {
      // Cargar todos los productos disponibles
      fetch("http://127.0.0.1:8000/product")
        .then(res => res.json())
        .then(data => setAllProducts(data))
        .catch(err => console.error("Error cargando productos:", err));

      // Cargar productos ya registrados en esta franquicia
      fetch(`http://127.0.0.1:8000/product_franchise/franchise/${rif}`)
        .then(res => res.json())
        .then(data => {
          const franchiseProductCodes = Array.isArray(data) 
            ? data.map(item => item.CodigoProducto)
            : data ? [data.CodigoProducto] : [];
          setFranchiseProducts(franchiseProductCodes);
        })
        .catch(err => console.error("Error cargando productos de franquicia:", err));
    }
  }, [rif]);

  useEffect(() => {
    // Filtrar productos que no están en la franquicia y que coincidan con la búsqueda
    const availableProducts = allProducts.filter(product => 
      !franchiseProducts.includes(product.CodigoProducto)
    );

    const filtered = availableProducts.filter(product =>
      product.NombreProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.CodigoProducto.toString().includes(searchTerm)
    );

    setFilteredProducts(filtered);
  }, [allProducts, franchiseProducts, searchTerm]);

  const validateForm = (values: any) => {
    const errors: any = {};
    if (!values.CodigoProducto) {
      errors.CodigoProducto = "El código del producto es requerido";
    }
    if (!values.Precio || values.Precio <= 0) {
      errors.Precio = "El precio debe ser positivo";
    }
    if (!values.Cantidad || values.Cantidad < 0) {
      errors.Cantidad = "La cantidad no puede ser negativa";
    }
    if (!values.CantidadMinima || values.CantidadMinima < 0) {
      errors.CantidadMinima = "La cantidad mínima no puede ser negativa";
    }
    if (!values.CantidadMaxima || values.CantidadMaxima < 0) {
      errors.CantidadMaxima = "La cantidad máxima no puede ser negativa";
    }
    return errors;
  };

  const handleSubmit = async (values: any, { setSubmitting, setErrors }: any) => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/product_franchise/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          FranquiciaRIF: rif,
          CodigoProducto: parseInt(values.CodigoProducto),
          Precio: parseFloat(values.Precio),
          Cantidad: parseInt(values.Cantidad),
          CantidadMinima: parseInt(values.CantidadMinima),
          CantidadMaxima: parseInt(values.CantidadMaxima),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al crear el producto");
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

  const handleProductSelect = (productCode: number, productName: string, setFieldValue: any) => {
    setFieldValue("CodigoProducto", productCode);
    setSearchTerm(productName);
    setShowDropdown(false);
  };

  return (
    <>
      <SectionMain>
        <div className="max-w-2xl mx-auto">
          <SectionTitleLineWithButton
            icon={mdiWarehouse}
            title="Agregar Producto al Inventario"
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

          <CardBox className="bg-white shadow-sm border border-gray-200">
            <div className="p-8">
              <Formik
                initialValues={{
                  CodigoProducto: "",
                  Precio: "",
                  Cantidad: "",
                  CantidadMinima: "",
                  CantidadMaxima: "",
                }}
                validate={validateForm}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <FormField label="Producto" labelFor="CodigoProducto" icon={mdiWarehouse}>
                        {({ className }) => (
                          <div className="relative">
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Buscar producto..."
                                className={className}
                                value={searchTerm}
                                onChange={(e) => {
                                  setSearchTerm(e.target.value);
                                  setShowDropdown(true);
                                  if (!e.target.value) {
                                    setFieldValue("CodigoProducto", "");
                                  }
                                }}
                                onFocus={() => setShowDropdown(true)}
                                onBlur={() => {
                                  // Delay para permitir hacer clic en las opciones
                                  setTimeout(() => setShowDropdown(false), 200);
                                }}
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                              </div>
                            </div>
                            
                            {showDropdown && filteredProducts.length > 0 && (
                              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                {filteredProducts.map((product) => (
                                  <div
                                    key={product.CodigoProducto}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                                    onClick={() => handleProductSelect(product.CodigoProducto, product.NombreProducto, setFieldValue)}
                                  >
                                    <div className="font-medium">{product.NombreProducto}</div>
                                    <div className="text-sm text-gray-500">Código: {product.CodigoProducto}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {showDropdown && filteredProducts.length === 0 && searchTerm && (
                              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                                <div className="px-4 py-2 text-gray-500">
                                  No se encontraron productos disponibles
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </FormField>
                      {errors.CodigoProducto && touched.CodigoProducto && (
                        <div className="text-red-500 text-sm">{errors.CodigoProducto as string}</div>
                      )}

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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <FormField label="Cantidad Inicial" labelFor="Cantidad" icon={mdiPlus}>
                        {({ className }) => (
                          <Field
                            type="number"
                            name="Cantidad"
                            id="Cantidad"
                            placeholder="0"
                            min="0"
                            className={className}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.Cantidad}
                          />
                        )}
                      </FormField>
                      {errors.Cantidad && touched.Cantidad && (
                        <div className="text-red-500 text-sm">{errors.Cantidad as string}</div>
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
                        label={loading ? "Creando..." : "Crear Producto"}
                        icon={mdiPlus}
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