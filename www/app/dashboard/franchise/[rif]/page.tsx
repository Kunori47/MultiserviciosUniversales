"use client";

import {
  mdiBallotOutline,
  mdiInformation,
  mdiPackage,
  mdiWrench,
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
      const [services, setServices] = useState<any[]>([]);
      
  
  
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

      useEffect(() =>{
        if(franchise){

          fetch(`http://127.0.0.1:8000/service/franchise/${rif}`)
          .then(res => res.json())
          .then(data => setServices(data))

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
        <div className="max-w-4xl mx-auto">
          <SectionTitleLineWithButton
            icon={mdiBallotOutline}
            title={`${franchise.RIF} - ${franchise.Nombre} - ${franchise.Ciudad}`}
            main
          >
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Encargado: {encargado ? encargado.NombreCompleto : "Cargando encargado..."}
              </p>
              <Button
                href="/dashboard/franchise"
                color="info"
                label="Atras"
                roundedFull
              />
            </div>
          </SectionTitleLineWithButton>

          <Divider />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <CardBox className="text-center bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-800 mb-3">Empleados</h3>
                <div className="text-4xl font-extrabold text-blue-600 mb-4">
                  {cantemployee || "0"}
                </div>
                <Button
                  type="reset"
                  color="info"
                  href={`/dashboard/franchise/${rif}/employee`}
                  outline
                  icon={mdiInformation}
                  isGrouped
                  label="Ver Empleados"
                />
              </div>
            </CardBox>

            <CardBox className="text-center bg-gradient-to-br from-green-50 to-green-100 shadow-lg">
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-800 mb-3">Inventario</h3>
                <div className="text-4xl font-extrabold text-green-600 mb-2">
                  {countfranq || "0"}
                </div>
                <div className="text-lg text-gray-600 mb-4">
                  de {countproduct || "0"} productos
                </div>
                <Button
                  type="reset"
                  color="success"
                  href={`/dashboard/franchise/${rif}/inventory`}
                  outline
                  icon={mdiInformation}
                  isGrouped
                  label="Ver Inventario"
                />
              </div>
            </CardBox>

            <CardBox className="text-center bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg">
              <div className="p-6">
                <h3 className="text-xl font-bold text-purple-800 mb-3">Servicios</h3>
                <div className="text-4xl font-extrabold text-purple-600 mb-2">
                  {services.length || "0"}
                </div>
                <div className="text-lg text-gray-600 mb-4">
                  servicios ofrecidos
                </div>
                <Button
                  type="reset"
                  color="contrast"
                  href={`/dashboard/franchise/${rif}/services`}
                  outline
                  icon={mdiWrench}
                  isGrouped
                  label="Ver Servicios"
                />
              </div>
            </CardBox>
          </div>

          <Divider />
          
          <CardBox className="bg-white shadow-xl rounded-xl">
            <div className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Estadísticas Mensuales</h3>
                <div className="flex justify-center">
                  <DatePicker
                    selected={fecha}
                    onChange={handleChange}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    placeholderText="Selecciona mes y año"
                    className="border-2 border-gray-300 rounded-lg px-4 py-2 text-center focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <Divider />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-6 bg-blue-50 rounded-xl shadow-md">
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">Servicios Realizados</h4>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {infofranq && infofranq.length > 0 ? infofranq[0].CantidadOrdenes : "0"}
                  </div>
                  <Button
                    type="reset"
                    color="info"
                    outline
                    icon={mdiInformation}
                    isGrouped
                    small
                    href={`/dashboard/franchise/${rif}/orders`}
                    label="Ver Historial"
                  />
                </div>

                <div className="text-center p-6 bg-green-50 rounded-xl shadow-md">
                  <h4 className="text-lg font-semibold text-green-800 mb-3">Dinero Generado</h4>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ${infofranq && infofranq.length > 0 ? infofranq[0].MontoGenerado : "0"}
                  </div>
                  <Button
                    type="reset"
                    color="success"
                    outline
                    icon={mdiInformation}
                    isGrouped
                    small
                    href={`/dashboard/franchise/${rif}/profitability`}
                    label="Ver Análisis"
                  />
                </div>

                <div className="text-center p-6 bg-red-50 rounded-xl shadow-md">
                  <h4 className="text-lg font-semibold text-red-800 mb-3">Gastos en compras</h4>
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    ${infofranq && infofranq.length > 0 ? infofranq[0].GastoTotal : "0"}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      type="reset"
                      color="danger"
                      outline
                      icon={mdiInformation}
                      isGrouped
                      small
                      href={`/dashboard/franchise/${rif}/revenue`}
                      label="Ver Detalles"
                    />
                    <Button
                      type="reset"
                      color="success"
                      outline
                      icon={mdiPackage}
                      isGrouped
                      small
                      href={`/dashboard/franchise/${rif}/purchase/create`}
                      label="Registrar Compra"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardBox>
        </div>
      </SectionMain>
    </>
  );
}
