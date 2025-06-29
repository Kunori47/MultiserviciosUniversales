"use client";

import { useRouter } from "next/navigation";
import Button from "../../../_components/Button";
import CardBox from "../../../_components/CardBox";
import Divider from "../../../_components/Divider";
import SectionMain from "../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../_components/Section/TitleLineWithButton";
import { mdiTag, mdiArrowLeft, mdiContentSave } from "@mdi/js";
import { Field, Form, Formik } from "formik";

export default function SpecialtyCreatePage() {
  const router = useRouter();

  return (
    <SectionMain>
      <SectionTitleLineWithButton
        icon={mdiTag}
        title="Crear Nueva Especialidad"
        main
      >
        <Button
          href="/dashboard/specialty"
          color="info"
          label="Atras"
          icon={mdiArrowLeft}
          roundedFull
        />
      </SectionTitleLineWithButton>
      <Divider />
      <CardBox>
        <Formik
          initialValues={{
            DescripcionEspecialidad: "",
          }}
          onSubmit={async (values, { resetForm }) => {
            try {
              const res = await fetch(`http://127.0.0.1:8000/specialty/create?Descripcion=${values.DescripcionEspecialidad}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values.DescripcionEspecialidad),
              });
              if (!res.ok) throw new Error("Error al crear la especialidad");
              alert("Especialidad creada correctamente");
              resetForm();
              router.push("/dashboard/specialty");
            } catch (err) {
              alert("Error: " + err.message);
            }
          }}
        >
          <Form>
            <div className="mb-8">
              <label className="block font-bold mb-2">Descripción de la Especialidad</label>
              <Field
                name="DescripcionEspecialidad"
                id="DescripcionEspecialidad"
                placeholder="Descripción de la Especialidad"
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <Divider />
            <div className="flex gap-2">
              <Button type="submit" color="success" label="Crear Especialidad" icon={mdiContentSave} />
              <Button type="button" color="info" outline label="Cancelar" onClick={() => router.push("/dashboard/specialty")} />
            </div>
          </Form>
        </Formik>
      </CardBox>
    </SectionMain>
  );
} 