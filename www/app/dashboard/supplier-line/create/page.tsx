"use client";

import { useRouter } from "next/navigation";
import Button from "../../../_components/Button";
import CardBox from "../../../_components/CardBox";
import Divider from "../../../_components/Divider";
import SectionMain from "../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../_components/Section/TitleLineWithButton";
import { mdiPackageVariant, mdiArrowLeft, mdiContentSave } from "@mdi/js";
import { Field, Form, Formik } from "formik";

export default function SupplierLineCreatePage() {
  const router = useRouter();

  return (
    <SectionMain>
      <SectionTitleLineWithButton
        icon={mdiPackageVariant}
        title="Crear Nueva Línea de Suministro"
        main
      >
        <Button
          href="/dashboard/supplier-line"
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
            DescripcionLinea: "",
          }}
          onSubmit={async (values, { resetForm }) => {
            try {
              const res = await fetch(`http://127.0.0.1:8000/supplier_line/create?DescripcionLinea=${values.DescripcionLinea}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values.DescripcionLinea),
              });
              if (!res.ok) throw new Error("Error al crear la línea de suministro");
              alert("Línea de suministro creada correctamente");
              resetForm();
              router.push("/dashboard/supplier-line");
            } catch (err) {
              alert("Error: " + err.message);
            }
          }}
        >
          <Form>
            <div className="mb-8">
              <label className="block font-bold mb-2">Descripción de la Línea de Suministro</label>
              <Field
                name="DescripcionLinea"
                id="DescripcionLinea"
                placeholder="Descripción de la Línea"
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <Divider />
            <div className="flex gap-2">
              <Button type="submit" color="success" label="Crear Línea" icon={mdiContentSave} />
              <Button type="button" color="info" outline label="Cancelar" onClick={() => router.push("/dashboard/supplier-line")} />
            </div>
          </Form>
        </Formik>
      </CardBox>
    </SectionMain>
  );
} 