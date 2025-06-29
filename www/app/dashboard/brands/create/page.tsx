"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mdiArrowLeft } from '@mdi/js';
import Button from '../../../_components/Button';
import SectionMain from '../../../_components/Section/Main';
import SectionTitleLineWithButton from '../../../_components/Section/TitleLineWithButton';
import CardBox from '../../../_components/CardBox';
import FormField from '../../../_components/FormField';
import { Field, Form, Formik } from 'formik';

export default function CreateBrandPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: { Nombre: string }) => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/brand/create?Marca=' + values.Nombre, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      
      if (response.ok) {
        router.push('/dashboard/brands');
      } else {
        console.error('Error creating brand');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiArrowLeft} title="Crear Marca" main>
        <Button
          label="Volver"
          icon={mdiArrowLeft}
          color="info"
          href="/dashboard/brands"
        />
      </SectionTitleLineWithButton>

      <CardBox className="w-full max-w-md mx-auto">
        <Formik
          initialValues={{
            Nombre: '',
          }}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-6">
            <FormField label="Nombre de la Marca" labelFor="Nombre">
              {({ className }) => (
                <Field
                  name="Nombre"
                  id="Nombre"
                  placeholder="Ingrese el nombre de la marca"
                  className={className}
                  required
                />
              )}
            </FormField>

            <div className="flex justify-end">
              <Button
                type="submit"
                label={loading ? 'Creando...' : 'Crear Marca'}
                color="success"
                disabled={loading}
              />
            </div>
          </Form>
        </Formik>
      </CardBox>
    </SectionMain>
  );
} 