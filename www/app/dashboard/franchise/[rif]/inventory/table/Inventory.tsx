"use client";

import { mdiEye, mdiInformation, mdiTagEdit, mdiTrashCan, mdiLeaf, mdiTree, mdiRecycle } from "@mdi/js";
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

  // Función para determinar el estado del producto
  const getProductStatus = (product: any) => {
    const { Cantidad, CantidadMinima, CantidadMaxima } = product;
    
    if (Cantidad <= CantidadMinima) {
      return {
        text: '🌱 Escaso',
        color: 'text-red-600',
        bgColor: 'bg-red-100 text-red-800 border border-red-200'
      };
    } else if (Cantidad >= CantidadMaxima) {
      return {
        text: '♻️ Exceso',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100 text-orange-800 border border-orange-200'
      };
    } else if (Cantidad <= CantidadMinima + 5) {
      return {
        text: '⚠️ Bajo Stock',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      };
    } else {
      return {
        text: '✅ Disponible',
        color: 'text-green-600',
        bgColor: 'bg-green-100 text-green-800 border border-green-200'
      };
    }
  };

  // Función para determinar el color de la cantidad
  const getQuantityColor = (product: any) => {
    const { Cantidad, CantidadMinima, CantidadMaxima } = product;
    
    if (Cantidad <= CantidadMinima) {
      return 'text-red-600 font-bold';
    } else if (Cantidad >= CantidadMaxima) {
      return 'text-orange-600 font-bold';
    } else if (Cantidad <= CantidadMinima + 5) {
      return 'text-yellow-600 font-bold';
    } else {
      return 'text-green-600 font-bold';
    }
  };

  return (
    <>
      <CardBoxModal
        title="🌿 Confirmar Acción Ecológica"
        buttonColor="danger"
        buttonLabel={isDeleting ? "Eliminando..." : "Confirmar"}
        isActive={isModalTrashActive}
        onConfirm={handleDelete}
        onCancel={() => {
          setIsModalTrashActive(false);
          setSelectedProduct(null);
        }}
      >
        <p className="text-green-700">
          ¿Estás seguro de que quieres <b>eliminar</b> este producto del inventario ecológico?
        </p>
        <p className="text-sm text-green-600 mt-2">♻️ Esta acción no se puede deshacer</p>
      </CardBoxModal>

      <table className="w-full">
        <thead className="bg-gradient-to-r from-green-100 to-blue-100">
          <tr>
            <th className="text-center p-3 text-green-700 font-semibold">Código</th>
            <th className="text-center p-3 text-green-700 font-semibold">Nombre del Producto</th>
            <th className="text-center p-3 text-green-700 font-semibold">Cantidad</th>
            <th className="text-center p-3 text-green-700 font-semibold">Mínimo</th>
            <th className="text-center p-3 text-green-700 font-semibold">Máximo</th>
            <th className="text-center p-3 text-green-700 font-semibold">Precio</th>
            <th className="text-center p-3 text-green-700 font-semibold">Categoría</th>
            <th className="text-center p-3 text-green-700 font-semibold">Estado</th>
          </tr>
        </thead>
        <tbody className="bg-white/80">
          {inventoryPaginated.map((product: any) => {
            const status = getProductStatus(product);
            const quantityColor = getQuantityColor(product);
            
            return (
              <tr key={`${product.FranquiciaRIF}-${product.CodigoProducto}`} className="border-b border-green-100 hover:bg-green-50/50 transition-colors">
                <td data-label="Código" className="text-center p-3 text-green-700 font-medium">{product.CodigoProducto}</td>
                <td data-label="Nombre" className="text-center p-3 text-green-700">{product.NombreProducto}</td>
                <td data-label="Cantidad" className="text-center p-3">
                  <span className={`${quantityColor}`}>
                    {product.Cantidad}
                  </span>
                </td>
                <td data-label="Mínimo" className="text-center p-3">
                  <span className="text-green-600 font-medium">
                    {product.CantidadMinima}
                  </span>
                </td>
                <td data-label="Máximo" className="text-center p-3">
                  <span className="text-green-600 font-medium">
                    {product.CantidadMaxima}
                  </span>
                </td>
                <td data-label="Precio" className="text-center p-3 text-green-700 font-semibold">${product.Precio}</td>
                <td data-label="Categoría" className="text-center p-3">
                  <small className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">
                    {product.Categoria}
                  </small>
                </td>
                <td data-label="Estado" className="text-center p-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bgColor}`}>
                    {status.text}
                  </span>
                </td>
                <td className="before:hidden lg:w-1 whitespace-nowrap p-3">
                  <Buttons type="justify-start lg:justify-end" noWrap>
                    <Button
                      color="info"
                      icon={mdiInformation}
                      href={`/dashboard/franchise/${rif}/inventory/${product.CodigoProducto}`}
                      small
                      isGrouped
                    />
                    <Button
                      color="success"
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
            );
          })}
        </tbody>
      </table>
      <div className="p-3 lg:px-6 border-t border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 md:py-0">
          <Buttons>
            {pagesList.map((page) => (
              <Button
                key={page}
                active={page === currentPage}
                label={(page + 1).toString()}
                color={page === currentPage ? "success" : "whiteDark"}
                small
                onClick={() => setCurrentPage(page)}
                isGrouped
              />
            ))}
          </Buttons>
          <small className="mt-6 md:mt-0 text-green-600">
            Página {currentPage + 1} de {numPages}
          </small>
        </div>
      </div>
    </>
  );
};

export default TableInventory; 