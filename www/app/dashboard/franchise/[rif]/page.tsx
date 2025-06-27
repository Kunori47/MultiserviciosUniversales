"use client";

import {
  mdiAccount,
  mdiBackspace,
  mdiBallotOutline,
  mdiGithub,
  mdiInformation,
  mdiMail,
  mdiUpload,
} from "@mdi/js";
import { Field, Form, Formik } from "formik";
import Button from "../../../_components/Button";
import Buttons from "../../../_components/Buttons";
import Divider from "../../../_components/Divider";
import CardBox from "../../../_components/CardBox";
import FormCheckRadio from "../../../_components/FormField/CheckRadio";
import FormCheckRadioGroup from "../../../_components/FormField/CheckRadioGroup";
import FormField from "../../../_components/FormField";
import FormFilePicker from "../../../_components/FormField/FilePicker";
import SectionMain from "../../../_components/Section/Main";
import SectionTitle from "../../../_components/Section/Title";
import SectionTitleLineWithButton from "../../../_components/Section/TitleLineWithButton";
import FieldLabel from "../../../_components/FormField/FieldLabel";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchEmployeeNameByFranchise } from "../../_lib/db";


export default function InfoPage() {

      const params = useParams();
      const rif = params?.rif as string;
      const [franchise, setFranchise] = useState<any>(null);
      const [encargado, setEncargado] = useState<any>(null);
      const [cantemployee, setCantEmployee] = useState<any>(null);
      
  
  
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

      



  
      if (!franchise) {
        return <div>Cargando datos de la franquicia...</div>;
      }
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

        <CardBox>
           <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-6 last:mb-0">
            <FieldLabel>Cantidad de empleados: &nbsp;
                <Button
                  type="reset"
                  color="info"
                  outline
                  icon={mdiInformation}
                  isGrouped
                />
            </FieldLabel>
            <FieldLabel>Cantidad de empleados: </FieldLabel>
          </div>
        </CardBox>
      </SectionMain>

      <SectionTitle>Custom elements</SectionTitle>

      <SectionMain>
        <CardBox>
          <Formik
            initialValues={{
              checkboxes: ["lorem"],
              switches: ["lorem"],
              radio: "lorem",
            }}
            onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
          >
            <Form>
              <FieldLabel>Checkbox</FieldLabel>
              <FormCheckRadioGroup>
                <FormCheckRadio type="checkbox" label="Lorem" isGrouped>
                  <Field type="checkbox" name="checkboxes" value="lorem" />
                </FormCheckRadio>
                <FormCheckRadio type="checkbox" label="Ipsum" isGrouped>
                  <Field type="checkbox" name="checkboxes" value="ipsum" />
                </FormCheckRadio>
                <FormCheckRadio type="checkbox" label="Dolore" isGrouped>
                  <Field type="checkbox" name="checkboxes" value="dolore" />
                </FormCheckRadio>
              </FormCheckRadioGroup>

              <Divider />

              <FieldLabel>Radio</FieldLabel>

              <FormCheckRadioGroup>
                <FormCheckRadio type="radio" label="Lorem" isGrouped>
                  <Field type="radio" name="radio" value="lorem" />
                </FormCheckRadio>
                <FormCheckRadio type="radio" label="Ipsum" isGrouped>
                  <Field type="radio" name="radio" value="ipsum" />
                </FormCheckRadio>
              </FormCheckRadioGroup>

              <Divider />

              <FieldLabel>Switch</FieldLabel>

              <FormCheckRadioGroup>
                <FormCheckRadio type="switch" label="Lorem" isGrouped>
                  <Field type="checkbox" name="switches" value="lorem" />
                </FormCheckRadio>
                <FormCheckRadio type="switch" label="Ipsum" isGrouped>
                  <Field type="checkbox" name="switches" value="ipsum" />
                </FormCheckRadio>
              </FormCheckRadioGroup>

              <Divider />

              <Buttons>
                <Button type="submit" color="info" label="Submit" isGrouped />
                <Button
                  type="reset"
                  color="info"
                  outline
                  label="Reset"
                  isGrouped
                />
              </Buttons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>

      <SectionMain>
        <CardBox>
          <FormFilePicker label="Upload" color="info" icon={mdiUpload} />
        </CardBox>
      </SectionMain>
    </>
  );
}
