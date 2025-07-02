"use client";

import {
  mdiArrowLeft,
  mdiWrench,
  mdiContentSave,
  mdiAccountPlus,
  mdiAccountRemove,
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

interface Employee {
  CI: string;
  NombreCompleto: string;
  Rol: string;
}

interface EmployeeResponsibility {
  EmpleadoCI: string;
  CodigoServicio: number;
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

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentResponsibilities, setCurrentResponsibilities] = useState<EmployeeResponsibility[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [loadingEmployees, setLoadingEmployees] = useState(false);

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

      // Fetch employees and responsibilities
      await Promise.all([
        fetchEmployees(),
        fetchCurrentResponsibilities()
      ]);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const res = await fetch(`http://127.0.0.1:8000/employee/franchise/${rif}`);
      if (!res.ok) throw new Error("Error cargando empleados");
      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const fetchCurrentResponsibilities = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/employee_responsibilities`);
      if (!res.ok) throw new Error("Error cargando responsabilidades");
      const data = await res.json();
      
      if (Array.isArray(data)) {
        const serviceResponsibilities = data.filter((resp: EmployeeResponsibility) => 
          resp.CodigoServicio === parseInt(codigoServicio)
        );
        setCurrentResponsibilities(serviceResponsibilities);
      }
    } catch (err) {
      console.error("Error fetching responsibilities:", err);
      setCurrentResponsibilities([]);
    }
  };

  const handleAddResponsibility = async () => {
    if (!selectedEmployee || !service) return;

    // Verificar si ya existe la responsabilidad
    const exists = currentResponsibilities.some(resp => resp.EmpleadoCI === selectedEmployee);
    if (exists) {
      alert("Este empleado ya es responsable de este servicio");
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/employee_responsibilities/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          EmpleadoCI: selectedEmployee,
          CodigoServicio: service.CodigoServicio
        }),
      });

      if (!res.ok) throw new Error("Error agregando responsabilidad");

      // Actualizar la lista de responsabilidades
      await fetchCurrentResponsibilities();
      setSelectedEmployee("");
    } catch (err) {
      console.error("Error:", err);
      alert("Error al agregar la responsabilidad");
    }
  };

  const handleRemoveResponsibility = async (empleadoCI: string) => {
    if (!service) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/employee_responsibilities/delete?EmpleadoCI=${empleadoCI}&CodigoServicio=${service.CodigoServicio}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error("Error eliminando responsabilidad");

      // Actualizar la lista de responsabilidades
      await fetchCurrentResponsibilities();
    } catch (err) {
      console.error("Error:", err);
      alert("Error al eliminar la responsabilidad");
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

            {/* Gestión de Responsables */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-medium text-gray-900">Responsables del Servicio</h5>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-sm text-gray-500">Gestión de empleados responsables</span>
                </div>
              </div>

              {/* Agregar Responsable */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agregar Responsable
                    </label>
                    <select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loadingEmployees}
                    >
                      <option value="">Selecciona un empleado...</option>
                      {employees.map((employee) => (
                        <option key={employee.CI} value={employee.CI}>
                          {employee.NombreCompleto} - {employee.CI}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-gray-500">
                      Selecciona un empleado para asignarlo como responsable de este servicio.
                    </p>
                  </div>
                  <Button
                    color="success"
                    icon={mdiAccountPlus}
                    label="Agregar"
                    onClick={handleAddResponsibility}
                    disabled={!selectedEmployee || loadingEmployees}
                    small
                  />
                </div>
              </div>

              {/* Lista de Responsables Actuales */}
              <div>
                <h6 className="text-sm font-medium text-gray-700 mb-3">Responsables Actuales</h6>
                {loadingEmployees ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-gray-600">Cargando responsables...</span>
                  </div>
                ) : currentResponsibilities.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">No hay responsables asignados</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {currentResponsibilities.map((resp) => {
                      const employee = employees.find(emp => emp.CI === resp.EmpleadoCI);
                      return (
                        <div key={resp.EmpleadoCI} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-full">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {employee?.NombreCompleto || resp.EmpleadoCI}
                              </p>
                              <p className="text-sm text-gray-500">
                                {employee?.Rol || 'Empleado'} - {resp.EmpleadoCI}
                              </p>
                            </div>
                          </div>
                          <Button
                            color="danger"
                            icon={mdiAccountRemove}
                            onClick={() => handleRemoveResponsibility(resp.EmpleadoCI)}
                            small
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
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