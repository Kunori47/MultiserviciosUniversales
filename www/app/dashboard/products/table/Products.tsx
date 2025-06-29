"use client";

import { mdiEye, mdiPencil, mdiTrashCan } from "@mdi/js";
import React, { useState } from "react";
import Button from "../../../_components/Button";
import Buttons from "../../../_components/Buttons";
import CardBoxModal from "../../../_components/CardBox/Modal";

interface Product {
  CodigoProducto: number;
  NombreProducto: string;
  DescripcionProducto: string;
  LineaSuministro: number;
  Tipo: string;
  NivelContaminante: string;
  Tratamiento: string;
  Categoria?: string;
}

type Props = {
  products: Product[];
  onDelete?: () => void;
};

const TableProducts = ({ products, onDelete }: Props) => {
  const perPage = 5;
  const numPages = Math.ceil(products.length / perPage);
  const pagesList: number[] = [];

  for (let i = 0; i < numPages; i++) {
    pagesList.push(i);
  }

  const [currentPage, setCurrentPage] = useState(0);
  const productsPaginated = products.slice(
    perPage * currentPage,
    perPage * (currentPage + 1),
  );

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isModalTrashActive, setIsModalTrashActive] = useState(false);

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/product/delete?CodigoProducto=${selectedProduct.CodigoProducto}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar producto");
      setIsModalTrashActive(false);
      setSelectedProduct(null);
      // Call the callback to refresh the products list
      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      alert("No se pudo eliminar el producto");
    }
  };

  return (
    <>
      <CardBoxModal
        title="Por favor confirma"
        buttonColor="danger"
        buttonLabel="Confirmar"
        isActive={isModalTrashActive}
        onConfirm={handleDelete}
        onCancel={() => {
          setIsModalTrashActive(false);
          setSelectedProduct(null);
        }}
      >
        <p>
          ¿Estás seguro de que quieres <b>eliminar</b> el producto "{selectedProduct?.NombreProducto}"?
        </p>
      </CardBoxModal>

      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Tipo</th>
            <th>Nivel Contaminante</th>
          </tr>
        </thead>
        <tbody>
          {productsPaginated.map((product: Product) => (
            <tr key={product.CodigoProducto}>
              <td data-label="Código">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  #{product.CodigoProducto}
                </span>
              </td>
              <td data-label="Nombre">
                <div>
                  <div className="font-medium text-gray-900">{product.NombreProducto}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {product.DescripcionProducto}
                  </div>
                </div>
              </td>
              <td data-label="Categoría">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {product.Categoria || "Sin categoría"}
                </span>
              </td>
              <td data-label="Tipo">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {product.Tipo}
                </span>
              </td>
              <td data-label="Nivel Contaminante">
                {product.NivelContaminante ? (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    Number(product.NivelContaminante) >= 4 ? 'bg-red-100 text-red-800' :
                    Number(product.NivelContaminante) >= 2 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    Nivel {product.NivelContaminante}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    No aplica
                  </span>
                )}
              </td>
              <td className="before:hidden lg:w-1 whitespace-nowrap">
                <Buttons type="justify-start lg:justify-end" noWrap>
                  <Button
                    color="info"
                    icon={mdiEye}
                    href={`/dashboard/products/${product.CodigoProducto}`}
                    small
                    isGrouped
                  />
                  <Button
                    color="contrast"
                    icon={mdiPencil}
                    href={`/dashboard/products/edit/${product.CodigoProducto}`}
                    small
                    isGrouped
                  />
                  <Button
                    color="danger"
                    icon={mdiTrashCan}
                    onClick={() => {
                      setIsModalTrashActive(true);
                      setSelectedProduct(product);
                    }}
                    small
                    isGrouped
                  />
                </Buttons>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 md:py-0">
          <Buttons>
            {pagesList.map((page) => (
              <Button
                key={page}
                active={page === currentPage}
                label={(page + 1).toString()}
                color={page === currentPage ? "lightDark" : "whiteDark"}
                small
                onClick={() => setCurrentPage(page)}
                isGrouped
              />
            ))}
          </Buttons>
          <small className="mt-6 md:mt-0">
            Page {currentPage + 1} of {numPages}
          </small>
        </div>
      </div>
    </>
  );
};

export default TableProducts; 