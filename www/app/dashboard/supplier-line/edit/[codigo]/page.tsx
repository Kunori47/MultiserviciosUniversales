"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "../../../../_components/Button";
import CardBox from "../../../../_components/CardBox";
import Divider from "../../../../_components/Divider";
import SectionMain from "../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../_components/Section/TitleLineWithButton";
import { mdiPackageVariant, mdiArrowLeft, mdiContentSave } from "@mdi/js";
import { Field, Form, Formik } from "formik";

export default function SupplierLineEditPage() {
  const params = useParams();
  const router = useRouter();
  const codigo = params?.codigo as string;
  const [line, setLine] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (codigo) {
      fetch(`http://127.0.0.1:8000/supplier_line/${codigo}`)
        .then(res => res.json())
        .then(data => {
          setLine(data);
          setLoading(false);
        });
    }
  }, [codigo]);

  if (loading || !line) {
    return (
      <SectionMain>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando línea de suministro...</p>
          </div>
        </div>
      </SectionMain>
    );
  }

  return (
    <SectionMain>
      <SectionTitleLineWithButton
        icon={mdiPackageVariant}
        title={`Editar Línea de Suministro #${line.CodigoLinea}`}
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
            DescripcionLinea: line.DescripcionLinea,
          }}
          enableReinitialize={true}
          onSubmit={async (values) => {
            try {
              const res = await fetch(`http://127.0.0.1:8000/supplier_line/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  CodigoLinea: line.CodigoLinea,
                  DescripcionLinea: values.DescripcionLinea,
                }),
              });
              if (!res.ok) throw new Error("Error al actualizar la línea de suministro");
              alert("Línea de suministro actualizada correctamente");
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
              <Button type="submit" color="success" label="Guardar Cambios" icon={mdiContentSave} />
              <Button type="button" color="info" outline label="Cancelar" onClick={() => router.push("/dashboard/supplier-line")} />
            </div>
          </Form>
        </Formik>
      </CardBox>
    </SectionMain>
  );
} 