"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Field, Form, Formik } from "formik";
import Button from "../../../../_components/Button";
import CardBox from "../../../../_components/CardBox";
import Divider from "../../../../_components/Divider";
import SectionMain from "../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../_components/Section/TitleLineWithButton";
import { mdiAccount, mdiArrowLeft, mdiContentSave, mdiPlus, mdiMinus, mdiPhone } from "@mdi/js";

export default function CustomerEditPage() {
  const router = useRouter();
  const params = useParams();
  const ci = params?.ci as string;
  const [customer, setCustomer] = useState<any>(null);
  const [phones, setPhones] = useState<string[]>([""]);
  const [existingPhones, setExistingPhones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ci) return;
    
    const fetchCustomerData = async () => {
      try {
        // Cargar datos del cliente
        const customerRes = await fetch(`http://127.0.0.1:8000/customer/${ci}`);
        const customerData = await customerRes.json();
        setCustomer(customerData);

        // Cargar teléfonos existentes
        const phonesRes = await fetch(`http://127.0.0.1:8000/customer_phone/${ci}`);
        const phonesData = await phonesRes.json();
        setExistingPhones(phonesData);
        
        // Inicializar teléfonos con los existentes
        if (phonesData.length > 0) {
          setPhones(phonesData.map((phone: any) => phone.Telefono));
        } else {
          setPhones([""]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [ci]);

  const addPhone = () => {
    setPhones([...phones, ""]);
  };

  const removePhone = (index: number) => {
    if (phones.length > 1) {
      setPhones(phones.filter((_, i) => i !== index));
    }
  };

  const updatePhone = (index: number, value: string) => {
    const updatedPhones = [...phones];
    updatedPhones[index] = value;
    setPhones(updatedPhones);
  };

  const validatePhone = (phone: string) => {
    if (!phone) return true; // Campo vacío es válido (opcional)
    const digits = phone.replace(/\D/g, "");
    return digits.length === 11;
  };

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
              // Validar teléfonos
              const validPhones = phones.filter(phone => phone.trim() !== "");
              const invalidPhones = validPhones.filter(phone => !validatePhone(phone));
              // Guardar teléfonos tal como los escribe el usuario
              const cleanedPhones = validPhones;
              if (invalidPhones.length > 0) {
                alert("Por favor ingrese teléfonos válidos (11 dígitos)");
                return;
              }

              // Actualizar cliente con teléfonos en una sola operación
              const customerData = {
                ...values,
                phones: cleanedPhones
              };

              const res = await fetch(`http://127.0.0.1:8000/customer/update_with_phones`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(customerData),
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

            {/* Sección de Teléfonos */}
            <Divider />
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <i className="mdi mdi-phone text-blue-600 mr-2"></i>
                  Teléfonos
                </h3>
                <Button
                  onClick={addPhone}
                  color="success"
                  outline
                  icon={mdiPlus}
                  label="Agregar Teléfono"
                  small
                />
              </div>
              
              <div className="space-y-3">
                {phones.map((phone, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono {index + 1}
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => {
                          // Permitir números y guiones, máximo 12 caracteres (ej: 0412-1234567)
                          let val = e.target.value.replace(/[^0-9-]/g, "");
                          if (val.length === 4 && !val.includes("-")) val = val + "-";
                          updatePhone(index, val.slice(0, 12));
                        }}
                        placeholder="0412-1234567"
                        maxLength={12}
                        className={`w-full border-2 rounded-lg px-3 py-2 ${
                          phone && !validatePhone(phone) 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:border-blue-500'
                        } focus:outline-none`}
                      />
                      {phone && !validatePhone(phone) && (
                        <p className="text-red-500 text-xs mt-1">
                          El teléfono debe tener exactamente 11 dígitos
                        </p>
                      )}
                    </div>
                    {phones.length > 1 && (
                      <div className="flex items-end">
                        <Button
                          onClick={() => removePhone(index)}
                          color="danger"
                          outline
                          icon={mdiMinus}
                          small
                          label=""
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-gray-500 mt-2">
                Los teléfonos son opcionales. Deben tener exactamente 11 dígitos (ej: 04121234567).
              </p>
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