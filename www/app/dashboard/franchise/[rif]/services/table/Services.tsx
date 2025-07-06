"use client";

import { mdiEye, mdiInformation, mdiTagEdit, mdiTrashCan, mdiAccountMultiple } from "@mdi/js";
import React, { useState, useEffect } from "react";
import Button from "../../../../../_components/Button";
import Buttons from "../../../../../_components/Buttons";
import CardBoxModal from "../../../../../_components/CardBox/Modal";
import { useRouter } from "next/navigation";

interface Service {
  CodigoServicio: number;
  NombreServicio: string;
}

interface EmployeeResponsibility {
  EmpleadoCI: string;
  CodigoServicio: number;
  NombreEmpleado?: string;
}

type Props = {
  services: Service[];
  rif: string;
  onDelete?: () => void;
};

const TableServices = ({ services, rif, onDelete }: Props) => {
  const perPage = 5;
  const router = useRouter();

  const numPages = Math.ceil(services.length / perPage);
  const pagesList: number[] = [];

  for (let i = 0; i < numPages; i++) {
    pagesList.push(i);
  }

  const [currentPage, setCurrentPage] = useState(0);
  const servicesPaginated = services.slice(
    perPage * currentPage,
    perPage * (currentPage + 1),
  );

  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [isModalTrashActive, setIsModalTrashActive] = useState(false);
  const [serviceResponsibilities, setServiceResponsibilities] = useState<{[key: number]: EmployeeResponsibility[]}>({});
  const [loadingResponsibilities, setLoadingResponsibilities] = useState(false);

  // Función para obtener los responsables de un servicio específico
  const fetchServiceResponsibilities = async (codigoServicio: number) => {
    try {
      setLoadingResponsibilities(true);
      const res = await fetch(`http://127.0.0.1:8000/employee_responsibilities`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        // Filtrar responsabilidades para este servicio específico
        const responsibilities = data.filter((resp: EmployeeResponsibility) => 
          resp.CodigoServicio === codigoServicio
        );
        
        // Obtener información adicional de los empleados
        const responsibilitiesWithNames = await Promise.all(
          responsibilities.map(async (resp: EmployeeResponsibility) => {
            try {
              const employeeRes = await fetch(`http://127.0.0.1:8000/employee/${resp.EmpleadoCI}`);
              const employeeData = await employeeRes.json();
              return {
                ...resp,
                NombreEmpleado: employeeData.NombreCompleto
              };
            } catch (error) {
              return resp;
            }
          })
        );
        
        setServiceResponsibilities(prev => ({
          ...prev,
          [codigoServicio]: responsibilitiesWithNames
        }));
      }
    } catch (error) {
      console.error("Error fetching service responsibilities:", error);
    } finally {
      setLoadingResponsibilities(false);
    }
  };

  // Cargar responsabilidades cuando cambian los servicios
  useEffect(() => {
    servicesPaginated.forEach(service => {
      if (!serviceResponsibilities[service.CodigoServicio]) {
        fetchServiceResponsibilities(service.CodigoServicio);
      }
    });
  }, [servicesPaginated]);

  const handleDelete = async () => {
    if (!selectedService) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/franchise_services/delete?FranquiciaRIF=${rif}&CodigoServicio=${selectedService.CodigoServicio}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar servicio de la franquicia");
      setIsModalTrashActive(false);
      setSelectedService(null);
      // Call the callback to refresh the services list
      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      alert("No se pudo eliminar el servicio de la franquicia");
    }
  };

  return (
    <>
      <CardBoxModal
        title="Por favor confirma"
        buttonColor="danger"
        buttonLabel="Confirmar"
        isActive={isModalTrashActive}
        onConfirm={handleDelete}
        onCancel={() => {
          setIsModalTrashActive(false);
          setSelectedService(null);
        }}
      >
        <p>
          ¿Estás seguro de que quieres <b>eliminar</b> este servicio de la franquicia?
        </p>
      </CardBoxModal>

      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre del Servicio</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicesPaginated.map((service: Service) => {
            return (
            <tr key={service.CodigoServicio}>
              <td data-label="Código">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  #{service.CodigoServicio}
                </span>
              </td>
              <td data-label="Nombre del Servicio">{service.NombreServicio}</td>
              <td className="before:hidden lg:w-1 whitespace-nowrap">
                <Buttons type="justify-start lg:justify-end" noWrap>
                  <Button
                    color="info"
                    icon={mdiInformation}
                    href={`/dashboard/franchise/${rif}/services/${service.CodigoServicio}`}
                    small
                    isGrouped
                  />
                  <Button
                    color="contrast"
                    icon={mdiTagEdit}
                    href={`/dashboard/franchise/${rif}/services/edit/${service.CodigoServicio}`}
                    small
                    isGrouped
                  />
                  <Button
                    color="danger"
                    icon={mdiTrashCan}
                    onClick={() => {
                      setIsModalTrashActive(true);
                      setSelectedService(service);
                    }}
                    small
                    isGrouped
                  />
                </Buttons>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
      <div className="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 md:py-0">
          <Buttons>
            {pagesList.map((page) => (
              <Button
                key={page}
                active={page === currentPage}
                label={(page + 1).toString()}
                color={page === currentPage ? "lightDark" : "whiteDark"}
                small
                onClick={() => setCurrentPage(page)}
                isGrouped
              />
            ))}
          </Buttons>
          <small className="mt-6 md:mt-0">
            Page {currentPage + 1} of {numPages}
          </small>
        </div>
      </div>
    </>
  );
};

export default TableServices; 