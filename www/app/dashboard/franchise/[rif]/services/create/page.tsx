"use client";

import {
  mdiArrowLeft,
  mdiPlus,
  mdiMinus,
  mdiWrench,
} from "@mdi/js";
import Button from "../../../../../_components/Button";
import CardBox from "../../../../../_components/CardBox";
import SectionMain from "../../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../../_components/Section/TitleLineWithButton";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Field, Formik, useFormikContext } from "formik";
import FormField from "../../../../../_components/FormField";

interface Activity {
  NumeroCorrelativoActividad: number;
  DescripcionActividad: string;
}

export default function CreateServicePage() {
  const params = useParams();
  const router = useRouter();
  const rif = params?.rif as string;
  const [franchise, setFranchise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (rif) {
      fetchFranchiseInfo();
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
    } finally {
      setLoading(false);
    }
  };

  const addActivity = () => {
    const newActivity: Activity = {
      NumeroCorrelativoActividad: activities.length + 1,
      DescripcionActividad: "",
    };
    setActivities([...activities, newActivity]);
  };

  const removeActivity = (index: number) => {
    const updatedActivities = activities.filter((_, i) => i !== index);
    // Reorder the NumeroCorrelativoActividad
    const reorderedActivities = updatedActivities.map((activity, i) => ({
      ...activity,
      NumeroCorrelativoActividad: i + 1,
    }));
    setActivities(reorderedActivities);
  };

  const updateActivity = (index: number, field: keyof Activity, value: any) => {
    const updatedActivities = [...activities];
    updatedActivities[index] = {
      ...updatedActivities[index],
      [field]: value,
    };
    setActivities(updatedActivities);
  };

  const handleSubmit = async (values: { NombreServicio: string }) => {
    setSubmitting(true);
    try {
      // First, create the new service
      const createServiceRes = await fetch(`http://127.0.0.1:8000/service/create?Servicio=${encodeURIComponent(values.NombreServicio)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!createServiceRes.ok) {
        const errorData = await createServiceRes.text();
        console.error("Error response:", errorData);
        throw new Error(`Error al crear el servicio: ${createServiceRes.status} - ${errorData}`);
      }

      // Get the newly created service to obtain its ID
      const getServiceRes = await fetch(`http://127.0.0.1:8000/service`);
      if (!getServiceRes.ok) throw new Error("Error al obtener servicios");

      const allServices = await getServiceRes.json();
      const newService = allServices.find((service: any) => 
        service.NombreServicio === values.NombreServicio
      );

      if (!newService) {
        throw new Error("No se pudo encontrar el servicio recién creado");
      }

      // Create activities for the service
      for (const activity of activities) {
        if (activity.DescripcionActividad.trim()) {
          const createActivityRes = await fetch(`http://127.0.0.1:8000/activity/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              CodigoServicio: newService.CodigoServicio,
              NumeroCorrelativoActividad: activity.NumeroCorrelativoActividad,
              DescripcionActividad: activity.DescripcionActividad,
            }),
          });

          if (!createActivityRes.ok) {
            throw new Error(`Error al crear actividad ${activity.NumeroCorrelativoActividad}`);
          }
        }
      }

      // Then, add the service to the franchise
      const addToFranchiseRes = await fetch(`http://127.0.0.1:8000/franchise_services/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          FranquiciaRIF: rif,
          CodigoServicio: newService.CodigoServicio,
        }),
      });

      if (!addToFranchiseRes.ok) throw new Error("Error al agregar servicio a la franquicia");

      alert("Servicio creado y agregado exitosamente");
      router.push(`/dashboard/franchise/${rif}/services`);
    } catch (err) {
      console.error("Error:", err);
      alert(`Error al crear el servicio: ${err instanceof Error ? err.message : 'Error desconocido'}`);
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
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </SectionMain>
    );
  }

  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiPlus} title="Crear Nuevo Servicio" main>
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
            <p className="text-gray-600">Crea un nuevo servicio y agrégalo automáticamente a esta franquicia</p>
          </div>

          <Formik
            initialValues={{
              NombreServicio: "",
            }}
            onSubmit={handleSubmit}
          >
            {({ values, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormField label="Nombre del Servicio" labelFor="NombreServicio">
                  {({ className }) => (
                    <Field
                      name="NombreServicio"
                      id="NombreServicio"
                      placeholder="Ingresa el nombre del servicio..."
                      className={className}
                      required
                    />
                  )}
                </FormField>

                {/* Activities Section */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium flex items-center">
                      <span className="mr-2">Actividades del Servicio</span>
                      <span className="text-sm text-gray-500">({activities.length})</span>
                    </h4>
                    <Button
                      label="Agregar Actividad"
                      icon={mdiPlus}
                      color="success"
                      onClick={addActivity}
                      small
                    />
                  </div>

                  {activities.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                      <p>No hay actividades agregadas</p>
                      <p className="text-sm">Haz clic en "Agregar Actividad" para comenzar</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activities.map((activity, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium">Actividad #{activity.NumeroCorrelativoActividad}</h5>
                            <Button
                              icon={mdiMinus}
                              color="danger"
                              onClick={() => removeActivity(index)}
                              small
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descripción de la Actividad
                              </label>
                              <input
                                type="text"
                                value={activity.DescripcionActividad}
                                onChange={(e) => updateActivity(index, 'DescripcionActividad', e.target.value)}
                                placeholder="Descripción de la actividad..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    href={`/dashboard/franchise/${rif}/services`}
                    color="contrast"
                    label="Cancelar"
                  />
                  <Button
                    label="Crear Servicio"
                    icon={mdiPlus}
                    color="success"
                    type="submit"
                    disabled={!values.NombreServicio.trim() || submitting || isSubmitting}
                  />
                </div>
              </form>
            )}
          </Formik>
        </div>
      </CardBox>
    </SectionMain>
  );
} 