"use client";

import { mdiEye, mdiInformation, mdiTagEdit, mdiTrashCan } from "@mdi/js";
import React, { useState, useEffect } from "react";
import { Employee } from "../../../../../_interfaces";
import Button from "../../../../../_components/Button";
import Buttons from "../../../../../_components/Buttons";
import CardBoxModal from "../../../../../_components/CardBox/Modal";
import { useRouter } from "next/navigation";

type Props = {
  employee: Employee[];
  onRefresh?: () => void;
};

const TableEmployee = ({ employee, onRefresh }: Props) => {
  const perPage = 5;
  const router = useRouter();
  const [employeeWithOrders, setEmployeeWithOrders] = useState<any[]>([]);

  // Obtener cantidad de órdenes para cada empleado
  useEffect(() => {
    const fetchOrdersForEmployees = async () => {
      const employeesWithOrders = await Promise.all(
        employee.map(async (emp) => {
          try {
            const res = await fetch(`http://127.0.0.1:8000/employee_order/count_emp?EmpleadoCI=${emp.CI}`);
            const orderCount = await res.json();
            return {
              ...emp,
              orderCount: orderCount || 0
            };
          } catch (error) {
            return {
              ...emp,
              orderCount: 0
            };
          }
        })
      );
      
      // Ordenar por cantidad de órdenes de manera descendiente
      const sortedEmployees = employeesWithOrders.sort((a, b) => b.orderCount - a.orderCount);
      setEmployeeWithOrders(sortedEmployees);
    };

    if (employee.length > 0) {
      fetchOrdersForEmployees();
    }
  }, [employee]);

  const numPages = employeeWithOrders.length / perPage;
  const pagesList: number[] = [];

  for (let i = 0; i < numPages; i++) {
    pagesList.push(i);
  }

  const [currentPage, setCurrentPage] = useState(0);
  const clientsPaginated = employeeWithOrders.slice(
    perPage * currentPage,
    perPage * (currentPage + 1),
  );

  const [selectedCI, setSelectedCI] = useState<any | null>(null);
  const [isModalTrashActive, setIsModalTrashActive] = useState(false);

  const handleDelete = async () => {
    if (!selectedCI) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/employee/delete?CI=${selectedCI.CI}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar empleado");
      setIsModalTrashActive(false);
      setSelectedCI(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert("No se pudo eliminar el empleado");
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
          setSelectedCI(null);
        }}
      >
        <p>
          ¿Estás seguro de que quieres <b>eliminar</b> al empleado?
        </p>
      </CardBoxModal>

      <table>
        <thead>
          <tr>
            <th>CI</th>
            <th>Nombre Completo</th>
            <th>Teléfono</th>
            <th>Salario</th>
            <th>Rol</th>
            <th>Órdenes Realizadas</th>
          </tr>
        </thead>
        <tbody>
          {clientsPaginated.map((employee: any) => (
            <tr key={employee.CI}>
              <td data-label="CI">{employee.CI}</td>
              <td data-label="NombreCompleto">{employee.NombreCompleto}</td>
              <td data-label="Telefono">{employee.Telefono}</td>
              <td data-label="Salario">${employee.Salario}</td>
              <td data-label="Rol" className="lg:w-1 whitespace-nowrap">
                <small className="text-gray-500 dark:text-slate-400">
                  {employee.Rol}
                </small>
              </td>
              <td data-label="Órdenes Realizadas" className="text-center">
                <span className="font-semibold text-blue-600">
                  {employee.orderCount || 0}
                </span>
              </td>
              <td className="before:hidden lg:w-1 whitespace-nowrap">
                <Buttons type="justify-start lg:justify-end" noWrap>
                  <Button
                    color="info"
                    icon={mdiInformation}
                    href={`/dashboard/franchise/${employee.FranquiciaRIF}/employee/${employee.CI}`}
                    small
                    isGrouped
                  />
                  <Button
                    color="contrast"
                    icon={mdiTagEdit}
                    href={`/dashboard/franchise/${employee.FranquiciaRIF}/employee/update/${employee.CI}`}
                    small
                    isGrouped
                  />
                  <Button
                    color="danger"
                    icon={mdiTrashCan}
                    onClick={() => {
                      setIsModalTrashActive(true);
                      setSelectedCI(employee);
                    }}
                    small
                    isGrouped
                  />
                </Buttons>
              </td>
            </tr>
          ))}
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
            Página {currentPage + 1} de {(numPages < 0) ? numPages : 1}
          </small>
        </div>
      </div>
    </>
  );
};

export default TableEmployee;
