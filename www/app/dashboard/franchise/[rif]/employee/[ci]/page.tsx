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


export default function InfoPage() {

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

        <SectionTitleLineWithButton
          icon={mdiBallotOutline}
          title={`${employee.CI}`}
          main
        >
            <Button
                href={`/dashboard/franchise/${rif}/employee`}
                color="info"
                label="Atras"
                roundedFull
            />            

        </SectionTitleLineWithButton>

        <Divider />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 mb-6 last:mb-0">
            <CardBox>
                <FieldLabel>Nombre: {employee.NombreCompleto} &nbsp;
                </FieldLabel>
            </CardBox>

            <CardBox>
                <FieldLabel>Telefono: {employee.Telefono} &nbsp;
                </FieldLabel>
            </CardBox>

            <CardBox>
                <FieldLabel>Telefono: {employee.Direccion} &nbsp;
                </FieldLabel>
            </CardBox>


          
        </div>

        <Divider />

        <div className="flex justify-center gap-40">
            <CardBox>
                <FieldLabel>Salario: {employee.Salario} &nbsp;
                </FieldLabel>
            </CardBox>

            <CardBox>
                <FieldLabel>Ordenes Realizadas: {cantservice} &nbsp;
                </FieldLabel>
            </CardBox>
          
        </div>
        
     
      
      </SectionMain>
    </>
  );
}
