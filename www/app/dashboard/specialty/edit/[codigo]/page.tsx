"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "../../../../_components/Button";
import CardBox from "../../../../_components/CardBox";
import Divider from "../../../../_components/Divider";
import SectionMain from "../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../_components/Section/TitleLineWithButton";
import { mdiTag, mdiArrowLeft, mdiContentSave } from "@mdi/js";
import { Field, Form, Formik } from "formik";

export default function SpecialtyEditPage() {
  const params = useParams();
  const router = useRouter();
  const codigo = params?.codigo as string;
  const [specialty, setSpecialty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (codigo) {
      fetch(`http://127.0.0.1:8000/specialty/${codigo}`)
        .then(res => res.json())
        .then(data => {
          setSpecialty(data);
          setLoading(false);
        });
    }
  }, [codigo]);

  if (loading || !specialty) {
    return (
      <SectionMain>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando especialidad...</p>
          </div>
        </div>
      </SectionMain>
    );
  }

  return (
    <SectionMain>
      <SectionTitleLineWithButton
        icon={mdiTag}
        title={`Editar Especialidad #${specialty.CodigoEspecialidad}`}
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
            DescripcionEspecialidad: specialty.DescripcionEspecialidad,
          }}
          enableReinitialize={true}
          onSubmit={async (values) => {
            try {
              const res = await fetch(`http://127.0.0.1:8000/specialty/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  CodigoEspecialidad: specialty.CodigoEspecialidad,
                  DescripcionEspecialidad: values.DescripcionEspecialidad,
                }),
              });
              if (!res.ok) throw new Error("Error al actualizar la especialidad");
              alert("Especialidad actualizada correctamente");
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
              <Button type="submit" color="success" label="Guardar Cambios" icon={mdiContentSave} />
              <Button type="button" color="info" outline label="Cancelar" onClick={() => router.push("/dashboard/specialty")} />
            </div>
          </Form>
        </Formik>
      </CardBox>
    </SectionMain>
  );
} 