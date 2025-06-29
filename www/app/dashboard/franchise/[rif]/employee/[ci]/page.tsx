"use client";

import {
  mdiBallotOutline,
  mdiInformation,
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
  
  
      useEffect(() => {
          if (ci) {
          fetch(`http://127.0.0.1:8000/employee/${ci}`)
              .then(res => res.json())
              .then(data => setEmployee(data));
          }
      }, [ci]);

      useEffect(() => {
        if (employee) {
            fetch(`http://127.0.0.1:8000/employee_order/count_emp?EmpleadoCI=${employee.CI}`)
            .then(res => res.json())
            .then(data => setCantService(data));
      }}
    , [employee]);

      if (!employee) {
        return <div>Cargando datos del empleado...</div>;
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
        </div>
      </SectionMain>
    </>
  );
}
