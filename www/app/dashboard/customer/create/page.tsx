"use client";

import { useRouter } from "next/navigation";
import { Field, Form, Formik } from "formik";
import Button from "../../../_components/Button";
import CardBox from "../../../_components/CardBox";
import Divider from "../../../_components/Divider";
import SectionMain from "../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../_components/Section/TitleLineWithButton";
import { mdiAccount, mdiArrowLeft, mdiContentSave } from "@mdi/js";

export default function CustomerCreatePage() {
  const router = useRouter();

  return (
    <SectionMain>
      <SectionTitleLineWithButton
        icon={mdiAccount}
        title="Crear Nuevo Cliente"
        main
      >
        <Button
          href="/dashboard/customer"
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
            CI: "",
            NombreCompleto: "",
            Email: "",
          }}
          onSubmit={async (values, { resetForm }) => {
            try {
              const res = await fetch(`http://127.0.0.1:8000/customer/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
              });
              if (!res.ok) throw new Error("Error al crear el cliente");
              alert("Cliente creado correctamente");
              resetForm();
              router.push("/dashboard/customer");
            } catch (err) {
              alert("Error: " + (err instanceof Error ? err.message : err));
            }
          }}
        >
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block font-bold mb-2">Cédula</label>
                <Field name="CI" id="CI" className="w-full border-2 border-gray-300 rounded-lg px-3 py-2" required />
              </div>
              <div>
                <label className="block font-bold mb-2">Nombre Completo</label>
                <Field name="NombreCompleto" id="NombreCompleto" className="w-full border-2 border-gray-300 rounded-lg px-3 py-2" required />
              </div>
              <div className="md:col-span-2">
                <label className="block font-bold mb-2">Email</label>
                <Field name="Email" id="Email" type="email" className="w-full border-2 border-gray-300 rounded-lg px-3 py-2" required />
              </div>
            </div>
            <Divider />
            <div className="flex gap-2">
              <Button type="submit" color="success" label="Crear Cliente" icon={mdiContentSave} />
              <Button type="button" color="info" outline label="Cancelar" onClick={() => router.push("/dashboard/customer")} />
            </div>
          </Form>
        </Formik>
      </CardBox>
    </SectionMain>
  );
} 