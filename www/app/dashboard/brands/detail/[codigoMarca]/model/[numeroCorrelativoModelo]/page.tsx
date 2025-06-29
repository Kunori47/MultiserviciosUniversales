"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { mdiArrowLeft, mdiCar, mdiPencil, mdiDelete, mdiPlus } from '@mdi/js';
import Button from '../../../../../../_components/Button';
import SectionMain from '../../../../../../_components/Section/Main';
import SectionTitleLineWithButton from '../../../../../../_components/Section/TitleLineWithButton';
import CardBox from '../../../../../../_components/CardBox';
import FormField from '../../../../../../_components/FormField';
import { Field, Form, Formik } from 'formik';

interface Model {
  CodigoMarca: number;
  NumeroCorrelativoModelo: number;
  DescripcionModelo: string;
  CantidadPuestos: number;
  TipoRefrigerante: string;
  TipoGasolina: string;
  TipoAceite: string;
  Peso: number;
}

interface MaintenancePlan {
  CodigoMantenimiento: number;
  TiempoUso: number;
  Kilometraje: number;
  DescripcionMantenimiento: string;
  CodigoMarca: number;
  NumeroCorrelativoModelo: number;
}

interface Brand {
  CodigoMarca: number;
  Nombre: string;
}

export default function ModelDetailPage() {
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState<Model | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [maintenancePlans, setMaintenancePlans] = useState<MaintenancePlan[]>([]);
  const [editingPlan, setEditingPlan] = useState<MaintenancePlan | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const router = useRouter();
  const params = useParams();
  const codigoMarca = params?.codigoMarca;
  const numeroCorrelativoModelo = params?.numeroCorrelativoModelo;

  useEffect(() => {
    if (!codigoMarca || !numeroCorrelativoModelo) return;
    
    const fetchData = async () => {
      try {
        // Fetch brand info
        const brandResponse = await fetch(`http://127.0.0.1:8000/brand/${codigoMarca}`);
        if (brandResponse.ok) {
          const brandData = await brandResponse.json();
          setBrand(brandData);
        }

        // Fetch model info
        const modelResponse = await fetch(`http://127.0.0.1:8000/model/${codigoMarca}/${numeroCorrelativoModelo}`);
        if (modelResponse.ok) {
          const modelData = await modelResponse.json();
          setModel(modelData);
        }

        // Fetch maintenance plans
        const plansResponse = await fetch(`http://127.0.0.1:8000/model/${codigoMarca}/${numeroCorrelativoModelo}/maintenance-plans`);
        if (plansResponse.ok) {
          const plansData = await plansResponse.json();
          setMaintenancePlans(plansData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [codigoMarca, numeroCorrelativoModelo]);

  const handleDeleteMaintenancePlan = async (CodigoMantenimiento: number) => {
    if (!confirm('¿Eliminar este plan de mantenimiento?')) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/maintenanceplan/delete?CodigoMantenimiento=${CodigoMantenimiento}`, { 
        method: 'DELETE' 
      });
      
      if (response.ok) {
        setMaintenancePlans(plans => plans.filter(p => p.CodigoMantenimiento !== CodigoMantenimiento));
        alert('Plan de mantenimiento eliminado correctamente');
      } else {
        const errorData = await response.json();
        alert('Error al eliminar el plan: ' + (errorData.detail || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error deleting maintenance plan:', error);
      alert('Error al eliminar el plan de mantenimiento');
    }
  };

  const handleEditMaintenancePlan = async (values: any) => {
    if (!editingPlan) return;
    
    try {
      const response = await fetch('http://127.0.0.1:8000/maintenanceplan/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          CodigoMantenimiento: editingPlan.CodigoMantenimiento,
          TiempoUso: parseInt(values.TiempoUso),
          Kilometraje: parseInt(values.Kilometraje),
          DescripcionMantenimiento: values.DescripcionMantenimiento,
          CodigoMarca: editingPlan.CodigoMarca,
          NumeroCorrelativoModelo: editingPlan.NumeroCorrelativoModelo
        }),
      });

      if (response.ok) {
        setMaintenancePlans(plans => 
          plans.map(p => 
            p.CodigoMantenimiento === editingPlan.CodigoMantenimiento 
              ? { ...p, ...values, TiempoUso: parseInt(values.TiempoUso), Kilometraje: parseInt(values.Kilometraje) }
              : p
          )
        );
        setShowEditForm(false);
        setEditingPlan(null);
        alert('Plan de mantenimiento actualizado correctamente');
      } else {
        const errorData = await response.json();
        alert('Error al actualizar el plan: ' + (errorData.detail || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error updating maintenance plan:', error);
      alert('Error al actualizar el plan de mantenimiento');
    }
  };

  const startEditPlan = (plan: MaintenancePlan) => {
    setEditingPlan(plan);
    setShowEditForm(true);
  };

  if (loading) {
    return (
      <SectionMain>
        <div className="flex justify-center items-center min-h-[60vh]">
          Cargando...
        </div>
      </SectionMain>
    );
  }

  if (!model || !brand) {
    return (
      <SectionMain>
        <div className="flex justify-center items-center min-h-[60vh]">
          Modelo no encontrado
        </div>
      </SectionMain>
    );
  }

  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiCar} title={`Detalle del Modelo ${model.NumeroCorrelativoModelo} - ${brand.Nombre}`} main>
        <Button
          label="Editar Modelo"
          icon={mdiPencil}
          color="info"
          href={`/dashboard/brands/detail/${codigoMarca}/model/${model.NumeroCorrelativoModelo}/edit`}
        />
        <Button
          label="Agregar Plan de Mantenimiento"
          icon={mdiPlus}
          color="success"
          href={`/dashboard/brands/detail/${codigoMarca}/model/${model.NumeroCorrelativoModelo}/maintenance-plan/new`}
        />
        <Button
          label="Volver"
          icon={mdiArrowLeft}
          color="info"
          href={`/dashboard/brands/detail/${codigoMarca}`}
        />
      </SectionTitleLineWithButton>

      {/* Información del Modelo */}
      <CardBox className="mb-6">
        <div className="mb-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{brand.Nombre}</h2>
            <p className="text-lg text-gray-600">Modelo {model.NumeroCorrelativoModelo}</p>
            <p className="text-md text-gray-500 mt-1">{model.DescripcionModelo}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{model.CantidadPuestos}</div>
            <div className="text-sm text-gray-600">Puestos</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-green-600">{model.TipoGasolina}</div>
            <div className="text-sm text-gray-600">Combustible</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-orange-600">{model.TipoAceite}</div>
            <div className="text-sm text-gray-600">Aceite</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-purple-600">{model.Peso} kg</div>
            <div className="text-sm text-gray-600">Peso</div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h3 className="text-lg font-semibold mb-4">Especificaciones Técnicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center p-3 bg-white border rounded">
              <span className="font-medium text-gray-700">Tipo de Refrigerante:</span>
              <span className="text-gray-900">{model.TipoRefrigerante}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white border rounded">
              <span className="font-medium text-gray-700">Tipo de Gasolina:</span>
              <span className="text-gray-900">{model.TipoGasolina}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white border rounded">
              <span className="font-medium text-gray-700">Tipo de Aceite:</span>
              <span className="text-gray-900">{model.TipoAceite}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white border rounded">
              <span className="font-medium text-gray-700">Peso:</span>
              <span className="text-gray-900">{model.Peso} kg</span>
            </div>
          </div>
        </div>
      </CardBox>

      {/* Lista de Planes de Mantenimiento */}
      <CardBox className="mt-6" hasTable>
        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead>
              <tr className="bg-gray-100 dark:bg-slate-800">
                <th className="p-3">Código</th>
                <th className="p-3">Tiempo de Uso (horas)</th>
                <th className="p-3">Kilometraje (km)</th>
                <th className="p-3">Descripción</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {maintenancePlans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4">No hay planes de mantenimiento registrados para este modelo.</td>
                </tr>
              ) : (
                maintenancePlans.map((plan, index) => (
                  <tr key={plan.CodigoMantenimiento} className="border-t">
                    <td className="p-3">{plan.CodigoMantenimiento}</td>
                    <td className="p-3">{plan.TiempoUso}</td>
                    <td className="p-3">{plan.Kilometraje}</td>
                    <td className="p-3">{plan.DescripcionMantenimiento}</td>
                    <td className="p-3">
                      <div className="flex justify-center space-x-2">
                        <Button
                          label="Editar"
                          icon={mdiPencil}
                          color="info"
                          small
                          onClick={() => startEditPlan(plan)}
                        />
                        <Button
                          label="Eliminar"
                          icon={mdiDelete}
                          color="danger"
                          small
                          onClick={() => handleDeleteMaintenancePlan(plan.CodigoMantenimiento)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardBox>

      {/* Modal de Edición */}
      {showEditForm && editingPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Editar Plan de Mantenimiento</h3>
            <Formik
              initialValues={{
                TiempoUso: editingPlan.TiempoUso.toString(),
                Kilometraje: editingPlan.Kilometraje.toString(),
                DescripcionMantenimiento: editingPlan.DescripcionMantenimiento
              }}
              onSubmit={handleEditMaintenancePlan}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <FormField label="Tiempo de Uso (horas)" labelFor="TiempoUso">
                    {({ className }) => (
                      <Field
                        name="TiempoUso"
                        id="TiempoUso"
                        type="number"
                        placeholder="Horas de uso"
                        className={className}
                        required
                      />
                    )}
                  </FormField>

                  <FormField label="Kilometraje" labelFor="Kilometraje">
                    {({ className }) => (
                      <Field
                        name="Kilometraje"
                        id="Kilometraje"
                        type="number"
                        placeholder="Kilómetros"
                        className={className}
                        required
                      />
                    )}
                  </FormField>

                  <FormField label="Descripción del Mantenimiento" labelFor="DescripcionMantenimiento">
                    {({ className }) => (
                      <Field
                        name="DescripcionMantenimiento"
                        id="DescripcionMantenimiento"
                        placeholder="Descripción del mantenimiento"
                        className={className}
                        required
                      />
                    )}
                  </FormField>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditForm(false);
                        setEditingPlan(null);
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancelar
                    </button>
                    <Button
                      type="submit"
                      label={isSubmitting ? 'Guardando...' : 'Actualizar'}
                      color="success"
                      disabled={isSubmitting}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </SectionMain>
  );
} 