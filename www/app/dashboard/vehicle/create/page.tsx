"use client";

import { useRouter } from "next/navigation";
import { Field, Form, Formik } from "formik";
import { useState, useEffect } from "react";
import Button from "../../../_components/Button";
import CardBox from "../../../_components/CardBox";
import Divider from "../../../_components/Divider";
import SectionMain from "../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../_components/Section/TitleLineWithButton";
import { mdiCar, mdiArrowLeft, mdiContentSave } from "@mdi/js";

interface Brand {
  CodigoMarca: number;
  Nombre: string;
}

interface Model {
  CodigoMarca: number;
  NumeroCorrelativoModelo: number;
  DescripcionModelo: string;
  TipoAceite: string;
}

interface Customer {
  CI: string;
  NombreCompleto: string;
}

export default function VehicleCreatePage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch brands
        const brandsRes = await fetch("http://127.0.0.1:8000/brand");
        const brandsData = await brandsRes.json();
        setBrands(brandsData);

        // Fetch customers
        const customersRes = await fetch("http://127.0.0.1:8000/customer");
        const customersData = await customersRes.json();
        setCustomers(customersData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchModelsByBrand = async (codigoMarca: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/brand/${codigoMarca}/models`);
      const data = await res.json();
      setModels(data);
    } catch (error) {
      console.error("Error fetching models:", error);
      setModels([]);
    }
  };

  if (loading) {
    return (
      <SectionMain>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Cargando...</span>
        </div>
      </SectionMain>
    );
  }

  return (
    <SectionMain>
      <SectionTitleLineWithButton
        icon={mdiCar}
        title="Crear Nuevo Vehículo"
        main
      >
        <Button
          href="/dashboard/vehicle"
          color="info"
          label="Atras"
          icon={mdiArrowLeft}
          roundedFull
        />
      </SectionTitleLineWithButton>
      <Divider />
      <CardBox>
        <Formik
          initialValues={{
            CodigoMarca: "",
            NumeroCorrelativoModelo: "",
            Placa: "",
            FechaAdquisicion: "",
            TipoAceite: "",
            CedulaCliente: "",
          }}
          onSubmit={async (values, { resetForm }) => {
            try {
              const res = await fetch(`http://127.0.0.1:8000/vehicle/create?CodigoMarca=${values.CodigoMarca}&NumeroCorrelativoModelo=${values.NumeroCorrelativoModelo}&Placa=${values.Placa}&FechaAdquisicion=${values.FechaAdquisicion}&TipoAceite=${values.TipoAceite}&CedulaCliente=${values.CedulaCliente}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
              });
              if (!res.ok) throw new Error("Error al crear el vehículo");
              alert("Vehículo creado correctamente");
              resetForm();
              router.push("/dashboard/vehicle");
            } catch (err) {
              alert("Error: " + (err instanceof Error ? err.message : err));
            }
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Marca */}
                <div>
                  <label className="block font-bold mb-2">Marca</label>
                  <Field
                    as="select"
                    name="CodigoMarca"
                    id="CodigoMarca"
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
                    required
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setFieldValue('CodigoMarca', e.target.value);
                      setFieldValue('NumeroCorrelativoModelo', '');
                      const brand = brands.find(b => b.CodigoMarca.toString() === e.target.value);
                      setSelectedBrand(brand || null);
                      if (e.target.value) {
                        fetchModelsByBrand(parseInt(e.target.value));
                      } else {
                        setModels([]);
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
                </div>

                {/* Modelo */}
                <div>
                  <label className="block font-bold mb-2">Modelo</label>
                  <Field
                    as="select"
                    name="NumeroCorrelativoModelo"
                    id="NumeroCorrelativoModelo"
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
                    required
                    disabled={!values.CodigoMarca}
                  >
                    <option value="">Seleccionar modelo</option>
                    {models.map((model) => (
                      <option key={model.NumeroCorrelativoModelo} value={model.NumeroCorrelativoModelo}>
                        {model.DescripcionModelo}
                      </option>
                    ))}
                  </Field>
                </div>

                {/* Placa */}
                <div>
                  <label className="block font-bold mb-2">Placa</label>
                  <Field 
                    name="Placa" 
                    id="Placa" 
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2" 
                    required 
                    placeholder="ABC-1234"
                  />
                </div>

                {/* Fecha de Adquisición */}
                <div>
                  <label className="block font-bold mb-2">Fecha de Adquisición</label>
                  <Field 
                    name="FechaAdquisicion" 
                    id="FechaAdquisicion" 
                    type="date" 
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2" 
                    required 
                  />
                </div>

                {/* Tipo de Aceite */}
                <div>
                  <label className="block font-bold mb-2">Tipo de Aceite</label>
                  <Field
                    as="select"
                    name="TipoAceite"
                    id="TipoAceite"
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Seleccionar tipo de aceite</option>
                    <option value="Semisintético">Semisintético</option>
                    <option value="Sintético">Sintético</option>
                    <option value="Mineral">Mineral</option>
                  </Field>
                </div>

                {/* Cliente */}
                <div>
                  <label className="block font-bold mb-2">Cliente</label>
                  <Field
                    as="select"
                    name="CedulaCliente"
                    id="CedulaCliente"
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Seleccionar cliente</option>
                    {customers.map((customer) => (
                      <option key={customer.CI} value={customer.CI}>
                        {customer.CI} - {customer.NombreCompleto}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>

              <Divider />
              <div className="flex gap-2">
                <Button type="submit" color="success" label="Crear Vehículo" icon={mdiContentSave} />
                <Button type="button" color="info" outline label="Cancelar" onClick={() => router.push("/dashboard/vehicle")} />
              </div>
            </Form>
          )}
        </Formik>
      </CardBox>
    </SectionMain>
  );
} 