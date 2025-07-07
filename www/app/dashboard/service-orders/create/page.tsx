"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Button from "../../../_components/Button";
import CardBox from "../../../_components/CardBox";
import SectionMain from "../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../_components/Section/TitleLineWithButton";
import FormField from "../../../_components/FormField";
import Divider from "../../../_components/Divider";
import { mdiPlus, mdiArrowLeft, mdiClose, mdiTrashCan } from "@mdi/js";
import { useAuth } from "../../../_hooks/useAuth";

interface Vehicle {
  CodigoVehiculo: number;
  Placa: string;
  CedulaCliente: string;
  NombreCliente?: string;
}

interface Employee {
  CI: string;
  NombreCompleto: string;
  Rol: string;
}

interface Service {
  CodigoServicio: number;
  NombreServicio: string;
}

interface Activity {
  CodigoServicio: number;
  NumeroCorrelativoActividad: number;
  DescripcionActividad: string;
}

interface OrderActivity {
  CodigoServicio: number;
  NumeroCorrelativoActividad: number;
  NombreServicio?: string;
  DescripcionActividad?: string;
}

const validationSchema = Yup.object().shape({
  FechaEntrada: Yup.date().required("Fecha de entrada es requerida"),
  HoraEntrada: Yup.string().required("Hora de entrada es requerida"),
  FechaSalidaEstimada: Yup.date().required("Fecha de salida estimada es requerida"),
  HoraSalidaEstimada: Yup.string().required("Hora de salida estimada es requerida"),
  CodigoVehiculo: Yup.number().required("Vehículo es requerido"),
  EmpleadosAsignados: Yup.array().min(1, "Debe asignar al menos un empleado"),
});

