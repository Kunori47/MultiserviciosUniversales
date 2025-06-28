"use client"

import {
  mdiAccount,
  mdiPlus,
  mdiSearchWeb,
  mdiTableBorder,
} from "@mdi/js";
import Button from "../../../_components/Button";
import Buttons from "../../../_components/Buttons";
import CardBox from "../../../_components/CardBox";
import SectionMain from "../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../_components/Section/TitleLineWithButton";
import { getPageTitle } from "../../../_lib/config";
import { fetchBrands, fetchModels } from "../../_lib/db";
import { Metadata } from "next";
import TableBrand from "./table/Brand";
import TableModel from "./table/Model";
import { useState, useEffect} from "react";
import FormField from "../../../_components/FormField";
import { Field, Formik } from "formik";


export default function BrandsModelsPage() {

  const [ brands, setBrands] = useState([]);
  const [ models, setModels] = useState([]);
  const [ brandInput, setBrandInput] = useState("");
  const [ modelInput, setModelInput] = useState("");
  const [ brandSuggestions, setBrandSuggestions] = useState<any[]>([]);
  const [ modelSuggestions, setModelSuggestions] = useState<any[]>([]);
  const [ activeTab, setActiveTab] = useState<'brands' | 'models'>('brands');
  
  useEffect(() => {
      fetchBrands().then(data => setBrands(data));
      fetchModels().then(data => setModels(data));
  }, []);

    // Función para buscar sugerencias de Marcas
  const fetchBrandSuggestions = async (query: string) => {
      if (!query) {
        setBrandSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`http://127.0.0.1:8000/brand/search?q=${query}`);
        if (!res.ok) {
          throw new Error("Error en la respuesta del backend");
        }
        const data = await res.json();
        setBrandSuggestions(data);
        setBrands(data);
      } catch (err) {
        console.error("Error buscando sugerencias de marcas:", err);
        setBrandSuggestions([]);
      }
  };

    // Función para buscar sugerencias de Modelos
  const fetchModelSuggestions = async (query: string) => {
      if (!query) {
        setModelSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`http://127.0.0.1:8000/model/search?q=${query}`);
        if (!res.ok) {
          throw new Error("Error en la respuesta del backend");
        }
        const data = await res.json();
        setModelSuggestions(data);
        setModels(data);
      } catch (err) {
        console.error("Error buscando sugerencias de modelos:", err);
        setModelSuggestions([]);
      }
  };


  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiTableBorder} title="Marcas y Modelos" main>
        {activeTab === 'brands' ? (
          <Formik
            initialValues={{
                Nombre: "",
              }}
              onSubmit={() => {}}>
            <FormField label="Buscar" labelFor="Nombre" icon={mdiSearchWeb}>
                      {({ className }) => (
                        <div className="relative">
                          <Field
                            name="Nombre"
                            id="Nombre"
                            placeholder="Nombre de la marca"
                            className={className}
                            required
                            autoComplete="off"
                            value={brandInput}
                            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                              setBrandInput(e.target.value);
                              await fetchBrandSuggestions(e.target.value);
                            }}
                          />
                          {brandSuggestions.length > 0 && (
                            <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-auto">
                              {brandSuggestions.map((item) => (
                                <li
                                  key={item.CodigoMarca}
                                  className="p-2 hover:bg-gray-200 cursor-pointer"
                                  onClick={() => {
                                    setBrandInput(item.Nombre);
                                    setBrandSuggestions([]);
                                  }}
                                >
                                  {item.Nombre}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
            </FormField>
          </Formik>
        ) : (
          <Formik
            initialValues={{
                DescripcionModelo: "",
              }}
              onSubmit={() => {}}>
            <FormField label="Buscar" labelFor="DescripcionModelo" icon={mdiSearchWeb}>
                      {({ className }) => (
                        <div className="relative">
                          <Field
                            name="DescripcionModelo"
                            id="DescripcionModelo"
                            placeholder="Descripción del modelo"
                            className={className}
                            required
                            autoComplete="off"
                            value={modelInput}
                            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                              setModelInput(e.target.value);
                              await fetchModelSuggestions(e.target.value);
                            }}
                          />
                          {modelSuggestions.length > 0 && (
                            <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-auto">
                              {modelSuggestions.map((item) => (
                                <li
                                  key={`${item.CodigoMarca}-${item.NumeroCorrelativoModelo}`}
                                  className="p-2 hover:bg-gray-200 cursor-pointer"
                                  onClick={() => {
                                    setModelInput(item.DescripcionModelo);
                                    setModelSuggestions([]);
                                  }}
                                >
                                  {item.DescripcionModelo}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
            </FormField>
          </Formik>
        )}
        
        <Button
            label={"Agregar"}
            icon={mdiPlus}
            color="info"
            href={activeTab === 'brands' ? "/dashboard/brands-models/create/brand" : "/dashboard/brands-models/create/model"}>
        </Button>
      </SectionTitleLineWithButton>

      <div className="mb-6">
        <Buttons>
          <Button
            label="Marcas"
            color={activeTab === 'brands' ? 'info' : 'lightDark'}
            onClick={() => setActiveTab('brands')}
            isGrouped
          />
          <Button
            label="Modelos"
            color={activeTab === 'models' ? 'info' : 'lightDark'}
            onClick={() => setActiveTab('models')}
            isGrouped
          />
        </Buttons>
      </div>

      {activeTab === 'brands' && (
        <CardBox className="mb-6" hasTable>
          <TableBrand brands={brands} />
        </CardBox>
      )}

      {activeTab === 'models' && (
        <CardBox className="mb-6" hasTable>
          <TableModel models={models} />
        </CardBox>
      )}
      
    </SectionMain>
  );
} 