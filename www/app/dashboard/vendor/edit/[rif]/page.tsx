"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "../../../../_components/Button";
import CardBox from "../../../../_components/CardBox";
import Divider from "../../../../_components/Divider";
import SectionMain from "../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../_components/Section/TitleLineWithButton";
import { mdiTruck, mdiArrowLeft, mdiContentSave, mdiPlus, mdiTrashCan } from "@mdi/js";
import { Field, Form, Formik } from "formik";

export default function VendorEditPage() {
  const router = useRouter();
  const params = useParams();
  const rif = params?.rif as string;
  const [vendor, setVendor] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [supplyRows, setSupplyRows] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    if (!rif) return;
    // Cargar datos del proveedor
    fetch(`http://127.0.0.1:8000/vendor/${rif}`)
      .then(res => res.json())
      .then(data => {
        setVendor(data);
        setLoading(false);
      });
    // Cargar productos
    fetch("http://127.0.0.1:8000/product")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoadingProducts(false);
      });
    // Cargar productos que suministra
    fetch(`http://127.0.0.1:8000/supply/vendor/${rif}`)
      .then(res => res.json())
      .then(data => {
        setSupplyRows(data.map((p: any) => String(p.CodigoProducto)));
      });
  }, [rif]);

  const addSupplyRow = () => setSupplyRows([...supplyRows, ""]);
  const removeSupplyRow = (idx: number) => setSupplyRows(supplyRows.filter((_, i) => i !== idx));
  const updateSupplyRow = (idx: number, value: string) => {
    const updated = [...supplyRows];
    updated[idx] = value;
    setSupplyRows(updated);
  };

  if (loading || !vendor) {
    return (
      <SectionMain>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Cargando proveedor...</span>
        </div>
      </SectionMain>
    );
  }

  return (
    <SectionMain>
      <SectionTitleLineWithButton
        icon={mdiTruck}
        title={`Editar Proveedor: ${vendor.RazonSocial}`}
        main
      >
        <Button
          href={`/dashboard/vendor/${rif}`}
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
            RIF: vendor.RIF,
            RazonSocial: vendor.RazonSocial,
            Direccion: vendor.Direccion,
            TelefonoLocal: vendor.TelefonoLocal,
            TelefonoCelular: vendor.TelefonoCelular,
            PersonaContacto: vendor.PersonaContacto,
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              // Actualizar proveedor
              const res = await fetch(`http://127.0.0.1:8000/vendor/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
              });
              if (!res.ok) throw new Error("Error al actualizar el proveedor");
              // Obtener productos actuales
              const currentRes = await fetch(`http://127.0.0.1:8000/supply/vendor/${rif}`);
              const currentProducts = currentRes.ok ? await currentRes.json() : [];
              const currentIds = currentProducts.map((p: any) => String(p.CodigoProducto));
              // Eliminar suministros removidos
              for (const codigo of currentIds) {
                if (!supplyRows.includes(codigo)) {
                  await fetch(`http://127.0.0.1:8000/supply/delete?ProveedorRIF=${rif}&CodigoProducto=${codigo}`, {
                    method: "DELETE"
                  });
                }
              }
              // Agregar nuevos suministros
              for (const codigo of supplyRows) {
                if (codigo && !currentIds.includes(codigo)) {
                  await fetch(`http://127.0.0.1:8000/supply/create`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ProveedorRIF: rif, CodigoProducto: parseInt(codigo) }),
                  });
                }
              }
              alert("Proveedor actualizado correctamente");
              router.push(`/dashboard/vendor/${rif}`);
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
                <label className="block font-bold mb-2">RIF</label>
                <Field name="RIF" id="RIF" className="w-full border-2 border-gray-300 rounded-lg px-3 py-2" required disabled />
              </div>
              <div>
                <label className="block font-bold mb-2">Razón Social</label>
                <Field name="RazonSocial" id="RazonSocial" className="w-full border-2 border-gray-300 rounded-lg px-3 py-2" required />
              </div>
              <div>
                <label className="block font-bold mb-2">Dirección</label>
                <Field name="Direccion" id="Direccion" className="w-full border-2 border-gray-300 rounded-lg px-3 py-2" required />
              </div>
              <div>
                <label className="block font-bold mb-2">Teléfono Local</label>
                <Field name="TelefonoLocal" id="TelefonoLocal" className="w-full border-2 border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block font-bold mb-2">Teléfono Celular</label>
                <Field name="TelefonoCelular" id="TelefonoCelular" className="w-full border-2 border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block font-bold mb-2">Persona Contacto</label>
                <Field name="PersonaContacto" id="PersonaContacto" className="w-full border-2 border-gray-300 rounded-lg px-3 py-2" />
              </div>
            </div>
            <Divider />
            <div className="mb-12 last:mb-0">
              <div className="flex justify-between items-center mb-4">
                <label className="block font-bold mb-2 px-1">Productos que Suministra</label>
                <Button
                  type="button"
                  onClick={addSupplyRow}
                  color="success"
                  label="Agregar Producto"
                  icon={mdiPlus}
                  roundedFull
                  small
                />
              </div>
              {loadingProducts ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-gray-600">Cargando productos...</span>
                </div>
              ) : (
                <div className="border border-gray-600 rounded-lg overflow-x-auto">
                  <div className="grid grid-cols-12 gap-2 p-4 bg-gray-900 text-gray-100 font-semibold text-sm rounded-t-lg">
                    <div className="col-span-10">Producto *</div>
                    <div className="col-span-2 text-center">Acción</div>
                  </div>
                  {supplyRows.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No hay productos agregados</div>
                  ) : (
                    supplyRows.map((selected, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center p-4 border-t border-gray-700 bg-gray-800">
                        <div className="col-span-10">
                          <select
                            value={selected}
                            onChange={e => updateSupplyRow(idx, e.target.value)}
                            className="w-full border-2 border-gray-700 rounded-lg px-3 py-2 bg-gray-900 text-gray-100 focus:border-blue-500 focus:outline-none"
                          >
                            <option value="">Seleccione un producto</option>
                            {products.map(p => (
                              <option key={p.CodigoProducto} value={p.CodigoProducto}>
                                {p.NombreProducto}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-2 flex justify-center">
                          <Button
                            type="button"
                            onClick={() => removeSupplyRow(idx)}
                            color="danger"
                            outline
                            icon={mdiTrashCan}
                            small
                            label="Eliminar"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <Divider />
            <div className="flex gap-2">
              <Button type="submit" color="success" label="Guardar Cambios" icon={mdiContentSave} />
              <Button type="button" color="info" outline label="Cancelar" onClick={() => router.push(`/dashboard/vendor/${rif}`)} />
            </div>
          </Form>
        </Formik>
      </CardBox>
    </SectionMain>
  );
} 