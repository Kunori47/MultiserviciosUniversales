"use client";

import {
  mdiHistory,
  mdiFilter,
  mdiCalendar,
} from "@mdi/js";
import Button from "../../../../../../_components/Button";
import Divider from "../../../../../../_components/Divider";
import CardBox from "../../../../../../_components/CardBox";
import SectionMain from "../../../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../../../_components/Section/TitleLineWithButton";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CorrectionHistory {
  FranquiciaRIF: string;
  CodigoProducto: number;
  FechaCorreccion: string;
  Cantidad: number;
  TipoAjuste: string;
  Comentario: string;
  NombreProducto: string;
  Categoria: string;
}

export default function CorrectionHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const rif = params?.rif as string;
  const [franchise, setFranchise] = useState<any>(null);
  const [corrections, setCorrections] = useState<CorrectionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    if (rif) {
      fetchFranchiseInfo();
      fetchCorrectionHistory();
    }
  }, [rif]);

  const fetchFranchiseInfo = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/franchise/${rif}`);
      if (!res.ok) throw new Error("Error cargando información de la franquicia");
      const data = await res.json();
      setFranchise(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const fetchCorrectionHistory = async (mes?: number, anio?: number) => {
    setLoading(true);
    try {
      let url = `http://127.0.0.1:8000/correction/franchise/${rif}/history`;
      if (mes && anio) {
        url += `?mes=${mes}&anio=${anio}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error cargando historial de correcciones");
      const data = await res.json();
      setCorrections(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      fetchCorrectionHistory(date.getMonth() + 1, date.getFullYear());
      setIsFiltered(true);
    } else {
      fetchCorrectionHistory();
      setIsFiltered(false);
    }
  };

  const handleClearFilter = () => {
    setSelectedDate(null);
    setIsFiltered(false);
    fetchCorrectionHistory();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAdjustmentTypeColor = (tipoAjuste: string) => {
    return tipoAjuste === 'Faltante' ? 'text-green-600' : 'text-red-600';
  };

  const getAdjustmentTypeBg = (tipoAjuste: string) => {
    return tipoAjuste === 'Faltante' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (!franchise) {
    return (
      <SectionMain>
        <div className="text-center">
          <p>Cargando información de la franquicia...</p>
        </div>
      </SectionMain>
    );
  }

  if (loading) {
    return (
      <SectionMain>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando historial...</p>
        </div>
      </SectionMain>
    );
  }

  return (
    <>
      <SectionMain>
        <div className="max-w-6xl mx-auto">
          <SectionTitleLineWithButton
            icon={mdiHistory}
            title={`Historial de Correcciones - ${franchise.Nombre}`}
            main
          >
            <Button
              href={`/dashboard/franchise/${rif}/inventory`}
              color="info"
              label="Volver"
              roundedFull
            />
          </SectionTitleLineWithButton>

          <Divider />

          {/* Filtros */}
          <CardBox className="bg-white shadow-lg mb-6">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i className="mdi mdi-filter text-blue-600 mr-2"></i>
                Filtros
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mes y Año
                  </label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    placeholderText="Selecciona mes y año"
                    isClearable
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <Button
                    onClick={handleClearFilter}
                    color="contrast"
                    outline
                    label="Limpiar Filtros"
                  />
                </div>
              </div>
            </div>
          </CardBox>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <CardBox className="bg-white shadow-lg">
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Total de Correcciones</h3>
                <p className="text-3xl font-bold text-blue-600">{corrections.length}</p>
              </div>
            </CardBox>

            <CardBox className="bg-white shadow-lg">
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Ajustes por Faltante</h3>
                <p className="text-3xl font-bold text-green-600">
                  {corrections.filter(c => c.TipoAjuste === 'Faltante').length}
                </p>
              </div>
            </CardBox>

            <CardBox className="bg-white shadow-lg">
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Ajustes por Sobrante</h3>
                <p className="text-3xl font-bold text-red-600">
                  {corrections.filter(c => c.TipoAjuste === 'Sobrante').length}
                </p>
              </div>
            </CardBox>
          </div>

          {/* Tabla de Correcciones */}
          <CardBox className="bg-white shadow-lg">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <i className="mdi mdi-calendar text-blue-600 mr-2"></i>
                Historial de Correcciones
                {isFiltered && (
                  <span className="ml-2 text-sm text-gray-500">
                    (Filtrado: {selectedDate?.toLocaleDateString('default', { month: 'long', year: 'numeric' })})
                  </span>
                )}
              </h3>

              {corrections.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {isFiltered ? 'No hay correcciones para la fecha seleccionada' : 'No hay correcciones registradas'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Producto</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Categoría</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Cantidad</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Tipo de Ajuste</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Comentario</th>
                      </tr>
                    </thead>
                    <tbody>
                      {corrections.map((correction, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {formatDate(correction.FechaCorreccion)}
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-800">{correction.NombreProducto}</p>
                              <p className="text-sm text-gray-500">Código: {correction.CodigoProducto}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {correction.Categoria}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`font-semibold ${getAdjustmentTypeColor(correction.TipoAjuste)}`}>
                              {correction.Cantidad}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAdjustmentTypeBg(correction.TipoAjuste)}`}>
                              {correction.TipoAjuste}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {correction.Comentario || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </CardBox>
        </div>
      </SectionMain>
    </>
  );
} 