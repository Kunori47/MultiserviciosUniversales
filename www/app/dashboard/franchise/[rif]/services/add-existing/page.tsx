"use client";

import {
  mdiArrowLeft,
  mdiPlus,
  mdiSearchWeb,
} from "@mdi/js";
import Button from "../../../../../_components/Button";
import CardBox from "../../../../../_components/CardBox";
import SectionMain from "../../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../../_components/Section/TitleLineWithButton";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Field, Formik } from "formik";
import FormField from "../../../../../_components/FormField";

interface Service {
  CodigoServicio: number;
  NombreServicio: string;
}

interface FranchiseService {
  CodigoServicio: number;
  NombreServicio: string;
}

export default function AddExistingServicePage() {
  const params = useParams();
  const router = useRouter();
  const rif = params?.rif as string;
  const [franchise, setFranchise] = useState<any>(null);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [franchiseServices, setFranchiseServices] = useState<FranchiseService[]>([]);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (rif) {
      fetchFranchiseInfo();
      fetchAllServices();
      fetchFranchiseServices();
    }
  }, [rif]);

  useEffect(() => {
    // Filter out services that are already in the franchise
    const franchiseServiceCodes = franchiseServices.map(fs => fs.CodigoServicio);
    const available = allServices.filter(service => 
      !franchiseServiceCodes.includes(service.CodigoServicio)
    );
    setAvailableServices(available);
    setFilteredServices(available);
  }, [allServices, franchiseServices]);

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

  const fetchAllServices = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/service`);
      if (!res.ok) throw new Error("Error cargando servicios");
      const data = await res.json();
      setAllServices(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const fetchFranchiseServices = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/service/franchise/${rif}`);
      if (!res.ok) throw new Error("Error cargando servicios de la franquicia");
      const data = await res.json();
      setFranchiseServices(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchInput(query);
    if (!query) {
      setFilteredServices(availableServices);
      return;
    }
    
    const filtered = availableServices.filter(service =>
      service.NombreServicio.toLowerCase().includes(query.toLowerCase()) ||
      service.CodigoServicio.toString().includes(query)
    );
    setFilteredServices(filtered);
  };

  const handleSubmit = async () => {
    if (!selectedService) {
      alert("Por favor selecciona un servicio");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/franchise_services/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          FranquiciaRIF: rif,
          CodigoServicio: selectedService.CodigoServicio,
        }),
      });

      if (!res.ok) throw new Error("Error al agregar servicio a la franquicia");

      alert("Servicio agregado exitosamente");
      router.push(`/dashboard/franchise/${rif}/services`);
    } catch (err) {
      console.error("Error:", err);
      alert("Error al agregar el servicio a la franquicia");
    } finally {
      setSubmitting(false);
    }
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
          <p className="mt-4 text-gray-600">Cargando servicios disponibles...</p>
        </div>
      </SectionMain>
    );
  }

  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiPlus} title="Agregar Servicio Existente" main>
        <Button
          href={`/dashboard/franchise/${rif}/services`}
          color="info"
          label="Atras"
          icon={mdiArrowLeft}
          roundedFull
        />
      </SectionTitleLineWithButton>

      <CardBox className="mb-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Franquicia: {franchise.Nombre}</h3>
            <p className="text-gray-600">Selecciona un servicio existente para agregar a esta franquicia</p>
          </div>

          <Formik
            initialValues={{
              search: "",
            }}
            onSubmit={() => {}}
          >
            <FormField label="Buscar Servicio" labelFor="search" icon={mdiSearchWeb}>
              {({ className }) => (
                <Field
                  name="search"
                  id="search"
                  placeholder="Buscar por nombre o código..."
                  className={className}
                  value={searchInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleSearch(e.target.value);
                  }}
                />
              )}
            </FormField>
          </Formik>

          <div className="space-y-4">
            <h4 className="font-medium">Servicios Disponibles ({filteredServices.length})</h4>
            
            {filteredServices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {availableServices.length === 0 
                  ? "No hay servicios disponibles para agregar. Todos los servicios ya están en esta franquicia."
                  : "No se encontraron servicios que coincidan con la búsqueda."
                }
              </div>
            ) : (
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {filteredServices.map((service) => (
                  <div
                    key={service.CodigoServicio}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedService?.CodigoServicio === service.CodigoServicio
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedService(service)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">{service.NombreServicio}</h5>
                        <p className="text-sm text-gray-500">Código: #{service.CodigoServicio}</p>
                      </div>
                      {selectedService?.CodigoServicio === service.CodigoServicio && (
                        <div className="text-blue-500">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedService && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Servicio Seleccionado:</h4>
              <p><strong>Nombre:</strong> {selectedService.NombreServicio}</p>
              <p><strong>Código:</strong> #{selectedService.CodigoServicio}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              href={`/dashboard/franchise/${rif}/services`}
              color="contrast"
              label="Cancelar"
            />
            <Button
              label="Agregar Servicio"
              icon={mdiPlus}
              color="success"
              onClick={handleSubmit}
              disabled={!selectedService || submitting}
            />
          </div>
        </div>
      </CardBox>
    </SectionMain>
  );
} 