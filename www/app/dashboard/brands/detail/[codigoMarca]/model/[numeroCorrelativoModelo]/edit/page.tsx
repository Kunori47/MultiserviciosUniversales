"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { mdiArrowLeft, mdiCar, mdiContentSave } from '@mdi/js';
import Button from '../../../../../../../_components/Button';
import SectionMain from '../../../../../../../_components/Section/Main';
import SectionTitleLineWithButton from '../../../../../../../_components/Section/TitleLineWithButton';
import CardBox from '../../../../../../../_components/CardBox';
import FormField from '../../../../../../../_components/FormField';
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

export default function EditModelPage() {
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
      const updateData = {
        CodigoMarca: model.CodigoMarca,
        NumeroCorrelativoModelo: model.NumeroCorrelativoModelo,
        DescripcionModelo: values.DescripcionModelo,
        CantidadPuestos: parseInt(values.CantidadPuestos),
        TipoRefrigerante: values.TipoRefrigerante,
        TipoGasolina: values.TipoGasolina,
        TipoAceite: values.TipoAceite,
        Peso: parseFloat(values.Peso)
      };
      const response = await fetch('http://127.0.0.1:8000/model/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        throw new Error('Error updating model');
      }
      alert('Modelo actualizado correctamente');
      router.push(`/dashboard/brands/detail/${codigoMarca}/model/${numeroCorrelativoModelo}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el modelo');
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
      <SectionTitleLineWithButton icon={mdiCar} title="Editar Modelo" main>
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
              <span className="font-medium">Número Modelo:</span> {model.NumeroCorrelativoModelo}
            </div>
          </div>
        </div>

        <Formik
          initialValues={{
            DescripcionModelo: model.DescripcionModelo,
            CantidadPuestos: model.CantidadPuestos.toString(),
            TipoRefrigerante: model.TipoRefrigerante,
            TipoGasolina: model.TipoGasolina,
            TipoAceite: model.TipoAceite,
            Peso: model.Peso.toString()
          }}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form className="space-y-6">
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

              <div className="flex justify-end">
                <Button
                  type="submit"
                  label={loading ? 'Guardando...' : 'Guardar Cambios'}
                  icon={mdiContentSave}
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