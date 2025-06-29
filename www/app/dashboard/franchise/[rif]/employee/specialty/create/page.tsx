"use client";

import {
  mdiCreation,
  mdiTag,
  mdiArrowLeft,
} from "@mdi/js";
import { Field, Form, Formik } from "formik";
import Button from "../../../../../../_components/Button";
import Buttons from "../../../../../../_components/Buttons";
import Divider from "../../../../../../_components/Divider";
import CardBox from "../../../../../../_components/CardBox";
import FormField from "../../../../../../_components/FormField";
import SectionMain from "../../../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../../../_components/Section/TitleLineWithButton";
import { useParams, useRouter } from "next/navigation";

export default function SpecialtyCreatePage() {
  const params = useParams();
  const rif = params?.rif as string;
  const router = useRouter();

  return (
    <>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiCreation}
          title="Crear Nueva Especialidad"
          main
        >
          <Button
            href={`/dashboard/franchise/${rif}/employee/create`}
            color="info"
            label="Atras"
            icon={mdiArrowLeft}
            roundedFull
          />
        </SectionTitleLineWithButton>

        <CardBox>
          <Formik
            initialValues={{
              DescripcionEspecialidad: "",
            }}
            onSubmit={async (values, { resetForm }) => {
              try {
                const res = await fetch("http://127.0.0.1:8000/specialty/create?Descripcion=" + values.DescripcionEspecialidad, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(values.DescripcionEspecialidad),
                });
                
                if (!res.ok) {
                  throw new Error("Error al crear la especialidad");
                }
                
                alert("Especialidad creada correctamente");
                resetForm();
                // Redirigir de vuelta al formulario de crear empleado
                router.push(`/dashboard/franchise/${rif}/employee/create`);
              } catch (err) {
                alert("Error: " + err.message);
              }
            }}
          >
            <Form>
              <div className="mb-12 last:mb-0">
                <FormField label="Descripción de la Especialidad" labelFor="DescripcionEspecialidad" icon={mdiTag}>
                  {({ className }) => (
                    <Field
                      name="DescripcionEspecialidad"
                      id="DescripcionEspecialidad"
                      placeholder="Descripción de la Especialidad"
                      className={className}
                      required
                    />
                  )}
                </FormField>
              </div>

              <Divider />

              <Buttons>
                <Button type="submit" color="success" label="Crear Especialidad" isGrouped />
                <Button
                  type="reset"
                  color="info"
                  outline
                  label="Limpiar"
                  isGrouped
                />
              </Buttons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
} 