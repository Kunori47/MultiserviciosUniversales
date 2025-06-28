"use client";

import {
  mdiBallotOutline,
  mdiInformation,
} from "@mdi/js";
import Button from "../../../_components/Button";
import Divider from "../../../_components/Divider";
import CardBox from "../../../_components/CardBox";
import SectionMain from "../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../_components/Section/TitleLineWithButton";
import FieldLabel from "../../../_components/FormField/FieldLabel";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function InfoPage() {

      const params = useParams();
      const rif = params?.rif as string;
      const [franchise, setFranchise] = useState<any>(null);
      const [encargado, setEncargado] = useState<any>(null);
      const [cantemployee, setCantEmployee] = useState<any>(null);
      const [fecha, setFecha] = useState<Date | null>(new Date());
      const [infofranq, setInfoFranq] = useState<any>(null);
      const [countproduct, setCountProduct] = useState<any>(null);
      const [countfranq, setCountFranq] = useState<any>(null);
      
  
  
      useEffect(() => {
          if (rif) {
          fetch(`http://127.0.0.1:8000/franchise/${rif}`)
              .then(res => res.json())
              .then(data => setFranchise(data));
          }
      }, [rif]);

      useEffect(() =>{
        if(franchise){
          fetch(`http://127.0.0.1:8000/employee/${franchise.CI_Encargado}`)
          .then(res => res.json())
          .then(data => setEncargado(data));
        }
      }, [franchise])

      useEffect(() => {
        if(franchise){
          fetch(`http://127.0.0.1:8000/employee/franchise/${rif}/count`)
          .then(res => res.json())
          .then(data => setCantEmployee(data));

        }


      }, [franchise, rif])

      useEffect(() => {
        if (fecha && franchise) {
          const mes = fecha.getMonth() + 1;
          const anio = fecha.getFullYear();
          fetch(`http://127.0.0.1:8000/views/remenfranq?FranquiciaRIF=${rif}&Anio=${anio}&Mes=${mes}`)
            .then(res => res.json())
            .then(data => setInfoFranq(data));
        }
      }, [fecha, franchise, rif]);

      useEffect(() =>{
        if(franchise){

          fetch(`http://127.0.0.1:8000/product_franchise/count_products`)
          .then(res => res.json())
          .then(data => setCountProduct(data))

        }
      }, [franchise, rif])

      console.log(countproduct);

      useEffect(() =>{
        if(franchise){

          fetch(`http://127.0.0.1:8000/product_franchise/count_products_by_franchise?FranquiciaRIF=${rif}`)
          .then(res => res.json())
          .then(data => setCountFranq(data))

        }
      }, [franchise, rif])

  
      if (!franchise) {
        return <div>Cargando datos de la franquicia...</div>;
      }
      const handleChange = (date) => {
          setFecha(date);
        };
  return (
    <>

      <SectionMain>

        <SectionTitleLineWithButton
          icon={mdiBallotOutline}
          title={`${franchise.RIF} - ${franchise.Nombre} - ${franchise.Ciudad}`}
          main
        >
          
          <p>Encargado: {encargado ? encargado.NombreCompleto : "Cargando encargado..."}</p>

          <Button
            href="/dashboard/franchise"
            color="info"
            label="Atras"
            roundedFull
          />
        </SectionTitleLineWithButton>

        <Divider />

        <div className="flex justify-center gap-40">
          <CardBox>
              <FieldLabel>Cantidad de empleados: {cantemployee} &nbsp;
                  <Button
                    type="reset"
                    color="info"
                    href={`/dashboard/franchise/${rif}/employee`}
                    outline
                    icon={mdiInformation}
                    isGrouped
                  />
              </FieldLabel>
          </CardBox>

          <CardBox>
              <FieldLabel>Inventario: {countfranq} / {countproduct} &nbsp;
                  <Button
                    type="reset"
                    color="info"
                    outline
                    icon={mdiInformation}
                    isGrouped
                  />
              </FieldLabel>
          </CardBox>
        </div>

        <Divider />
        
        <CardBox>
              <DatePicker
                selected={fecha}
                onChange={handleChange}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                placeholderText="Selecciona mes y año"
              />
          <Divider />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 mb-6 last:mb-0">
            <FieldLabel>Servicios Realizados: {infofranq && infofranq.length > 0 ? infofranq[0].CantidadOrdenes : "Sin datos"} &nbsp;
                <Button
                  type="reset"
                  color="info"
                  outline
                  icon={mdiInformation}
                  isGrouped
                />
            </FieldLabel>

            <FieldLabel>Dinero Generado: {infofranq && infofranq.length > 0 ? infofranq[0].MontoGenerado : "Sin datos"} &nbsp;
                <Button
                  type="reset"
                  color="info"
                  outline
                  icon={mdiInformation}
                  isGrouped
                />
            </FieldLabel>

            <FieldLabel>Gasto Total: {infofranq && infofranq.length > 0 ? infofranq[0].GastoTotal : "Sin datos"} &nbsp;
                <Button
                  type="reset"
                  color="info"
                  outline
                  icon={mdiInformation}
                  isGrouped
                />
            </FieldLabel>
          </div>
        </CardBox>
      
      </SectionMain>
    </>
  );
}
