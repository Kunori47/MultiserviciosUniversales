"use client";

import {
  mdiWarehouse,
  mdiInformation,
} from "@mdi/js";
import Button from "../../../../../_components/Button";
import Divider from "../../../../../_components/Divider";
import CardBox from "../../../../../_components/CardBox";
import SectionMain from "../../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../../_components/Section/TitleLineWithButton";
import FieldLabel from "../../../../../_components/FormField/FieldLabel";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function InfoProductPage() {
  const params = useParams();
  const codigo = params?.codigo as string;
  const rif = params?.rif as string;
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    if (codigo && rif) {
      fetch(`http://127.0.0.1:8000/product_franchise/product?FranquiciaRIF=${rif}&CodigoProducto=${codigo}`)
        .then(res => res.json())
        .then(data => setProduct(data))
        .catch(err => console.error("Error cargando producto:", err));
    }
  }, [codigo, rif]);

  if (!product) {
    return <div>Cargando datos del producto...</div>;
  }

  return (
    <>
      <SectionMain>
        <div className="max-w-4xl mx-auto">
          <SectionTitleLineWithButton
            icon={mdiWarehouse}
            title={`${product.CodigoProducto} - ${product.NombreProducto}`}
            main
          >
            <Button
              href={`/dashboard/franchise/${rif}/inventory`}
              color="info"
              label="Atras"
              roundedFull
            />
          </SectionTitleLineWithButton>

          <div className="flex justify-center mb-8">
            <CardBox className="w-full max-w-md bg-gradient-to-r from-gray-50 to-gray-100 shadow-sm border border-gray-200">
              <div className="text-center p-6">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Información del Producto</h3>
                <p className="text-xl font-semibold text-gray-900">
                  {product.NombreProducto}
                </p>
              </div>
            </CardBox>
          </div>

          <Divider />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <CardBox className="bg-white shadow-sm border border-gray-200">
              <div className="p-6 text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Código</h3>
                <div className="text-xl font-semibold text-gray-900">
                  {product.CodigoProducto}
                </div>
              </div>
            </CardBox>

            <CardBox className="bg-white shadow-sm border border-gray-200">
              <div className="p-6 text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Categoría</h3>
                <div className="text-lg font-semibold text-gray-900">
                  {product.Categoria}
                </div>
              </div>
            </CardBox>
          </div>

          <Divider />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <CardBox className="bg-white shadow-sm border border-gray-200">
              <div className="p-6 text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Cantidad Mínima</h3>
                <div className="text-2xl font-bold text-orange-600">
                  {product.CantidadMinima}
                </div>
              </div>
            </CardBox>

            <CardBox className="bg-white shadow-sm border border-gray-200">
              <div className="p-6 text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Cantidad Máxima</h3>
                <div className="text-2xl font-bold text-blue-600">
                  {product.CantidadMaxima}
                </div>
              </div>
            </CardBox>

            <CardBox className="bg-white shadow-sm border border-gray-200">
              <div className="p-6 text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Stock Actual</h3>
                <div className={`text-2xl font-bold ${
                  product.Cantidad > 10 ? 'text-green-600' : 
                  product.Cantidad > 5 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {product.Cantidad}
                </div>
              </div>
            </CardBox>
          </div>

          <Divider />

          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8">
            <CardBox className="w-full md:w-80 text-center bg-white shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Precio</h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  ${product.Precio}
                </div>
                <Button
                  type="reset"
                  color="contrast"
                  href={`/dashboard/franchise/${rif}/inventory/update/${product.CodigoProducto}`}
                  outline
                  icon={mdiInformation}
                  isGrouped
                  label="Editar Producto"
                />
              </div>
            </CardBox>
          </div>
        </div>
      </SectionMain>
    </>
  );
} 