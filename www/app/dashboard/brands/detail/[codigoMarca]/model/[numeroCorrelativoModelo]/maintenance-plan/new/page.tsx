"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { mdiArrowLeft, mdiWrench, mdiPlus } from '@mdi/js';
import Button from '../../../../../../../../_components/Button';
import SectionMain from '../../../../../../../../_components/Section/Main';
import SectionTitleLineWithButton from '../../../../../../../../_components/Section/TitleLineWithButton';
import CardBox from '../../../../../../../../_components/CardBox';
import FormField from '../../../../../../../../_components/FormField';
import { Field, Form, Formik } from 'formik';

interface Model {
  CodigoMarca: number;
  NumeroCorrelativoModelo: number;
  DescripcionModelo: string;
  CantidadPuestos: number;
  TipoRefrigerante: string;
  TipoGasolina: string;
  TipoAceite: string;
  Peso: number;
}

interface Brand {
  CodigoMarca: number;
  Nombre: string;
}

export default function NewMaintenancePlanPage() {
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<Model | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const router = useRouter();
  const params = useParams();
  const codigoMarca = params?.codigoMarca;
  const numeroCorrelativoModelo = params?.numeroCorrelativoModelo;

  useEffect(() => {
    if (!codigoMarca || !numeroCorrelativoModelo) return;
    
    const fetchData = async () => {
      try {
        // Fetch brand info
        const brandResponse = await fetch(`http://127.0.0.1:8000/brand/${codigoMarca}`);
        if (brandResponse.ok) {
          const brandData = await brandResponse.json();
          setBrand(brandData);
        }

        // Fetch model info
        const modelResponse = await fetch(`http://127.0.0.1:8000/model/${codigoMarca}/${numeroCorrelativoModelo}`);
        if (modelResponse.ok) {
          const modelData = await modelResponse.json();
          setModel(modelData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [codigoMarca, numeroCorrelativoModelo]);

  const handleSubmit = async (values: any) => {
    if (!model) return;
    
    setLoading(true);
    try {
      const maintenanceData = {
        TiempoUso: parseInt(values.TiempoUso),
        Kilometraje: parseInt(values.Kilometraje),
        DescripcionMantenimiento: values.DescripcionMantenimiento,
        CodigoMarca: model.CodigoMarca,
        NumeroCorrelativoModelo: model.NumeroCorrelativoModelo
      };

      const response = await fetch('http://127.0.0.1:8000/maintenanceplan/create?TiempoUso=' + maintenanceData.TiempoUso + '&Kilometraje=' + maintenanceData.Kilometraje + '&DescripcionMantenimiento=' + maintenanceData.DescripcionMantenimiento + '&CodigoMarca=' + maintenanceData.CodigoMarca + '&NumeroCorrelativoModelo=' + maintenanceData.NumeroCorrelativoModelo, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maintenanceData),
      });

      if (!response.ok) {
        throw new Error('Error creating maintenance plan');
      }

      alert('Plan de mantenimiento creado correctamente');
      router.push(`/dashboard/brands/detail/${codigoMarca}/model/${numeroCorrelativoModelo}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear el plan de mantenimiento');
    } finally {
      setLoading(false);
    }
  };

  if (!model || !brand) {
    return (
      <SectionMain>
        <div className="flex justify-center items-center min-h-[60vh]">
          Cargando...
        </div>
      </SectionMain>
    );
  }

  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiWrench} title="Crear Nuevo Plan de Mantenimiento" main>
        <Button
          label="Volver"
          icon={mdiArrowLeft}
          color="info"
          href={`/dashboard/brands/detail/${codigoMarca}/model/${numeroCorrelativoModelo}`}
        />
      </SectionTitleLineWithButton>

      <CardBox className="w-full max-w-2xl mx-auto">
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Información del Modelo</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Marca:</span> {brand.Nombre}
            </div>
            <div>
              <span className="font-medium">Modelo:</span> {model.NumeroCorrelativoModelo}
            </div>
            <div>
              <span className="font-medium">Descripción:</span> {model.DescripcionModelo}
            </div>
            <div>
              <span className="font-medium">Puestos:</span> {model.CantidadPuestos}
            </div>
          </div>
        </div>

        <Formik
          initialValues={{
            TiempoUso: '',
            Kilometraje: '',
            DescripcionMantenimiento: ''
          }}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Tiempo de Uso (horas)" labelFor="TiempoUso">
                  {({ className }) => (
                    <Field
                      name="TiempoUso"
                      id="TiempoUso"
                      type="number"
                      placeholder="Ej: 1000, 2000..."
                      className={className}
                      required
                    />
                  )}
                </FormField>

                <FormField label="Kilometraje (km)" labelFor="Kilometraje">
                  {({ className }) => (
                    <Field
                      name="Kilometraje"
                      id="Kilometraje"
                      type="number"
                      placeholder="Ej: 5000, 10000..."
                      className={className}
                      required
                    />
                  )}
                </FormField>
              </div>

              <FormField label="Descripción del Mantenimiento" labelFor="DescripcionMantenimiento">
                {({ className }) => (
                  <Field
                    name="DescripcionMantenimiento"
                    id="DescripcionMantenimiento"
                    as="textarea"
                    rows={4}
                    placeholder="Describa las actividades de mantenimiento que se deben realizar..."
                    className={className}
                    required
                  />
                )}
              </FormField>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  label={loading ? 'Creando...' : 'Crear Plan de Mantenimiento'}
                  icon={mdiPlus}
                  color="success"
                  disabled={loading}
                />
              </div>
            </Form>
          )}
        </Formik>
      </CardBox>
    </SectionMain>
  );
} 