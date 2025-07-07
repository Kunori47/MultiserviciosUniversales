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
  mdiPhone,
  mdiTag,
  mdiPlus,
  mdiTrashCan,
} from "@mdi/js";
import { Field, Form, Formik } from "formik";
import Button from "../../../../../_components/Button";
import Buttons from "../../../../../_components/Buttons";
import Divider from "../../../../../_components/Divider";
import CardBox from "../../../../../_components/CardBox";
import FormField from "../../../../../_components/FormField";
import CheckRadioGroup from "../../../../../_components/FormField/CheckRadioGroup";
import CheckRadio from "../../../../../_components/FormField/CheckRadio";
import SectionMain from "../../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../../_components/Section/TitleLineWithButton";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

type Specialty = { CodigoEspecialidad: number; DescripcionEspecialidad: string };

export default function EmployeeCreatePage() {

    const params = useParams();
    const rif = params?.rif as string;
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [specialtyRows, setSpecialtyRows] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetch('http://127.0.0.1:8000/specialty')
            .then(res => res.json())
            .then((data: Specialty[]) => {
                setSpecialties(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error loading specialties:', error);
                setIsLoading(false);
            });
    }, []);

    const addSpecialtyRow = () => {
        setSpecialtyRows([...specialtyRows, ""]);
    };

    const removeSpecialtyRow = (index: number) => {
        setSpecialtyRows(specialtyRows.filter((_, i) => i !== index));
    };

    const updateSpecialtyRow = (index: number, value: string) => {
        const updated = [...specialtyRows];
        updated[index] = value;
        setSpecialtyRows(updated);
    };

    const toggleSpecialty = (codigo: string) => {
        setSpecialtyRows(prev => 
            prev.includes(codigo) 
                ? prev.filter(s => s !== codigo)
                : [...prev, codigo]
        );
    };

    // Validación para CI y Teléfono
    const validateCI = (ci: string) => {
      if (!ci) return true;
      return ci.length === 10;
    };
    const validatePhone = (phone: string) => {
      if (!phone) return true;
      const digits = phone.replace(/\D/g, "");
      return digits.length === 11;
    };

  return (
    <>

      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiCreation}
          title="Crear Empleado"
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
              CI: "",
              NombreCompleto: "",
              Direccion: "",
              Telefono: "",
              Salario: "",
              Rol: "",
              CodigoEspecialidades: specialtyRows,
            }}
            onSubmit={async (values, { resetForm }) => {
                try {
                    if (!validateCI(values.CI)) {
                      alert("La cédula debe tener exactamente 10 caracteres");
                      return;
                    }
                    if (!validatePhone(values.Telefono)) {
                      alert("El teléfono debe tener exactamente 11 dígitos");
                      return;
                    }
                    if (specialtyRows.length === 0 || specialtyRows.filter(s => s).length === 0) {
                      alert("El empleado debe tener al menos una especialidad");
                      return;
                    }
                const res = await fetch("http://127.0.0.1:8000/employee/create", {
                    method: "POST",
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
                        Rol: "Empleado",
                    }),
                });
                if (!res.ok) {
                    throw new Error("Error al crear el empleado");
                }
                const data = await res.json();
                for (const codigo of specialtyRows) {
                  if (codigo) {
                  await fetch("http://127.0.0.1:8000/speciality_employee", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      EmpleadoCI: values.CI,
                        CodigoEspecialidad: parseInt(codigo),
                    }),
                  });
                  }
                }
                alert("Empleado creado correctamente");
                resetForm();
                setSpecialtyRows([]);
                } catch (err) {
                alert("Error: " + err.message);
                }
            }}
          >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-12 last:mb-0">
                <div>
                  <FormField label="CI" labelFor="CI" icon={mdiAccount}>
                    {({ className }) => (
                      <Field
                        name="CI"
                        id="CI"
                        placeholder="CI"
                        className={`${className} ${values.CI && !validateCI(values.CI) ? 'border-red-500' : ''}`}
                        required
                      />
                    )}
                  </FormField>
                  {values.CI && !validateCI(values.CI) && (
                    <p className="text-red-500 text-xs mt-1">La cédula debe tener exactamente 10 caracteres</p>
                  )}
                </div>
                <div>
                  <FormField label="NombreCompleto" labelFor="NombreCompleto" icon={mdiMail}>
                    {({ className }) => (
                      <Field
                        name="NombreCompleto"
                        id="NombreCompleto"
                        placeholder="Nombre Completo"
                        className={className}
                        required
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
                        placeholder="0412-1234567"
                        className={`${className} ${values.Telefono && !validatePhone(values.Telefono) ? 'border-red-500' : ''}`}
                        maxLength={12}
                        required
                        onChange={e => {
                          let val = e.target.value.replace(/[^0-9-]/g, "");
                          if (val.length === 4 && !val.includes("-")) val = val + "-";
                          setFieldValue("Telefono", val.slice(0, 12));
                        }}
                      />
                    )}
                  </FormField>
                  {values.Telefono && !validatePhone(values.Telefono) && (
                    <p className="text-red-500 text-xs mt-1">El teléfono debe tener exactamente 11 dígitos</p>
                  )}
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

                </div>

              <Divider />

              <div className="mb-12 last:mb-0">
                <div className="flex justify-between items-center mb-4">
                  <label className="block font-bold mb-2 px-1">Especialidades</label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={addSpecialtyRow}
                      color="success"
                      label="Agregar Especialidad"
                      icon={mdiPlus}
                      roundedFull
                      small
                    />
                    <Button
                      type="button"
                      href={`/dashboard/franchise/${rif}/employee/specialty/create`}
                      color="info"
                      label="Crear Nueva Especialidad"
                      icon={mdiTag}
                      roundedFull
                      small
                    />
                  </div>
                </div>
                {specialtyRows.length === 0 || specialtyRows.filter(s => s).length === 0 ? (
                  <p className="text-red-500 text-xs mb-2 ml-2">El empleado debe tener al menos una especialidad</p>
                ) : null}
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-gray-600">Cargando especialidades...</span>
                  </div>
                ) : (
                  <div className="border border-gray-600 rounded-lg overflow-x-auto">
                    <div className="grid grid-cols-12 gap-2 p-4 bg-gray-900 text-gray-100 font-semibold text-sm rounded-t-lg">
                      <div className="col-span-10">Especialidad *</div>
                      <div className="col-span-2 text-center">Acción</div>
                    </div>
                    {specialtyRows.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No hay especialidades agregadas</div>
                    ) : (
                      specialtyRows.map((selected, idx) => {
                        // Calcula las especialidades seleccionadas en otras filas
                        const selectedSpecialtyIds = specialtyRows
                          .map((val, i) => i !== idx ? val : null)
                          .filter((id) => id !== null && id !== "");
                        const availableSpecialties = specialties.filter(
                          (specialty) =>
                            !selectedSpecialtyIds.includes(String(specialty.CodigoEspecialidad)) ||
                            String(specialty.CodigoEspecialidad) === selected
                        );
                        return (
                          <div key={idx} className="grid grid-cols-12 gap-2 items-center p-4 border-t border-gray-700 bg-gray-800">
                            <div className="col-span-10">
                              <select
                                value={selected}
                                onChange={e => updateSpecialtyRow(idx, e.target.value)}
                                className="w-full border-2 border-gray-700 rounded-lg px-3 py-2 bg-gray-900 text-gray-100 focus:border-blue-500 focus:outline-none"
                              >
                                <option value="">Seleccione una especialidad</option>
                                {availableSpecialties.map(s => (
                                  <option key={s.CodigoEspecialidad} value={s.CodigoEspecialidad}>
                                    {s.DescripcionEspecialidad}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-span-2 flex justify-center">
                              <Button
                                type="button"
                                onClick={() => removeSpecialtyRow(idx)}
                                color="danger"
                                outline
                                icon={mdiTrashCan}
                                small
                                label="Eliminar"
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
                <Field
                  type="hidden"
                  name="CodigoEspecialidades"
                  value={specialtyRows.join(',')}
                />
                </div>

              <Divider />

              <Buttons>
                <Button type="submit" color="info" label="Agregar Empleado" isGrouped />
                <Button
                  type="reset"
                  color="info"
                  outline
                  label="Limpiar"
                  isGrouped
                />
              </Buttons>
            </Form>
          )}
          </Formik>
        </CardBox>
      </SectionMain>

    </>
  );
}
