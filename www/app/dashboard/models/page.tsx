"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../_components/Button";
import SectionMain from "../../_components/Section/Main";
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton";
import CardBox from "../../_components/CardBox";
import { mdiCar, mdiSearchWeb } from "@mdi/js";
import { Field, Formik } from "formik";
import FormField from "../../_components/FormField";

interface Model {
  CodigoMarca: number;
  NumeroCorrelativoModelo: number;
  DescripcionModelo: string;
  CantidadPuestos: number;
  TipoRefrigerante: string;
  TipoGasolina: string;
  TipoAceite: string;
  Peso: number;
  MarcaNombre?: string;
}

export default function ModelsListPage() {
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState<Model[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener todos los modelos de todas las marcas
        const response = await fetch("http://127.0.0.1:8000/models/all");
        if (response.ok) {
          const data = await response.json();
          setModels(data);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
          m.NumeroCorrelativoModelo.toString().includes(lower) ||
          (m.MarcaNombre && m.MarcaNombre.toLowerCase().includes(lower))
      )
    );
  };

  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiCar} title="Todos los Modelos" main>
        <Formik initialValues={{ search: "" }} onSubmit={() => {}}>
          <FormField label="Buscar" labelFor="search" icon={mdiSearchWeb}>
            {({ className }) => (
              <div className="relative">
                <Field
                  name="search"
                  id="search"
                  placeholder="Buscar modelo o marca..."
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
      </SectionTitleLineWithButton>
      <CardBox className="mb-6" hasTable>
        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead>
              <tr className="bg-gray-100 dark:bg-slate-800">
                <th className="p-3">Marca</th>
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
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-4">Cargando modelos...</td>
                </tr>
              ) : filteredModels.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-4">No hay modelos registrados.</td>
                </tr>
              ) : (
                filteredModels.map((model) => (
                  <tr key={`${model.CodigoMarca}-${model.NumeroCorrelativoModelo}`} className="border-t">
                    <td className="p-3">{model.MarcaNombre || ""}</td>
                    <td className="p-3">{model.NumeroCorrelativoModelo}</td>
                    <td className="p-3">{model.DescripcionModelo}</td>
                    <td className="p-3">{model.CantidadPuestos}</td>
                    <td className="p-3">{model.TipoRefrigerante}</td>
                    <td className="p-3">{model.TipoGasolina}</td>
                    <td className="p-3">{model.TipoAceite}</td>
                    <td className="p-3">{model.Peso}</td>
                    <td className="p-3">
                      <Button
                        label="Ver Detalles Modelo"
                        icon={mdiCar}
                        color="info"
                        small
                        href={`/dashboard/brands/detail/${model.CodigoMarca}/model/${model.NumeroCorrelativoModelo}`}
                      />
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