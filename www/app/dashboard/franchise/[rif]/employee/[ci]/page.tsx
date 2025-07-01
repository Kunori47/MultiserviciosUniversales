"use client";

import {
  mdiBallotOutline,
  mdiInformation,
  mdiTag,
} from "@mdi/js";
import Button from "../../../../../_components/Button";
import Divider from "../../../../../_components/Divider";
import CardBox from "../../../../../_components/CardBox";
import SectionMain from "../../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../../_components/Section/TitleLineWithButton";
import FieldLabel from "../../../../../_components/FormField/FieldLabel";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function InfoEmployeePage() {

      const params = useParams();
      const ci = params?.ci as string;
      const rif = params?.rif as string;
      const [employee, setEmployee] = useState<any>(null);
      const [cantservice, setCantService] = useState(0);
      const [employeeSpecialties, setEmployeeSpecialties] = useState<any[]>([]);
      const [isLoading, setIsLoading] = useState(true);
  
  
      useEffect(() => {
          if (ci) {
            setIsLoading(true);
          fetch(`http://127.0.0.1:8000/employee/${ci}`)
              .then(res => res.json())
                .then(data => {
                  setEmployee(data);
                  setIsLoading(false);
                })
                .catch(error => {
                  console.error('Error loading employee:', error);
                  setIsLoading(false);
                });
          }
      }, [ci]);

      useEffect(() => {
        if (employee && !isLoading) {
            fetch(`http://127.0.0.1:8000/employee_order/count_emp?EmpleadoCI=${employee.CI}`)
            .then(res => res.json())
            .then(data => setCantService(data))
            .catch(error => console.error('Error loading service count:', error));
            
            // Obtener especialidades del empleado
            fetch(`http://127.0.0.1:8000/employee_specialties?EmpleadoCI=${employee.CI}`)
            .then(res => res.json())
            .then(data => setEmployeeSpecialties(data))
            .catch(error => console.error('Error loading specialties:', error));
      }}
    , [employee, isLoading]);

      if (isLoading) {
        return (
          <SectionMain>
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando datos del empleado...</p>
              </div>
            </div>
          </SectionMain>
        );
      }

      if (!employee) {
        return (
          <SectionMain>
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <p className="text-gray-600">No se encontró información del empleado</p>
              </div>
            </div>
          </SectionMain>
        );
      }


  return (
    <>
      <SectionMain>
        <div className="max-w-4xl mx-auto">
          <SectionTitleLineWithButton
            icon={mdiBallotOutline}
            title={`${employee.CI} - ${employee.NombreCompleto}`}
            main
          >
            <Button
              href={`/dashboard/franchise/${rif}/employee`}
              color="info"
              label="Atras"
              roundedFull
            />
          </SectionTitleLineWithButton>

          <div className="flex justify-center mb-8">
            <CardBox className="w-full max-w-md bg-gradient-to-r from-gray-50 to-gray-100 shadow-sm border border-gray-200">
              <div className="text-center p-6">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Información Personal</h3>
                <p className="text-xl font-semibold text-gray-900">
                  {employee.NombreCompleto}
                </p>
              </div>
            </CardBox>
          </div>

          <Divider />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <CardBox className="bg-white shadow-sm border border-gray-200">
              <div className="p-6 text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Teléfono</h3>
                <div className="text-xl font-semibold text-gray-900">
                  {employee.Telefono}
                </div>
              </div>
            </CardBox>

            <CardBox className="bg-white shadow-sm border border-gray-200">
              <div className="p-6 text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Dirección</h3>
                <div className="text-lg font-semibold text-gray-900">
                  {employee.Direccion}
                </div>
              </div>
            </CardBox>

            <CardBox className="bg-white shadow-sm border border-gray-200">
              <div className="p-6 text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-3">CI</h3>
                <div className="text-xl font-semibold text-gray-900">
                  {employee.CI}
                </div>
              </div>
            </CardBox>
          </div>

          <Divider />

          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8">
            <CardBox className="w-full md:w-80 text-center bg-white shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Salario</h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  ${employee.Salario}
                </div>
              </div>
            </CardBox>

            <CardBox className="w-full md:w-80 text-center bg-white shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Órdenes Realizadas</h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  {cantservice}
                </div>
              </div>
            </CardBox>
          </div>

          <Divider />

          <div className="mb-8">
            <CardBox className="bg-white shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-700">Especialidades</h3>
                  <div className="ml-2 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V3a1 1 0 011-1h7a1 1 0 01.707.293l7 7z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                {employeeSpecialties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {employeeSpecialties.map((specialty, index) => (
                      <div
                        key={index}
                        className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-blue-800 font-medium">
                            {specialty.DescripcionEspecialidad}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">Este empleado no tiene especialidades registradas</p>
                  </div>
                )}
              </div>
            </CardBox>
          </div>
        </div>
      </SectionMain>
    </>
  );
}
