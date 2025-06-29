"use client";

import {
  mdiWrench,
  mdiInformation,
  mdiPlus,
  mdiSearchWeb,
  mdiPlusCircle,
  mdiLink,
} from "@mdi/js";
import Button from "../../../../_components/Button";
import CardBox from "../../../../_components/CardBox";
import CardBoxModal from "../../../../_components/CardBox/Modal";
import SectionMain from "../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../_components/Section/TitleLineWithButton";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Field, Formik } from "formik";
import FormField from "../../../../_components/FormField";
import TableServices from "./table/Services";

interface Service {
  CodigoServicio: number;
  NombreServicio: string;
}

export default function FranchiseServicesPage() {
  const params = useParams();
  const router = useRouter();
  const rif = params?.rif as string;
  const [franchise, setFranchise] = useState<any>(null);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalActive, setIsModalActive] = useState(false);

  useEffect(() => {
    if (rif) {
      fetchFranchiseInfo();
      fetchServices();
    }
  }, [rif]);

  const fetchFranchiseInfo = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/franchise/${rif}`);
      if (!res.ok) throw new Error("Error cargando información de la franquicia");
      const data = await res.json();
      setFranchise(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/service/franchise/${rif}`);
      if (!res.ok) throw new Error("Error cargando servicios");
      const data = await res.json();
      setAllServices(data);
      setFilteredServices(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchSuggestions = async (query: string) => {
    if (!query) {
      setSearchSuggestions([]);
      setFilteredServices(allServices);
      return;
    }
    try {
      const filtered = allServices.filter(service =>
        service.NombreServicio.toLowerCase().includes(query.toLowerCase()) ||
        service.CodigoServicio.toString().includes(query)
      );
      setSearchSuggestions(filtered);
      setFilteredServices(filtered);
    } catch (err) {
      console.error("Error buscando servicios:", err);
      setSearchSuggestions([]);
    }
  };

  const handleCreateNewService = () => {
    setIsModalActive(false);
    router.push(`/dashboard/franchise/${rif}/services/create`);
  };

  const handleAddExistingService = () => {
    setIsModalActive(false);
    router.push(`/dashboard/franchise/${rif}/services/add-existing`);
  };

  if (!franchise) {
    return (
      <SectionMain>
        <div className="text-center">
          <p>Cargando información de la franquicia...</p>
        </div>
      </SectionMain>
    );
  }

  if (loading) {
    return (
      <SectionMain>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando servicios...</p>
        </div>
      </SectionMain>
    );
  }

  return (
    <SectionMain>
      <CardBoxModal
        title="Agregar Servicio"
        buttonColor="info"
        buttonLabel="Cancelar"
        isActive={isModalActive}
        onConfirm={() => setIsModalActive(false)}
        onCancel={() => setIsModalActive(false)}
      >
        <div className="space-y-4">
          <p className="text-gray-600 mb-4">
            ¿Qué tipo de servicio deseas agregar a la franquicia?
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              label="Crear Nuevo Servicio"
              icon={mdiPlusCircle}
              color="success"
              onClick={handleCreateNewService}
              className="h-24 flex flex-col items-center justify-center"
            />
            
            <Button
              label="Agregar Servicio Existente"
              icon={mdiLink}
              color="info"
              onClick={handleAddExistingService}
              className="h-24 flex flex-col items-center justify-center"
            />
          </div>
          
          <div className="text-sm text-gray-500 mt-4">
            <p><strong>Crear Nuevo Servicio:</strong> Crea un servicio completamente nuevo en el sistema.</p>
            <p><strong>Agregar Servicio Existente:</strong> Asocia un servicio ya existente a esta franquicia.</p>
          </div>
        </div>
      </CardBoxModal>

      <SectionTitleLineWithButton icon={mdiWrench} title="Servicios" main>
        <Formik
          initialValues={{
            search: "",
          }}
          onSubmit={() => {}}
        >
          <FormField label="Buscar" labelFor="search" icon={mdiSearchWeb}>
            {({ className }) => (
              <div className="relative">
                <Field
                  name="search"
                  id="search"
                  placeholder="Buscar por nombre o código..."
                  className={className}
                  required
                  autoComplete="off"
                  value={searchInput}
                  onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchInput(e.target.value);
                    await fetchSearchSuggestions(e.target.value);
                  }}
                />
                {searchSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-auto">
                    {searchSuggestions.map((service) => (
                      <li
                        key={service.CodigoServicio}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                          setSearchInput(service.NombreServicio);
                          setSearchSuggestions([]);
                        }}
                      >
                        {service.NombreServicio} - #{service.CodigoServicio}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </FormField>
        </Formik>
        
        <Button
          label="Agregar Servicio"
          icon={mdiPlus}
          color="info"
          onClick={() => setIsModalActive(true)}
        />

        <Button
          href={`/dashboard/franchise/${rif}`}
          color="info"
          label="Atras"
          roundedFull
        />
      </SectionTitleLineWithButton>

      <CardBox className="mb-6" hasTable>
        <TableServices services={filteredServices} rif={rif} onDelete={fetchServices} />
      </CardBox>
    </SectionMain>
  );
} 