export default function CreateServiceOrderPage() {
  const router = useRouter();
  const { employee, franchise } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState<string>("");
  const [services, setServices] = useState<Service[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [orderActivities, setOrderActivities] = useState<OrderActivity[]>([]);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [activityError, setActivityError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener vehículos
        const vehiclesRes = await fetch("http://127.0.0.1:8000/vehicle");
        if (vehiclesRes.ok) {
          const vehiclesData = await vehiclesRes.json();
          
          // Obtener información de clientes para cada vehículo
          const vehiclesWithClients = await Promise.all(
            (Array.isArray(vehiclesData) ? vehiclesData : []).map(async (vehicle: Vehicle) => {
              try {
                const clientRes = await fetch(`http://127.0.0.1:8000/customer/${vehicle.CedulaCliente}`);
                if (clientRes.ok) {
                  const clientData = await clientRes.json();
                  return {
                    ...vehicle,
                    NombreCliente: clientData.NombreCompleto
                  };
                }
                return vehicle;
              } catch {
                return vehicle;
              }
            })
          );
          
          setVehicles(vehiclesWithClients);
        } else {
          console.error("Error fetching vehicles:", vehiclesRes.status);
          setVehicles([]);
        }
        
        // Obtener empleados de la franquicia del empleado logueado
        if (employee?.FranquiciaRIF) {
          try {
            console.log("Fetching employees for franchise:", employee.FranquiciaRIF);
            const employeesRes = await fetch(`http://127.0.0.1:8000/employee/franchise/${employee.FranquiciaRIF}`);
            if (employeesRes.ok) {
              const employeesData = await employeesRes.json();
              console.log("Employees data received:", employeesData);
              setEmployees(Array.isArray(employeesData) ? employeesData : []);
            } else {
              console.error("Error fetching employees:", employeesRes.status);
              setEmployees([]);
            }
          } catch (error) {
            console.error("Error fetching employees:", error);
            setEmployees([]);
          }
        } else {
          console.log("No franchise RIF found for employee:", employee);
          setEmployees([]);
        }
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employee]);

  // Cargar servicios de la franquicia
  useEffect(() => {
    const fetchServices = async () => {
      if (employee?.FranquiciaRIF) {
        const res = await fetch(`http://127.0.0.1:8000/service/franchise/${employee.FranquiciaRIF}`);
        if (res.ok) {
          setServices(await res.json());
        }
      }
    };
    fetchServices();
  }, [employee]);

  // Cargar actividades del servicio seleccionado
  useEffect(() => {
    const fetchActivities = async () => {
      if (selectedService) {
        const res = await fetch(`http://127.0.0.1:8000/activity/service/${selectedService}`);
        if (res.ok) {
          setActivities(await res.json());
        } else {
          setActivities([]);
        }
      } else {
        setActivities([]);
      }
    };
    fetchActivities();
  }, [selectedService]);

  // Agregar actividad a la lista
  const addActivity = () => {
    if (!selectedService || !selectedActivity) return;
    const serviceObj = services.find(s => s.CodigoServicio === selectedService);
    const activityObj = activities.find(a => a.NumeroCorrelativoActividad === selectedActivity);
    if (!serviceObj || !activityObj) return;
    // Evitar duplicados
    if (orderActivities.some(a => a.CodigoServicio === selectedService && a.NumeroCorrelativoActividad === selectedActivity)) return;
    setOrderActivities([
      ...orderActivities,
      {
        CodigoServicio: selectedService,
        NumeroCorrelativoActividad: selectedActivity,
        NombreServicio: serviceObj.NombreServicio,
        DescripcionActividad: activityObj.DescripcionActividad,
      },
    ]);
    setSelectedService(null);
    setSelectedActivity(null);
  };

  // Eliminar actividad
  const removeActivity = (codigoServicio: number, numeroCorrelativoActividad: number) => {
    setOrderActivities(orderActivities.filter(a => !(a.CodigoServicio === codigoServicio && a.NumeroCorrelativoActividad === numeroCorrelativoActividad)));
  };

  const handleSubmit = async (values: any) => {
    if (orderActivities.length === 0) {
      setActivityError("Debe agregar al menos un servicio con su actividad.");
      return;
    } else {
      setActivityError("");
    }
    setSubmitting(true);
    try {
      // Crear la orden de servicio
      const response = await fetch("http://127.0.0.1:8000/service_order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          FechaEntrada: values.FechaEntrada.toISOString().split('T')[0],
          HoraEntrada: values.HoraEntrada,
          FechaSalidaEstimada: values.FechaSalidaEstimada.toISOString().split('T')[0],
          HoraSalidaEstimada: values.HoraSalidaEstimada,
          CodigoVehiculo: values.CodigoVehiculo,
          EmpleadosAsignados: values.EmpleadosAsignados
        }),
      });
      if (!response.ok) throw new Error("Error creando la orden de servicio");
      const order = await response.json();
      const orderId = order.order_id;
      // Crear actividades asociadas
      for (const act of orderActivities) {
        await fetch(`http://127.0.0.1:8000/orderxactivity/create?IDorden=${orderId}&CodigoServicio=${act.CodigoServicio}&NumeroCorrelativoActividad=${act.NumeroCorrelativoActividad}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(act),
        });
      }
      // Redirigir
        if (employee?.FranquiciaRIF) {
          router.push(`/dashboard/franchise/${employee.FranquiciaRIF}/orders`);
        } else {
          router.push("/dashboard/service-orders");
      }
    } catch (error) {
      alert("Error al crear la orden o actividades");
    } finally {
      setSubmitting(false);
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

  // Antes del render de las actividades, calcula las actividades ya seleccionadas:
  const selectedActivityIds = orderActivities
    .filter(a => a.CodigoServicio === selectedService)
    .map(a => a.NumeroCorrelativoActividad);

  return (
    <SectionMain>
      <SectionTitleLineWithButton
        icon={mdiPlus}
        title="Crear Orden de Servicio"
        main
      >
        <Button
          href={employee?.FranquiciaRIF ? `/dashboard/franchise/${employee.FranquiciaRIF}/orders` : "/dashboard/service-orders"}
          icon={mdiArrowLeft}
          label="Volver"
          color="white"
          roundedFull
          small
        />
      </SectionTitleLineWithButton>

      <CardBox>
        <Formik
          initialValues={{
            FechaEntrada: new Date(),
            HoraEntrada: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false }),
            FechaSalidaEstimada: new Date(),
            HoraSalidaEstimada: "",
            CodigoVehiculo: "",
            EmpleadosAsignados: [],
            Comentario: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Fecha de Entrada" help="Fecha cuando ingresa el vehículo">
                  {({ className }) => (
                    <Field
                      name="FechaEntrada"
                      type="date"
                      className={className}
                      value={values.FechaEntrada instanceof Date ? values.FechaEntrada.toISOString().split('T')[0] : values.FechaEntrada}
                      onChange={(e: any) => setFieldValue("FechaEntrada", new Date(e.target.value))}
                      disabled
                    />
                  )}
                </FormField>

                <FormField label="Hora de Entrada" help="Hora cuando ingresa el vehículo">
                  {({ className }) => (
                    <Field
                      name="HoraEntrada"
                      type="time"
                      className={className}
                      disabled
                    />
                  )}
                </FormField>

                <FormField label="Fecha de Salida Estimada" help="Fecha estimada de salida">
                  {({ className }) => (
                    <Field
                      name="FechaSalidaEstimada"
                      type="date"
                      className={className}
                      value={values.FechaSalidaEstimada instanceof Date ? values.FechaSalidaEstimada.toISOString().split('T')[0] : values.FechaSalidaEstimada}
                      onChange={(e: any) => setFieldValue("FechaSalidaEstimada", new Date(e.target.value))}
                    />
                  )}
                </FormField>

                <FormField label="Hora de Salida Estimada" help="Hora estimada de salida">
                  {({ className }) => (
                    <Field
                      name="HoraSalidaEstimada"
                      type="time"
                      className={className}
                    />
                  )}
                </FormField>
              </div>

              <Divider />

              <FormField label="Vehículo" help="Seleccione el vehículo">
                {({ className }) => (
                  <Field
                    name="CodigoVehiculo"
                    as="select"
                    className={className}
                  >
                    <option value="">Seleccione un vehículo</option>
                    {Array.isArray(vehicles) && vehicles.map((vehicle) => (
                      <option key={vehicle.CodigoVehiculo} value={vehicle.CodigoVehiculo}>
                        {vehicle.Placa} - {vehicle.NombreCliente || vehicle.CedulaCliente}
                      </option>
                    ))}
                  </Field>
                )}
              </FormField>

              <Divider />

              <FormField label="Empleados Asignados" help="Seleccione los empleados que trabajarán en esta orden">
                {({ className }) => {
                  console.log("Rendering employees section, employees:", employees);
                  return (
                    <div>
                      {!Array.isArray(employees) || employees.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          No hay empleados disponibles en su franquicia
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Selector de empleado */}
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Buscar Empleados
                              </label>
                              <input
                                type="text"
                                value={employeeSearchTerm}
                                onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                                placeholder="Buscar por nombre, cédula o rol..."
                              />
                            </div>

                            {/* Lista de empleados filtrados */}
                            <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                              {employees
                                .filter(emp => 
                                  !values.EmpleadosAsignados.includes(emp.CI) &&
                                  (employeeSearchTerm === "" || 
                                   emp.NombreCompleto.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
                                   emp.CI.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
                                   emp.Rol.toLowerCase().includes(employeeSearchTerm.toLowerCase()))
                                )
                                .map((employee) => (
                                  <div
                                    key={employee.CI}
                                    className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => {
                                      setFieldValue("EmpleadosAsignados", [...values.EmpleadosAsignados, employee.CI]);
                                      setEmployeeSearchTerm("");
                                    }}
                                  >
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900">{employee.NombreCompleto}</div>
                                      <div className="text-sm text-gray-600">
                                        {employee.CI} • {employee.Rol}
                                      </div>
                                    </div>
                                    <div className="text-blue-600">
                                      <i className="mdi mdi-plus-circle text-lg"></i>
                                    </div>
                                  </div>
                                ))}
                              
                              {employees
                                .filter(emp => 
                                  !values.EmpleadosAsignados.includes(emp.CI) &&
                                  (employeeSearchTerm === "" || 
                                   emp.NombreCompleto.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
                                   emp.CI.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
                                   emp.Rol.toLowerCase().includes(employeeSearchTerm.toLowerCase()))
                                ).length === 0 && (
                                <div className="p-4 text-center text-gray-500">
                                  {employeeSearchTerm ? "No se encontraron empleados con esa búsqueda" : "No hay empleados disponibles"}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Tabla de empleados asignados */}
                          {values.EmpleadosAsignados.length > 0 && (
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                <h4 className="text-sm font-medium text-gray-700">Empleados Asignados ({values.EmpleadosAsignados.length})</h4>
                              </div>
                              <table className="w-full">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cédula</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nombre</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Rol</th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Acciones</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {values.EmpleadosAsignados.map((employeeCI: string) => {
                                    const employee = employees.find(emp => emp.CI === employeeCI);
                                    return employee ? (
                                      <tr key={employee.CI} className="border-t border-gray-200 hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-900">{employee.CI}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{employee.NombreCompleto}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{employee.Rol}</td>
                                        <td className="px-4 py-3 text-center">
                                          <Button
                                            onClick={() => {
                                              setFieldValue("EmpleadosAsignados", 
                                                values.EmpleadosAsignados.filter((ci: string) => ci !== employee.CI)
                                              );
                                            }}
                                            color="danger"
                                            outline
                                            small
                                            icon={mdiClose}
                                            label="Quitar"
                                          />
                                        </td>
                                      </tr>
                                    ) : null;
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}

                          {values.EmpleadosAsignados.length === 0 && (
                            <div className="text-center py-4 text-gray-500 border border-gray-200 rounded-lg">
                              No hay empleados asignados a esta orden
                            </div>
                          )}
                        </div>
                      )}
                      {errors.EmpleadosAsignados && touched.EmpleadosAsignados && (
                        <div className="mt-2 text-sm text-red-600">
                          {Array.isArray(errors.EmpleadosAsignados) 
                            ? errors.EmpleadosAsignados.join(', ') 
                            : String(errors.EmpleadosAsignados)}
                        </div>
                      )}
                    </div>
                  );
                }}
              </FormField>

              <Divider />

              {/* Sección de actividades */}
              <CardBox className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Actividades de la Orden</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-4">
                  <div>
                    <label>Servicio</label>
                    <select
                      value={selectedService || ""}
                      onChange={e => setSelectedService(parseInt(e.target.value) || null)}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Selecciona un servicio</option>
                      {services.map(service => (
                        <option key={service.CodigoServicio} value={service.CodigoServicio}>{service.NombreServicio}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Actividad</label>
                    <select
                      value={selectedActivity || ""}
                      onChange={e => setSelectedActivity(parseInt(e.target.value) || null)}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                      disabled={!selectedService}
                    >
                      <option value="">Selecciona una actividad</option>
                      {activities
                        .filter(activity => !selectedActivityIds.includes(activity.NumeroCorrelativoActividad))
                        .map((activity) => (
                          <option key={activity.NumeroCorrelativoActividad} value={activity.NumeroCorrelativoActividad}>
                            {activity.DescripcionActividad}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <Button
                      onClick={addActivity}
                      icon={mdiPlus}
                      color="success"
                      label="Agregar"
                      disabled={!selectedService || !selectedActivity}
                    />
                  </div>
                </div>
                {/* Tabla de actividades */}
                {orderActivities.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Servicio</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actividad</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderActivities.map((act, idx) => (
                          <tr key={idx} className="border-b border-gray-200">
                            <td className="px-4 py-3 text-sm text-gray-900">{act.NombreServicio}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{act.DescripcionActividad}</td>
                            <td className="px-4 py-3">
                              <Button
                                onClick={() => removeActivity(act.CodigoServicio, act.NumeroCorrelativoActividad)}
                                icon={mdiTrashCan}
                                color="danger"
                                outline
                                small
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No se han agregado actividades
                  </div>
                )}
              </CardBox>

              <Divider />

              {/* Mostrar error si no hay actividades */}
              {activityError && (
                <div className="text-red-600 font-semibold mb-4">{activityError}</div>
              )}

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  label="Cancelar"
                  color="white"
                  onClick={() => router.push(employee?.FranquiciaRIF ? `/dashboard/franchise/${employee.FranquiciaRIF}/orders` : "/dashboard/service-orders")}
                />
                <Button
                  type="submit"
                  label={submitting ? "Creando..." : "Crear Orden"}
                  color="info"
                  disabled={submitting}
                />
              </div>
            </Form>
          )}
        </Formik>
      </CardBox>
    </SectionMain>
  );
} 