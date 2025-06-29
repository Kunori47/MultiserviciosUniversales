"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { mdiArrowLeft, mdiCar, mdiPlus } from '@mdi/js';
import Button from '../../../_components/Button';
import SectionMain from '../../../_components/Section/Main';
import SectionTitleLineWithButton from '../../../_components/Section/TitleLineWithButton';
import CardBox from '../../../_components/CardBox';
import FormField from '../../../_components/FormField';
import { Field, Form, Formik } from 'formik';

interface Brand {
  CodigoMarca: number;
  Nombre: string;
}

export default function NewModelPage() {
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const codigoMarca = searchParams.get('marca');

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (codigoMarca && brands.length > 0) {
      const brand = brands.find(b => b.CodigoMarca.toString() === codigoMarca);
      if (brand) {
        setSelectedBrand(brand);
        // Auto-fetch next model number for pre-selected brand
        fetchNextModelNumber(codigoMarca).then(nextNumber => {
          // We need to use setFieldValue from Formik context
          // This will be handled in the form render
        });
      }
    }
  }, [codigoMarca, brands]);

  const fetchBrands = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/brand');
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchNextModelNumber = async (codigoMarca: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/brand/${codigoMarca}/next-model-number`);
      const data = await response.json();
      return data.next_number;
    } catch (error) {
      console.error('Error fetching next model number:', error);
      return 1; // Default to 1 if there's an error
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Validar que haya al menos un plan de mantenimiento
      if (!values.maintenancePlans || values.maintenancePlans.length === 0) {
        alert('Debe agregar al menos un plan de mantenimiento');
        setLoading(false);
        return;
      }

      // Validar que todos los planes tengan los campos requeridos
      for (let i = 0; i < values.maintenancePlans.length; i++) {
        const plan = values.maintenancePlans[i];
        if (!plan.TiempoUso || !plan.Kilometraje || !plan.DescripcionMantenimiento) {
          alert(`El plan de mantenimiento ${i + 1} debe tener todos los campos completos`);
          setLoading(false);
          return;
        }
      }

      // Crear el modelo
      const modelData = {
        CodigoMarca: parseInt(values.CodigoMarca),
        NumeroCorrelativoModelo: parseInt(values.NumeroCorrelativoModelo),
        DescripcionModelo: values.DescripcionModelo,
        CantidadPuestos: parseInt(values.CantidadPuestos),
        TipoRefrigerante: values.TipoRefrigerante,
        TipoGasolina: values.TipoGasolina,
        TipoAceite: values.TipoAceite,
        Peso: parseFloat(values.Peso)
      };

      const modelResponse = await fetch('http://127.0.0.1:8000/model/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modelData),
      });

      if (!modelResponse.ok) {
        throw new Error('Error creating model');
      }

      // Crear los planes de mantenimiento
      for (const plan of values.maintenancePlans) {
        const maintenanceData = {
          TiempoUso: parseInt(plan.TiempoUso),
          Kilometraje: parseInt(plan.Kilometraje),
          DescripcionMantenimiento: plan.DescripcionMantenimiento,
          CodigoMarca: parseInt(values.CodigoMarca),
          NumeroCorrelativoModelo: parseInt(values.NumeroCorrelativoModelo)
        };

        const maintenanceResponse = await fetch('http://127.0.0.1:8000/maintenanceplan/create?TiempoUso=' + maintenanceData.TiempoUso + '&Kilometraje=' + maintenanceData.Kilometraje + '&DescripcionMantenimiento=' + maintenanceData.DescripcionMantenimiento + '&CodigoMarca=' + maintenanceData.CodigoMarca + '&NumeroCorrelativoModelo=' + maintenanceData.NumeroCorrelativoModelo, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(maintenanceData),
        });

        if (!maintenanceResponse.ok) {
          console.warn('Model created but maintenance plan failed');
        }
      }

      alert('Modelo creado correctamente');
      router.push(`/dashboard/brands/detail/${values.CodigoMarca}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear el modelo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiCar} title="Crear Nuevo Modelo" main>
        <Button
          label="Volver"
          icon={mdiArrowLeft}
          color="info"
          href="/dashboard/brands"
        />
      </SectionTitleLineWithButton>

      <CardBox className="w-full max-w-4xl mx-auto">
        <Formik
          initialValues={{
            CodigoMarca: codigoMarca || '',
            NumeroCorrelativoModelo: '',
            DescripcionModelo: '',
            CantidadPuestos: '',
            TipoRefrigerante: '',
            TipoGasolina: '',
            TipoAceite: '',
            Peso: '',
            maintenancePlans: [
              {
                TiempoUso: '',
                Kilometraje: '',
                DescripcionMantenimiento: ''
              }
            ]
          }}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => {
            // Set initial correlative number when brand is pre-selected
            React.useEffect(() => {
              if (codigoMarca && !values.NumeroCorrelativoModelo) {
                fetchNextModelNumber(codigoMarca).then(nextNumber => {
                  setFieldValue('NumeroCorrelativoModelo', nextNumber.toString());
                });
              }
            }, [codigoMarca, values.NumeroCorrelativoModelo, setFieldValue]);

            return (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Información del Modelo */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Información del Modelo</h3>
                    
                    <FormField label="Marca" labelFor="CodigoMarca">
                      {({ className }) => (
                        <Field
                          as="select"
                          name="CodigoMarca"
                          id="CodigoMarca"
                          className={className}
                          required
                          disabled={!!codigoMarca}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            setFieldValue('CodigoMarca', e.target.value);
                            const brand = brands.find(b => b.CodigoMarca.toString() === e.target.value);
                            setSelectedBrand(brand || null);
                            
                            // Auto-fetch next model number when brand is selected
                            if (e.target.value) {
                              fetchNextModelNumber(e.target.value).then(nextNumber => {
                                setFieldValue('NumeroCorrelativoModelo', nextNumber.toString());
                              });
                            }
                          }}
                        >
                          <option value="">Seleccionar marca</option>
                          {brands.map((brand) => (
                            <option key={brand.CodigoMarca} value={brand.CodigoMarca}>
                              {brand.Nombre}
                            </option>
                          ))}
                        </Field>
                      )}
                    </FormField>

                    <FormField label="Número Correlativo del Modelo (Auto-generado)" labelFor="NumeroCorrelativoModelo">
                      {({ className }) => (
                        <Field
                          name="NumeroCorrelativoModelo"
                          id="NumeroCorrelativoModelo"
                          type="number"
                          placeholder="Se generará automáticamente"
                          className={className}
                          required
                          readOnly
                        />
                      )}
                    </FormField>

                    <FormField label="Descripción del Modelo" labelFor="DescripcionModelo">
                      {({ className }) => (
                        <Field
                          name="DescripcionModelo"
                          id="DescripcionModelo"
                          placeholder="Descripción del modelo"
                          className={className}
                          required
                        />
                      )}
                    </FormField>

                    <FormField label="Cantidad de Puestos" labelFor="CantidadPuestos">
                      {({ className }) => (
                        <Field
                          name="CantidadPuestos"
                          id="CantidadPuestos"
                          type="number"
                          placeholder="Número de puestos"
                          className={className}
                          required
                        />
                      )}
                    </FormField>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Especificaciones Técnicas</h3>
                    
                    <FormField label="Tipo de Refrigerante" labelFor="TipoRefrigerante">
                      {({ className }) => (
                        <Field
                          name="TipoRefrigerante"
                          id="TipoRefrigerante"
                          placeholder="Tipo de refrigerante"
                          className={className}
                          required
                        />
                      )}
                    </FormField>

                    <FormField label="Tipo de Gasolina" labelFor="TipoGasolina">
                      {({ className }) => (
                        <Field
                          as="select"
                          name="TipoGasolina"
                          id="TipoGasolina"
                          className={className}
                          required
                        >
                          <option value="">Seleccionar tipo de combustible</option>
                          <option value="Hibrido">Híbrido</option>
                          <option value="Electrico">Eléctrico</option>
                          <option value="Diesel">Diesel</option>
                          <option value="Gasolina">Gasolina</option>
                        </Field>
                      )}
                    </FormField>

                    <FormField label="Tipo de Aceite" labelFor="TipoAceite">
                      {({ className }) => (
                        <Field
                          as="select"
                          name="TipoAceite"
                          id="TipoAceite"
                          className={className}
                          required
                        >
                          <option value="">Seleccionar tipo de aceite</option>
                          <option value="Semisintetico">Semisintético</option>
                          <option value="Mineral">Mineral</option>
                          <option value="Sintetico">Sintético</option>
                        </Field>
                      )}
                    </FormField>

                    <FormField label="Peso (kg)" labelFor="Peso">
                      {({ className }) => (
                        <Field
                          name="Peso"
                          id="Peso"
                          type="number"
                          step="0.01"
                          placeholder="Peso en kilogramos"
                          className={className}
                          required
                        />
                      )}
                    </FormField>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-red-600">Planes de Mantenimiento (Obligatorio)</h3>
                    <p className="text-sm text-gray-600">Debe agregar al menos un plan de mantenimiento para el modelo</p>
                  </div>
                  <div className="space-y-4">
                    {values.maintenancePlans.map((plan: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-4 rounded border">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-md font-semibold">Plan de Mantenimiento {index + 1}</h4>
                          {values.maintenancePlans.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newPlans = values.maintenancePlans.filter((_: any, i: number) => i !== index);
                                setFieldValue('maintenancePlans', newPlans);
                              }}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField label="Tiempo de Uso (horas)" labelFor={`maintenancePlans.${index}.TiempoUso`}>
                            {({ className }) => (
                              <Field
                                name={`maintenancePlans.${index}.TiempoUso`}
                                id={`maintenancePlans.${index}.TiempoUso`}
                                type="number"
                                placeholder="Horas de uso"
                                className={className}
                              />
                            )}
                          </FormField>

                          <FormField label="Kilometraje" labelFor={`maintenancePlans.${index}.Kilometraje`}>
                            {({ className }) => (
                              <Field
                                name={`maintenancePlans.${index}.Kilometraje`}
                                id={`maintenancePlans.${index}.Kilometraje`}
                                type="number"
                                placeholder="Kilómetros"
                                className={className}
                              />
                            )}
                          </FormField>

                          <FormField label="Descripción del Mantenimiento" labelFor={`maintenancePlans.${index}.DescripcionMantenimiento`}>
                            {({ className }) => (
                              <Field
                                name={`maintenancePlans.${index}.DescripcionMantenimiento`}
                                id={`maintenancePlans.${index}.DescripcionMantenimiento`}
                                placeholder="Descripción del mantenimiento"
                                className={className}
                              />
                            )}
                          </FormField>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          const newPlans = [...values.maintenancePlans, {
                            TiempoUso: '',
                            Kilometraje: '',
                            DescripcionMantenimiento: ''
                          }];
                          setFieldValue('maintenancePlans', newPlans);
                        }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        + Agregar Otro Plan de Mantenimiento
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    label={loading ? 'Creando...' : 'Crear Modelo'}
                    icon={mdiPlus}
                    color="success"
                    disabled={loading}
                  />
                </div>
              </Form>
            );
          }}
        </Formik>
      </CardBox>
    </SectionMain>
  );
} 