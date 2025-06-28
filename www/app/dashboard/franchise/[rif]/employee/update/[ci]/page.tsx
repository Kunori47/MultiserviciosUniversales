"use client";

import {
  mdiAccount,
  mdiBallotOutline,
  mdiBank,
  mdiCalendar,
  mdiCity,
  mdiCreation,
  mdiDirections,
  mdiEarbuds,
  mdiIdentifier,
  mdiMail,
  mdiNoteEdit,
  mdiPhone,
} from "@mdi/js";
import { Field, Form, Formik } from "formik";
import Button from "../../../../../../_components/Button";
import Buttons from "../../../../../../_components/Buttons";
import Divider from "../../../../../../_components/Divider";
import CardBox from "../../../../../../_components/CardBox";
import FormField from "../../../../../../_components/FormField";
import SectionMain from "../../../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../../../_components/Section/TitleLineWithButton";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EmployeeUpdatePage() {

    const params = useParams();
    const rif = params?.rif as string;
    const ci = params?.ci as string;
    const [employee, setEmployee] = useState({} as any);

    useEffect(() => {
        if (ci) {
          fetch(`http://127.0.0.1:8000/employee/${ci}`)
              .then(res => res.json())
              .then(data => setEmployee(data));
          }
    }, [ci]);

    if (!employee) {
      return <div>Cargando datos de la franquicia...</div>;
    }

  return (
    <>

      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiNoteEdit}
          title="Modificar Empleado"
          main
        >
        <Button
            href={`/dashboard/franchise/${rif}/employee`}
            color="info"
            label="Atras"
            roundedFull
        />
            
        </SectionTitleLineWithButton>

        <CardBox>
          <Formik
            initialValues={{
              CI: employee.CI,
              NombreCompleto: employee.NombreCompleto,
              Direccion: employee.Direccion,
              Telefono: employee.Telefono,
              Salario: employee.Salario,
              Rol: employee.Rol,
            }}
            enableReinitialize={true}
            onSubmit={async (values, { resetForm }) => {
                try {
                const res = await fetch("http://127.0.0.1:8000/employee/update", {
                    method: "PUT",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        CI: values.CI,
                        NombreCompleto: values.NombreCompleto,
                        Direccion: values.Direccion,
                        Telefono: values.Telefono,
                        Salario: values.Salario,
                        FranquiciaRIF: rif,
                        Rol: values.Rol,
                    }),
                });
                if (!res.ok) {
                    throw new Error("Error al actualizar el empleado");
                }
                const data = await res.json();
                alert("Empleado actualizado correctamente");
                resetForm();
                } catch (err) {
                alert("Error: " + err.message);
                }
            }}
          >
            <Form>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-12 last:mb-0">
                <div>
                  <FormField label="CI" labelFor="CI" icon={mdiAccount}>
                    {({ className }) => (
                      <Field
                        name="CI"
                        id="CI"
                        placeholder="CI"
                        className={`${className} bg-gray-100 text-gray-400 font-semibold`}
                        required
                        readOnly
                      />
                    )}
                  </FormField>
                </div>
                <div>
                  <FormField label="NombreCompleto" labelFor="NombreCompleto" icon={mdiMail}>
                    {({ className }) => (
                      <Field
                        name="NombreCompleto"
                        id="NombreCompleto"
                        placeholder="Nombre Completo"
                        className={`${className} bg-gray-100 text-gray-400 font-semibold`}
                        required
                        readOnly
                      />
                    )}
                    </FormField>
                </div>
              </div>

              <Divider />

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-12 last:mb-0">
                <div>                  
                  <FormField
                    label="Direccion"
                    labelFor="Direccion"
                    icon={mdiDirections}
                    >
                    {({ className }) => (
                    <Field
                        name="Direccion"
                        placeholder="Direccion"
                        id="Direccion"
                        className={className}
                        required
                    />
                    )}
                </FormField>
                </div>
                <div>
                    <FormField label="Telefono" labelFor="Telefono" icon={mdiPhone}>
                    {({ className }) => (
                    <Field
                        name="Telefono"
                        id="Telefono"
                        className={className}
                        placeholder="Telefono"
                        required
                    />
                    )}
                </FormField>
              </div>
              </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-12 last:mb-0">
                    <FormField label="Salario" labelFor="Salario" icon={mdiBank}>
                        {({ className }) => (
                        <Field
                            name="Salario"
                            id="Salario"
                            placeholder="Salario"
                            className={className}
                            required
                        />
                        )}
                    </FormField>
                    <FormField label="Rol" labelFor="Rol" icon={mdiIdentifier}>
                        {({ className }) => (
                        <Field
                            name="Rol"
                            id="Rol"
                            component="select"
                            className={className}
                            required
                        >
                            <option value="Encargado">Encargado</option>

                            <option value="Empleado">Empleado</option>
                            <option value="Mecánico">Mecánico</option>

                        </Field>
                        )}
                    </FormField>
                </div>

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

    </>
  );
}
