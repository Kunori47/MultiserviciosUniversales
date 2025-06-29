"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { mdiArrowLeft } from '@mdi/js';
import Button from '../../../../_components/Button';
import SectionMain from '../../../../_components/Section/Main';
import SectionTitleLineWithButton from '../../../../_components/Section/TitleLineWithButton';
import CardBox from '../../../../_components/CardBox';
import FormField from '../../../../_components/FormField';
import { Field, Form, Formik } from 'formik';

interface Brand {
  CodigoMarca: number;
  Nombre: string;
}

export default function EditBrandPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [brand, setBrand] = useState<Brand | null>(null);
  const router = useRouter();
  const params = useParams();
  const codigoMarca = params?.codigoMarca;

  useEffect(() => {
    if (!codigoMarca) return;
    
    const fetchBrand = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/brand/${codigoMarca}`);
        if (response.ok) {
          const data = await response.json();
          setBrand(data);
        }
      } catch (error) {
        console.error('Error fetching brand:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [codigoMarca]);

  const handleSubmit = async (values: { Nombre: string }) => {
    setSaving(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/brand/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          CodigoMarca: Number(codigoMarca), 
          Nombre: values.Nombre 
        }),
      });
      
      if (response.ok) {
        router.push('/dashboard/brands');
      } else {
        console.error('Error updating brand');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SectionMain>
        <div className="flex justify-center items-center min-h-[60vh]">
          Cargando...
        </div>
      </SectionMain>
    );
  }

  if (!brand) {
    return (
      <SectionMain>
        <div className="flex justify-center items-center min-h-[60vh]">
          Marca no encontrada
        </div>
      </SectionMain>
    );
  }

  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiArrowLeft} title="Editar Marca" main>
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
            Nombre: brand.Nombre,
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
                label={saving ? 'Guardando...' : 'Guardar Cambios'}
                color="success"
                disabled={saving}
              />
            </div>
          </Form>
        </Formik>
      </CardBox>
    </SectionMain>
  );
} 