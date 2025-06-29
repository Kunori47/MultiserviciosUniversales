"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { mdiArrowLeft, mdiCar, mdiTableBorder, mdiDelete, mdiPlus, mdiSearchWeb } from '@mdi/js';
import Button from '../../../../_components/Button';
import SectionMain from '../../../../_components/Section/Main';
import SectionTitleLineWithButton from '../../../../_components/Section/TitleLineWithButton';
import CardBox from '../../../../_components/CardBox';
import { Field, Formik } from 'formik';
import FormField from '../../../../_components/FormField';

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

export default function BrandDetailPage() {
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState<Model[]>([]);
  const [brand, setBrand] = useState<Brand | null>(null);
  const router = useRouter();
  const params = useParams();
  const codigoMarca = params?.codigoMarca;
  const [searchInput, setSearchInput] = useState("");
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);

  useEffect(() => {
    if (!codigoMarca) return;
    
    const fetchData = async () => {
      try {
        // Fetch brand info
        const brandResponse = await fetch(`http://127.0.0.1:8000/brand/${codigoMarca}`);
        if (brandResponse.ok) {
          const brandData = await brandResponse.json();
          setBrand(brandData);
        }

        // Fetch models for this brand
        const modelsResponse = await fetch(`http://127.0.0.1:8000/brand/${codigoMarca}/models`);
        if (modelsResponse.ok) {
          const modelsData = await modelsResponse.json();
          setModels(modelsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [codigoMarca]);

  useEffect(() => {
    setFilteredModels(models);
  }, [models]);

  const handleModelSearch = (query: string) => {
    setSearchInput(query);
    if (!query) {
      setFilteredModels(models);
      return;
    }
    const lower = query.toLowerCase();
    setFilteredModels(
      models.filter(
        (m) =>
          m.DescripcionModelo.toLowerCase().includes(lower) ||
          m.NumeroCorrelativoModelo.toString().includes(lower)
      )
    );
  };

  const handleDeleteModel = async (CodigoMarca: number, NumeroCorrelativoModelo: number) => {
    if (!confirm('¿Eliminar este modelo?')) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/model/delete?CodigoMarca=${CodigoMarca}&NumeroCorrelativoModelo=${NumeroCorrelativoModelo}`, { 
        method: 'DELETE' 
      });
      
      if (response.ok) {
        setModels(models.filter(m => !(m.CodigoMarca === CodigoMarca && m.NumeroCorrelativoModelo === NumeroCorrelativoModelo)));
        alert('Modelo eliminado correctamente');
      } else {
        const errorData = await response.json();
        alert('Error al eliminar el modelo: ' + (errorData.detail || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error deleting model:', error);
      alert('Error al eliminar el modelo');
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
      <SectionTitleLineWithButton icon={mdiCar} title={`Modelos de ${brand.Nombre}`} main>
        <Formik initialValues={{ search: "" }} onSubmit={() => {}}>
          <FormField label="Buscar" labelFor="search" icon={mdiSearchWeb}>
            {({ className }) => (
              <div className="relative">
                <Field
                  name="search"
                  id="search"
                  placeholder="Buscar modelo..."
                  className={className}
                  required
                  autoComplete="off"
                  value={searchInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleModelSearch(e.target.value)}
                />
              </div>
            )}
          </FormField>
        </Formik>
        <Button
          label="Agregar Modelo"
          icon={mdiPlus}
          color="info"
          href={`/dashboard/brands/new?marca=${codigoMarca}`}
        />
        <Button
          label="Volver"
          icon={mdiArrowLeft}
          color="info"
          href="/dashboard/brands"
        />
      </SectionTitleLineWithButton>

      <CardBox className="mb-6" hasTable>
        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead>
              <tr className="bg-gray-100 dark:bg-slate-800">
                <th className="p-3">Número Modelo</th>
                <th className="p-3">Descripción</th>
                <th className="p-3">Puestos</th>
                <th className="p-3">Refrigerante</th>
                <th className="p-3">Gasolina</th>
                <th className="p-3">Aceite</th>
                <th className="p-3">Peso (kg)</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredModels.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-4">No hay modelos registrados para esta marca.</td>
                </tr>
              ) : (
                filteredModels.map((model) => (
                  <tr key={`${model.CodigoMarca}-${model.NumeroCorrelativoModelo}`} className="border-t">
                    <td className="p-3">{model.NumeroCorrelativoModelo}</td>
                    <td className="p-3">{model.DescripcionModelo}</td>
                    <td className="p-3">{model.CantidadPuestos}</td>
                    <td className="p-3">{model.TipoRefrigerante}</td>
                    <td className="p-3">{model.TipoGasolina}</td>
                    <td className="p-3">{model.TipoAceite}</td>
                    <td className="p-3">{model.Peso}</td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button
                          label="Ver Detalle"
                          icon={mdiCar}
                          color="info"
                          small
                          href={`/dashboard/brands/detail/${model.CodigoMarca}/model/${model.NumeroCorrelativoModelo}`}
                        />
                        <Button
                          label="Eliminar"
                          icon={mdiDelete}
                          color="danger"
                          small
                          onClick={() => handleDeleteModel(model.CodigoMarca, model.NumeroCorrelativoModelo)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardBox>
    </SectionMain>
  );
} 