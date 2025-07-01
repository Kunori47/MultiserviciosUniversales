"use client";

import {
  mdiBallotOutline,
  mdiArrowLeft,
  mdiPlus,
  mdiTrashCan,
  mdiSafe,
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

interface Product {
  CodigoProducto: number;
  NombreProducto: string;
  DescripcionProducto: string;
  Precio: number;
  CantidadDisponible: number;
}

interface OrderProduct {
  CodigoProducto: number;
  NombreProducto: string;
  CantidadUtilizada: number;
  PrecioProducto: number;
}

export default function EditOrderPage() {
  const params = useParams();
  const router = useRouter();
  const rif = params?.rif as string;
  const numeroOrden = params?.numeroOrden as string;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  
  // Campos de edición
  const [fechaSalidaReal, setFechaSalidaReal] = useState<Date | null>(null);
  const [horaSalidaReal, setHoraSalidaReal] = useState<string>("");
  const [comentario, setComentario] = useState<string>("");

  useEffect(() => {
    if (rif && numeroOrden) {
      fetchOrderDetails();
      fetchProducts();
    }
  }, [rif, numeroOrden]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/service_order/franchise/${rif}/${numeroOrden}/details`);
      if (!res.ok) throw new Error("Error cargando detalles de la orden");
      const data = await res.json();
      
      // La respuesta tiene estructura: { order: {...}, employees: [...], products: [...] }
      setOrder(data.order);
      
      // Cargar productos ya utilizados en la orden
      if (data.products && data.products.length > 0) {
        const existingProducts = data.products.map((product: any) => ({
          CodigoProducto: product.CodigoProducto,
          NombreProducto: product.NombreProducto,
          CantidadUtilizada: product.CantidadUtilizada,
          PrecioProducto: product.PrecioProducto
        }));
        setOrderProducts(existingProducts);
      }
      
      // Establecer valores iniciales
      if (data.order.FechaSalidaReal) {
        setFechaSalidaReal(new Date(data.order.FechaSalidaReal + 'T00:00:00'));
      }
      if (data.order.HoraSalidaReal) {
        setHoraSalidaReal(data.order.HoraSalidaReal.substring(0, 5));
      }
      if (data.order.Comentario) {
        setComentario(data.order.Comentario);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/product_franchise/franchise/${rif}`);
      if (!res.ok) throw new Error("Error cargando productos");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = {
        FechaSalidaReal: fechaSalidaReal ? fechaSalidaReal.toISOString().split('T')[0] : null,
        HoraSalidaReal: horaSalidaReal || null,
        Comentario: comentario || null
      };

      const res = await fetch(`http://127.0.0.1:8000/service_order/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ID: parseInt(numeroOrden),
          ...updateData
        }),
      });

      if (!res.ok) throw new Error("Error actualizando la orden");
      
      // Guardar productos utilizados
      if (orderProducts.length > 0) {
        await saveOrderProducts();
      }

      alert("Orden actualizada exitosamente");
      router.push(`/dashboard/franchise/${rif}/orders`);
    } catch (err) {
      console.error("Error:", err);
      alert("Error al actualizar la orden");
    } finally {
      setSaving(false);
    }
  };

  const saveOrderProducts = async () => {
    for (const product of orderProducts) {
      try {
        await fetch(`http://127.0.0.1:8000/product_service_order/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            CodigoOrdenServicio: parseInt(numeroOrden),
            CodigoServicio: 1, // Valor por defecto, ajustar según necesidad
            NumeroCorrelativoActividad: 1, // Valor por defecto, ajustar según necesidad
            FranquiciaRIF: rif,
            CodigoProducto: product.CodigoProducto,
            CantidadUtilizada: product.CantidadUtilizada,
            PrecioProducto: product.PrecioProducto
          }),
        });
      } catch (err) {
        console.error("Error guardando producto:", err);
      }
    }
  };

  const addProduct = () => {
    if (!selectedProduct || quantity <= 0) return;
    
    const product = products.find(p => p.CodigoProducto === selectedProduct);
    if (!product) return;

    const existingProduct = orderProducts.find(p => p.CodigoProducto === selectedProduct);
    if (existingProduct) {
      setOrderProducts(orderProducts.map(p => 
        p.CodigoProducto === selectedProduct 
          ? { ...p, CantidadUtilizada: p.CantidadUtilizada + quantity }
          : p
      ));
    } else {
      setOrderProducts([...orderProducts, {
        CodigoProducto: product.CodigoProducto,
        NombreProducto: product.NombreProducto,
        CantidadUtilizada: quantity,
        PrecioProducto: product.Precio
      }]);
    }

    setSelectedProduct(null);
    setQuantity(1);
  };

  const removeProduct = (codigoProducto: number) => {
    setOrderProducts(orderProducts.filter(p => p.CodigoProducto !== codigoProducto));
  };

  const getTotalProducts = () => {
    return orderProducts.reduce((total, product) => total + product.CantidadUtilizada, 0);
  };

  const getTotalCost = () => {
    return orderProducts.reduce((total, product) => total + (product.CantidadUtilizada * product.PrecioProducto), 0);
  };

  if (loading) {
    return (
      <SectionMain>
        <div className="text-center">
          <p>Cargando detalles de la orden...</p>
        </div>
      </SectionMain>
    );
  }

  if (!order) {
    return (
      <SectionMain>
        <div className="text-center">
          <p>Orden no encontrada</p>
        </div>
      </SectionMain>
    );
  }

  // Si la orden ya tiene fecha y hora de salida real, no permitir edición
  if (order.FechaSalidaReal && order.HoraSalidaReal) {
    return (
      <SectionMain>
        <div className="text-center text-red-600 py-12">
          <p>Esta orden ya fue completada y no puede ser editada.</p>
          <Button
            href={`/dashboard/franchise/${rif}/orders`}
            color="info"
            label="Volver al listado"
            roundedFull
          />
        </div>
      </SectionMain>
    );
  }

  return (
    <>
      <SectionMain>
        <div className="max-w-6xl mx-auto">
          <SectionTitleLineWithButton
            icon={mdiBallotOutline}
            title={`Editar Orden de Servicio #${numeroOrden}`}
            main
          >
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                icon={mdiSafe}
                color="success"
                label="Guardar Cambios"
                roundedFull
                disabled={saving}
              />
              <Button
                href={`/dashboard/franchise/${rif}/orders`}
                icon={mdiArrowLeft}
                color="info"
                label="Volver"
                roundedFull
              />
            </div>
          </SectionTitleLineWithButton>

          <Divider />

          {/* Información de la Orden */}
          <CardBox className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Información de la Orden</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Número de Orden</label>
                <p className="text-gray-700">#{order.NumeroOrden}</p>
              </div>
              <div>
                <label>Fecha de Entrada</label>
                <p className="text-gray-700">{order.FechaEntrada || order.FechaOrden || "Sin fecha"}</p>
              </div>
              <div>
                <label>Hora de Entrada</label>
                <p className="text-gray-700">{order.HoraEntrada ? order.HoraEntrada.substring(0, 5) : ""}</p>
              </div>
              <div>
                <label>Cliente</label>
                <p className="text-gray-700">{order.NombreCliente}</p>
              </div>
              <div>
                <label>Vehículo</label>
                <p className="text-gray-700">#{order.CodigoVehiculo}</p>
              </div>
              <div>
                <label>Estado</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  order.Estado === "Completado" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {order.Estado}
                </span>
              </div>
            </div>
          </CardBox>

          {/* Campos de Edición */}
          <CardBox className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Actualizar Información</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label>Fecha de Salida Real</label>
                <DatePicker
                  selected={fechaSalidaReal}
                  onChange={(date) => setFechaSalidaReal(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Selecciona fecha"
                  isClearable
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label>Hora de Salida Real</label>
                <input
                  type="time"
                  value={horaSalidaReal}
                  onChange={(e) => setHoraSalidaReal(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label>Comentario</label>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  rows={3}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="Agregar comentario..."
                />
              </div>
            </div>
          </CardBox>

          {/* Productos Utilizados */}
          <CardBox>
            <h3 className="text-lg font-semibold mb-4">Productos Utilizados</h3>
            
            {/* Agregar Producto */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label>Producto</label>
                  <select
                    value={selectedProduct || ""}
                    onChange={(e) => setSelectedProduct(parseInt(e.target.value) || null)}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Selecciona un producto</option>
                    {products.map((product) => (
                      <option key={product.CodigoProducto} value={product.CodigoProducto}>
                        {product.NombreProducto} - ${product.Precio}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <Button
                    onClick={addProduct}
                    icon={mdiPlus}
                    color="success"
                    label="Agregar"
                    disabled={!selectedProduct || quantity <= 0}
                  />
                </div>
              </div>
            </div>

            {/* Tabla de Productos */}
            {orderProducts.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Producto</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cantidad</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Precio Unitario</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Subtotal</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderProducts.map((product) => (
                      <tr key={product.CodigoProducto} className="border-b border-gray-200">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {product.NombreProducto}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {product.CantidadUtilizada}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          ${product.PrecioProducto}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-700">
                          ${(product.CantidadUtilizada * product.PrecioProducto).toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            onClick={() => removeProduct(product.CodigoProducto)}
                            icon={mdiTrashCan}
                            color="danger"
                            outline
                            small
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td colSpan={1} className="px-4 py-3 text-sm font-medium text-gray-700">
                        Total Productos: {getTotalProducts()}
                      </td>
                      <td colSpan={2} className="px-4 py-3 text-sm font-medium text-gray-700">
                        Total Costo:
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900">
                        ${getTotalCost().toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {orderProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se han agregado productos utilizados
              </div>
            )}
          </CardBox>
        </div>
      </SectionMain>
    </>
  );
} 