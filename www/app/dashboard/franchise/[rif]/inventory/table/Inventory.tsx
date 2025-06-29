"use client";

import { mdiEye, mdiInformation, mdiTagEdit, mdiTrashCan } from "@mdi/js";
import React, { useState } from "react";
import Button from "../../../../../_components/Button";
import Buttons from "../../../../../_components/Buttons";
import CardBoxModal from "../../../../../_components/CardBox/Modal";
import { useRouter } from "next/navigation";

type Props = {
  inventory: any[];
  rif: string;
  onInventoryUpdate: () => void;
};

const TableInventory = ({ inventory, rif, onInventoryUpdate }: Props) => {
  const perPage = 5;
  const router = useRouter();

  const numPages = Math.ceil(inventory.length / perPage);
  const pagesList: number[] = [];

  for (let i = 0; i < numPages; i++) {
    pagesList.push(i);
  }

  const [currentPage, setCurrentPage] = useState(0);
  const inventoryPaginated = inventory.slice(
    perPage * currentPage,
    perPage * (currentPage + 1),
  );

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isModalTrashActive, setIsModalTrashActive] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!selectedProduct) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/product_franchise/delete?FranquiciaRIF=${rif}&CodigoProducto=${selectedProduct.CodigoProducto}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar producto del inventario");
      setIsModalTrashActive(false);
      setSelectedProduct(null);
      // Llamar a la función de actualización en lugar de recargar la página
      onInventoryUpdate();
    } catch (err) {
      alert("No se pudo eliminar el producto del inventario");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <CardBoxModal
        title="Por favor confirma"
        buttonColor="danger"
        buttonLabel={isDeleting ? "Eliminando..." : "Confirmar"}
        isActive={isModalTrashActive}
        onConfirm={handleDelete}
        onCancel={() => {
          setIsModalTrashActive(false);
          setSelectedProduct(null);
        }}
      >
        <p>
          ¿Estás seguro de que quieres <b>eliminar</b> este producto del inventario?
        </p>
      </CardBoxModal>

      <table>
        <thead>
          <tr>
            <th className="text-center">Código</th>
            <th className="text-center">Nombre del Producto</th>
            <th className="text-center">Cantidad</th>
            <th className="text-center">Precio</th>
            <th className="text-center">Categoría</th>
            <th className="text-center">Estado</th>
          </tr>
        </thead>
        <tbody>
          {inventoryPaginated.map((product: any) => (
            <tr key={`${product.FranquiciaRIF}-${product.CodigoProducto}`}>
              <td data-label="Código" className="text-center">{product.CodigoProducto}</td>
              <td data-label="Nombre" className="text-center">{product.NombreProducto}</td>
              <td data-label="Cantidad" className="text-center">
                <span className={`font-semibold ${product.Cantidad > 10 ? 'text-green-600' : product.Cantidad > 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {product.Cantidad}
                </span>
              </td>
              <td data-label="Precio" className="text-center">${product.Precio}</td>
              <td data-label="Categoría" className="text-center">
                <small className="text-gray-500 dark:text-slate-400">
                  {product.Categoria}
                </small>
              </td>
              <td data-label="Estado" className="text-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.Cantidad > 10 ? 'bg-green-100 text-green-800' : 
                  product.Cantidad > 5 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {product.Cantidad > 10 ? 'Disponible' : product.Cantidad > 5 ? 'Bajo Stock' : 'Agotándose'}
                </span>
              </td>
              <td className="before:hidden lg:w-1 whitespace-nowrap">
                <Buttons type="justify-start lg:justify-end" noWrap>
                  <Button
                    color="info"
                    icon={mdiInformation}
                    href={`/dashboard/franchise/${rif}/inventory/${product.CodigoProducto}`}
                    small
                    isGrouped
                  />
                  <Button
                    color="contrast"
                    icon={mdiTagEdit}
                    href={`/dashboard/franchise/${rif}/inventory/update/${product.CodigoProducto}`}
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
                    disabled={isDeleting}
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

export default TableInventory; 