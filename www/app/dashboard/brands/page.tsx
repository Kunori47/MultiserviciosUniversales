"use client"

import React, { useState, useEffect } from 'react';
import { mdiCar, mdiPlus, mdiSearchWeb, mdiTableBorder, mdiPencil, mdiDelete, mdiEye, mdiTagEdit } from '@mdi/js';
import Button from '../../_components/Button';
import CardBox from '../../_components/CardBox';
import SectionMain from '../../_components/Section/Main';
import SectionTitleLineWithButton from '../../_components/Section/TitleLineWithButton';
import FormField from '../../_components/FormField';
import { Field, Formik } from 'formik';

interface Brand {
  CodigoMarca: number;
  Nombre: string;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/brand');
      const data = await response.json();
      setBrands(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching brands:', error);
      setLoading(false);
    }
  };

  const fetchBrandSuggestions = async (query: string) => {
    if (!query) {
      setSearchSuggestions([]);
      await fetchBrands();
      return;
    }
    try {
      const res = await fetch(`http://127.0.0.1:8000/brand/search?q=${query}`);
      if (!res.ok) {
        throw new Error("Error en la respuesta del backend");
      }
      const data = await res.json();
      setSearchSuggestions(data);
      setBrands(data);
    } catch (err) {
      console.error("Error buscando sugerencias de marcas:", err);
      setSearchSuggestions([]);
    }
  };

  const handleDeleteBrand = async (CodigoMarca: number) => {
    if (!confirm('¿Eliminar esta marca?')) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/brand/delete?CodigoMarca=${CodigoMarca}`, { 
        method: 'DELETE' 
      });
      
      if (response.ok) {
        setBrands(brands.filter(b => b.CodigoMarca !== CodigoMarca));
        alert('Marca eliminada correctamente');
      } else {
        const errorData = await response.json();
        if (response.status === 400 && errorData.detail && errorData.detail.includes('modelos asociados')) {
          alert('No se puede eliminar esta marca porque tiene modelos asociados. Elimine primero todos los modelos de esta marca.');
        } else {
          alert('Error al eliminar la marca: ' + (errorData.detail || 'Error desconocido'));
        }
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
      alert('Error al eliminar la marca');
    }
  };

  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiTableBorder} title="Marcas" main>
        <Formik
          initialValues={{
            search: "",
          }}
          onSubmit={() => {}}>
          <FormField label="Buscar" labelFor="search" icon={mdiSearchWeb}>
            {({ className }) => (
              <div className="relative">
                <Field
                  name="search"
                  id="search"
                  placeholder="Buscar marca..."
                  className={className}
                  required
                  autoComplete="off"
                  value={searchInput}
                  onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchInput(e.target.value);
                    await fetchBrandSuggestions(e.target.value);
                  }}
                />
                {searchSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-auto">
                    {searchSuggestions.map((brand) => (
                      <li
                        key={brand.CodigoMarca}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                          setSearchInput(brand.Nombre);
                          setSearchSuggestions([]);
                        }}
                      >
                        {brand.Nombre}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </FormField>
        </Formik>
        
        <Button
          label="Crear Marca"
          icon={mdiPlus}
          color="info"
          href="/dashboard/brands/create"
        />
      </SectionTitleLineWithButton>

      <CardBox className="mb-6" hasTable>
        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead>
              <tr className="bg-gray-100 dark:bg-slate-800">
                <th className="p-3">Código</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-4">Cargando...</td>
                </tr>
              ) : brands.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4">No hay marcas registradas.</td>
                </tr>
              ) : (
                brands.map((brand) => (
                  <tr key={brand.CodigoMarca} className="border-t">
                    <td className="p-3">{brand.CodigoMarca}</td>
                    <td className="p-3">{brand.Nombre}</td>
                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <Button
                            icon={mdiEye}
                            color="info"
                            small
                            href={`/dashboard/brands/detail/${brand.CodigoMarca}`}
                            />
                        <Button
                          icon={mdiTagEdit}
                          color="contrast"
                          small
                          href={`/dashboard/brands/edit/${brand.CodigoMarca}`}
                        />
                        <Button
                          icon={mdiDelete}
                          color="danger"
                          small
                          onClick={() => handleDeleteBrand(brand.CodigoMarca)}
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