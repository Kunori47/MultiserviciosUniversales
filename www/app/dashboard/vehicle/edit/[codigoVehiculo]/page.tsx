"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Field, Form, Formik } from "formik";
import Button from "../../../../_components/Button";
import CardBox from "../../../../_components/CardBox";
import Divider from "../../../../_components/Divider";
import SectionMain from "../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../_components/Section/TitleLineWithButton";
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

export default function VehicleEditPage() {
  const router = useRouter();
  const params = useParams();
  const codigoVehiculo = params?.codigoVehiculo as string;
  const [vehicle, setVehicle] = useState<any>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!codigoVehiculo) return;
    
    const fetchData = async () => {
      try {
        // Fetch vehicle data
        const vehicleRes = await fetch(`http://127.0.0.1:8000/vehicle/${codigoVehiculo}`);
        const vehicleData = await vehicleRes.json();
        setVehicle(vehicleData);

        // Fetch brands
        const brandsRes = await fetch("http://127.0.0.1:8000/brand");
        const brandsData = await brandsRes.json();
        setBrands(brandsData);

        // Fetch customers
        const customersRes = await fetch("http://127.0.0.1:8000/customer");
        const customersData = await customersRes.json();
        setCustomers(customersData);

        // Fetch models for the vehicle's brand
        if (vehicleData.CodigoMarca) {
          const modelsRes = await fetch(`http://127.0.0.1:8000/brand/${vehicleData.CodigoMarca}/models`);
          const modelsData = await modelsRes.json();
          setModels(modelsData);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [codigoVehiculo]);

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

  const validatePlate = (plate: string) => {
    // Placa venezolana: 7 caracteres, puede ser ABC-123, ABC12D, etc.
    // Aceptar solo letras y números y guion opcional en la posición 4
    if (!plate) return true;
    // Quitar guion para validar longitud
    const clean = plate.replace(/-/g, "");
    if (clean.length !== 7) return false;
    // Validar formato: solo letras y números
    if (!/^[A-Za-z0-9]+$/.test(clean)) return false;
    // Si hay guion, debe estar en la posición 4
    if (plate.includes("-") && plate.indexOf("-") !== 3) return false;
    return true;
  };

  if (loading || !vehicle) {
    return (
      <SectionMain>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Cargando vehículo...</span>
        </div>
      </SectionMain>
    );
  }

  return (
    <SectionMain>
      <SectionTitleLineWithButton
        icon={mdiCar}
        title={`Editar Vehículo: ${vehicle.Placa}`}
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
          enableReinitialize
          initialValues={{
            CodigoVehiculo: vehicle.CodigoVehiculo,
            CodigoMarca: vehicle.CodigoMarca.toString(),
            NumeroCorrelativoModelo: vehicle.NumeroCorrelativoModelo.toString(),
            Placa: vehicle.Placa,
            FechaAdquisicion: vehicle.FechaAdquisicion,
            TipoAceite: vehicle.TipoAceite,
            CedulaCliente: vehicle.CedulaCliente,
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              if (!validatePlate(values.Placa)) {
                alert("La placa debe tener 7 caracteres alfanuméricos (ej: ABC123D)");
                setSubmitting(false);
                return;
              }
              const res = await fetch(`http://127.0.0.1:8000/vehicle/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...values,
                  CodigoVehiculo: parseInt(values.CodigoVehiculo),
                  CodigoMarca: parseInt(values.CodigoMarca),
                  NumeroCorrelativoModelo: parseInt(values.NumeroCorrelativoModelo),
                }),
              });
              if (!res.ok) throw new Error("Error al actualizar el vehículo");
              alert("Vehículo actualizado correctamente");
              router.push("/dashboard/vehicle");
            } catch (err) {
              alert("Error: " + (err instanceof Error ? err.message : err));
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Código del Vehículo (solo lectura) */}
                <div>
                  <label className="block font-bold mb-2">Código del Vehículo</label>
                  <Field 
                    name="CodigoVehiculo" 
                    id="CodigoVehiculo" 
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-gray-100" 
                    disabled 
                  />
                </div>

                {/* Placa */}
                <div>
                  <label className="block font-bold mb-2">Placa</label>
                  <Field 
                    name="Placa" 
                    id="Placa" 
                    className={`w-full border-2 rounded-lg px-3 py-2 ${!validatePlate(values.Placa) && values.Placa ? 'border-red-500' : 'border-gray-300'}`}
                    required 
                    placeholder="ABC123D"
                  />
                  {values.Placa && !validatePlate(values.Placa) && (
                    <p className="text-red-500 text-xs mt-1">La placa debe tener 7 caracteres alfanuméricos (ej: ABC123D)</p>
                  )}
                </div>

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
                <Button type="submit" color="success" label="Guardar Cambios" icon={mdiContentSave} />
                <Button type="button" color="info" outline label="Cancelar" onClick={() => router.push("/dashboard/vehicle")} />
              </div>
            </Form>
          )}
        </Formik>
      </CardBox>
    </SectionMain>
  );
} 