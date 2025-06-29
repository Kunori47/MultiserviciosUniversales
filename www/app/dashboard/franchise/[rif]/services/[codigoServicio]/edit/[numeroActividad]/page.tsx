"use client";

import {
  mdiArrowLeft,
  mdiWrench,
  mdiContentSave,
} from "@mdi/js";
import Button from "../../../../../../../_components/Button";
import CardBox from "../../../../../../../_components/CardBox";
import SectionMain from "../../../../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../../../../_components/Section/TitleLineWithButton";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Activity {
  CodigoServicio: number;
  NumeroCorrelativoActividad: number;
  DescripcionActividad: string;
}

export default function EditActivityPage() {
  const params = useParams();
  const router = useRouter();
  const rif = params?.rif as string;
  const codigoServicio = params?.codigoServicio as string;
  const numeroActividad = params?.numeroActividad as string;
  
  const [activity, setActivity] = useState<Activity | null>(null);
  const [service, setService] = useState<any>(null);
  const [franchise, setFranchise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    DescripcionActividad: ""
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && rif && codigoServicio && numeroActividad) {
      fetchData();
    }
  }, [mounted, rif, codigoServicio, numeroActividad]);

  const fetchData = async () => {
    try {
      // Fetch activity details
      const activityRes = await fetch(`http://127.0.0.1:8000/activity/${codigoServicio}/${numeroActividad}`);
      if (!activityRes.ok) throw new Error("Error cargando actividad");
      const activityData = await activityRes.json();
      setActivity(activityData);
      setForm({ DescripcionActividad: activityData.DescripcionActividad });

      // Fetch service details
      const serviceRes = await fetch(`http://127.0.0.1:8000/service/${codigoServicio}`);
      if (!serviceRes.ok) throw new Error("Error cargando servicio");
      const serviceData = await serviceRes.json();
      setService(serviceData);

      // Fetch franchise details
      const franchiseRes = await fetch(`http://127.0.0.1:8000/franchise/${rif}`);
      if (!franchiseRes.ok) throw new Error("Error cargando franquicia");
      const franchiseData = await franchiseRes.json();
      setFranchise(franchiseData);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/activity/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          CodigoServicio: activity.CodigoServicio,
          NumeroCorrelativoActividad: activity.NumeroCorrelativoActividad,
          DescripcionActividad: form.DescripcionActividad
        }),
      });

      if (!res.ok) throw new Error("Error actualizando actividad");

      // Navigate back to service details
      router.push(`/dashboard/franchise/${rif}/services/${codigoServicio}`);
    } catch (err) {
      console.error("Error:", err);
      alert("Error al actualizar la actividad");
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

  if (loading) {
    return (
      <SectionMain>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando actividad...</p>
        </div>
      </SectionMain>
    );
  }

  if (!activity || !service || !franchise) {
    return (
      <SectionMain>
        <div className="text-center">
          <p>No se pudo cargar la información de la actividad.</p>
        </div>
      </SectionMain>
    );
  }

  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiWrench} title="Editar Actividad" main>
        <Button
          href={`/dashboard/franchise/${rif}/services/${codigoServicio}`}
          color="info"
          label="Atras"
          icon={mdiArrowLeft}
          roundedFull
        />
      </SectionTitleLineWithButton>

      {/* Activity Information */}
      <CardBox className="mb-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Actividad #{activity.NumeroCorrelativoActividad}</h3>
              <p className="text-gray-600">Servicio: {service.NombreServicio} | Franquicia: {franchise.Nombre}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">#{activity.NumeroCorrelativoActividad}</div>
              <div className="text-sm text-gray-600">Número de Actividad</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">#{service.CodigoServicio}</div>
              <div className="text-sm text-gray-600">Código del Servicio</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{franchise.Nombre}</div>
              <div className="text-sm text-gray-600">Franquicia</div>
            </div>
          </div>
        </div>
      </CardBox>

      {/* Edit Form */}
      <CardBox>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">Editar Descripción de la Actividad</h4>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="text-sm text-gray-500">Formulario de edición</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción de la Actividad
              </label>
              <textarea
                value={form.DescripcionActividad}
                onChange={(e) => setForm({ ...form, DescripcionActividad: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={6}
                placeholder="Describe la actividad..."
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Proporciona una descripción detallada de esta actividad del servicio.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                href={`/dashboard/franchise/${rif}/services/${codigoServicio}`}
                label="Cancelar"
                color="info"
                disabled={isSubmitting}
              />
              <Button
                label={isSubmitting ? "Guardando..." : "Guardar Cambios"}
                color="success"
                icon={mdiContentSave}
                type="submit"
                disabled={isSubmitting}
              />
            </div>
          </form>
        </div>
      </CardBox>
    </SectionMain>
  );
} 