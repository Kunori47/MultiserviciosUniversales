"use client";

import {
  mdiArrowLeft,
  mdiWrench,
  mdiInformation,
  mdiPencil,
  mdiDelete,
} from "@mdi/js";
import Button from "../../../../../_components/Button";
import CardBox from "../../../../../_components/CardBox";
import SectionMain from "../../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../../_components/Section/TitleLineWithButton";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Service {
  CodigoServicio: number;
  NombreServicio: string;
}

interface Activity {
  CodigoServicio: number;
  NumeroCorrelativoActividad: number;
  DescripcionActividad: string;
}

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const rif = params?.rif as string;
  const codigoServicio = params?.codigoServicio as string;
  const [franchise, setFranchise] = useState<any>(null);
  const [service, setService] = useState<Service | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && rif && codigoServicio) {
      fetchFranchiseInfo();
      fetchServiceDetails();
      fetchServiceActivities();
    }
  }, [mounted, rif, codigoServicio]);

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

  const fetchServiceDetails = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/service/${codigoServicio}`);
      if (!res.ok) throw new Error("Error cargando detalles del servicio");
      const data = await res.json();
      setService(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const fetchServiceActivities = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/activity/service/${codigoServicio}`);
      if (!res.ok) throw new Error("Error cargando actividades del servicio");
      const data = await res.json();
      setActivities(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditActivity = (activity: Activity) => {
    router.push(`/dashboard/franchise/${rif}/services/${codigoServicio}/edit/${activity.NumeroCorrelativoActividad}`);
  };

  const handleDeleteActivity = async (activity: Activity) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la actividad #${activity.NumeroCorrelativoActividad}? Esta acción no se puede deshacer.`)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/activity/delete?CodigoServicio=${activity.CodigoServicio}&NumeroCorrelativoActividad=${activity.NumeroCorrelativoActividad}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error("Error eliminando actividad");

      // Refresh activities list
      await fetchServiceActivities();
    } catch (err) {
      console.error("Error:", err);
      alert("Error al eliminar la actividad");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state until component is mounted
  if (!mounted) {
    return (
      <SectionMain>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </SectionMain>
    );
  }

  if (!franchise || !service) {
    return (
      <SectionMain>
        <div className="text-center">
          <p>Cargando información...</p>
        </div>
      </SectionMain>
    );
  }

  if (loading) {
    return (
      <SectionMain>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando detalles del servicio...</p>
        </div>
      </SectionMain>
    );
  }

  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiWrench} title="Detalles de Servicio" main>
        <Button
          href={`/dashboard/franchise/${rif}/services`}
          color="info"
          label="Atras"
          icon={mdiArrowLeft}
          roundedFull
        />
      </SectionTitleLineWithButton>

      {/* Service Information */}
      <CardBox className="mb-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{service.NombreServicio}</h3>
              <p className="text-gray-600">Franquicia: {franchise.Nombre}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">#{service.CodigoServicio}</div>
              <div className="text-sm text-gray-600">Código del Servicio</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{activities.length}</div>
              <div className="text-sm text-gray-600">Actividades</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{franchise.Nombre}</div>
              <div className="text-sm text-gray-600">Franquicia</div>
            </div>
          </div>
        </div>
      </CardBox>

      {/* Activities Section */}
      <CardBox>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium flex items-center">
              <span className="mr-2">Actividades del Servicio</span>
              <span className="text-sm text-gray-500">({activities.length})</span>
            </h4>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-sm text-gray-500">Lista de actividades</span>
            </div>
          </div>

          {activities.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay actividades</h3>
              <p className="text-gray-500">Este servicio no tiene actividades registradas.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.NumeroCorrelativoActividad} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {activity.NumeroCorrelativoActividad}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium text-gray-900">
                          Actividad #{activity.NumeroCorrelativoActividad}
                        </h5>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Actividad
                          </span>
                          <Button
                            icon={mdiPencil}
                            color="info"
                            small
                            onClick={() => handleEditActivity(activity)}
                            roundedFull
                          />
                          <Button
                            icon={mdiDelete}
                            color="danger"
                            small
                            onClick={() => handleDeleteActivity(activity)}
                            roundedFull
                          />
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {activity.DescripcionActividad}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardBox>
    </SectionMain>
  );
} 