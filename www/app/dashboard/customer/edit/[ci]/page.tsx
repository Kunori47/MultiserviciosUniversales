"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Field, Form, Formik } from "formik";
import Button from "../../../../_components/Button";
import CardBox from "../../../../_components/CardBox";
import Divider from "../../../../_components/Divider";
import SectionMain from "../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../_components/Section/TitleLineWithButton";
import { mdiAccount, mdiArrowLeft, mdiContentSave } from "@mdi/js";

export default function CustomerEditPage() {
  const router = useRouter();
  const params = useParams();
  const ci = params?.ci as string;
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ci) return;
    fetch(`http://127.0.0.1:8000/customer/${ci}`)
      .then(res => res.json())
      .then(data => {
        setCustomer(data);
        setLoading(false);
      });
  }, [ci]);

  if (loading || !customer) {
    return (
      <SectionMain>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Cargando cliente...</span>
        </div>
      </SectionMain>
    );
  }

  return (
    <SectionMain>
      <SectionTitleLineWithButton
        icon={mdiAccount}
        title={`Editar Cliente: ${customer.NombreCompleto}`}
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
          enableReinitialize
          initialValues={{
            CI: customer.CI,
            NombreCompleto: customer.NombreCompleto,
            Email: customer.Email,
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const res = await fetch(`http://127.0.0.1:8000/customer/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
              });
              if (!res.ok) throw new Error("Error al actualizar el cliente");
              alert("Cliente actualizado correctamente");
              router.push("/dashboard/customer");
            } catch (err) {
              alert("Error: " + (err instanceof Error ? err.message : err));
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block font-bold mb-2">Cédula</label>
                <Field name="CI" id="CI" className="w-full border-2 border-gray-300 rounded-lg px-3 py-2" required disabled />
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
              <Button type="submit" color="success" label="Guardar Cambios" icon={mdiContentSave} />
              <Button type="button" color="info" outline label="Cancelar" onClick={() => router.push("/dashboard/customer")} />
            </div>
          </Form>
        </Formik>
      </CardBox>
    </SectionMain>
  );
} 