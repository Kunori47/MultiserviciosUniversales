"use client";

import {
  mdiArrowLeft,
  mdiWrench,
  mdiContentSave,
} from "@mdi/js";
import Button from "../../../../../../_components/Button";
import CardBox from "../../../../../../_components/CardBox";
import SectionMain from "../../../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../../../_components/Section/TitleLineWithButton";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Service {
  CodigoServicio: number;
  NombreServicio: string;
}

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();
  const rif = params?.rif as string;
  const codigoServicio = params?.codigoServicio as string;
  
  const [service, setService] = useState<Service | null>(null);
  const [franchise, setFranchise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    NombreServicio: ""
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && rif && codigoServicio) {
      fetchData();
    }
  }, [mounted, rif, codigoServicio]);

  const fetchData = async () => {
    try {
      // Fetch service details
      const serviceRes = await fetch(`http://127.0.0.1:8000/service/${codigoServicio}`);
      if (!serviceRes.ok) throw new Error("Error cargando servicio");
      const serviceData = await serviceRes.json();
      setService(serviceData);
      setForm({ NombreServicio: serviceData.NombreServicio });

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
    if (!service) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/service/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          CodigoServicio: service.CodigoServicio,
          NombreServicio: form.NombreServicio
        }),
      });

      if (!res.ok) throw new Error("Error actualizando servicio");

      // Navigate back to services list
      router.push(`/dashboard/franchise/${rif}/services`);
    } catch (err) {
      console.error("Error:", err);
      alert("Error al actualizar el servicio");
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
          <p className="mt-4 text-gray-600">Cargando servicio...</p>
        </div>
      </SectionMain>
    );
  }

  if (!service || !franchise) {
    return (
      <SectionMain>
        <div className="text-center">
          <p>No se pudo cargar la información del servicio.</p>
        </div>
      </SectionMain>
    );
  }

  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiWrench} title="Editar Servicio" main>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">#{service.CodigoServicio}</div>
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
            <h4 className="text-lg font-medium">Editar Información del Servicio</h4>
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
                Nombre del Servicio
              </label>
              <input
                type="text"
                value={form.NombreServicio}
                onChange={(e) => setForm({ ...form, NombreServicio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingresa el nombre del servicio..."
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Proporciona un nombre descriptivo para este servicio.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                href={`/dashboard/franchise/${rif}/services`}
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