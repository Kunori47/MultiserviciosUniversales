"use client";

import {
  mdiBallotOutline,
  mdiReceipt,
  mdiPlus,
  mdiClose,
  mdiCalculator,
  mdiCurrencyUsd,
  mdiCreditCard,
  mdiCash,
  mdiBank,
  mdiCellphone,
} from "@mdi/js";
import { Field, Form, Formik } from "formik";
import Head from "next/head";
import Button from "../../../../../../_components/Button";
import Buttons from "../../../../../../_components/Buttons";
import Divider from "../../../../../../_components/Divider";
import CardBox from "../../../../../../_components/CardBox";
import FormField from "../../../../../../_components/FormField";
import SectionMain from "../../../../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../../../../_components/Section/TitleLineWithButton";
import { getPageTitle } from "../../../../../../_lib/config";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface OrderDetail {
  NumeroOrden: number;
  FechaOrden: string;
  HoraEntrada: string;
  HoraSalidaReal: string;
  FechaSalidaReal: string;
  Comentario: string;
  Estado: string;
  CI_Cliente: string;
  NombreCliente: string;
  CodigoVehiculo: number;
  Placa: string;
  FranquiciaRIF: string;
  NombreFranquicia: string;
}

interface ServiceDetail {
  NumeroActividad: number;
  CodigoServicio: string;
  NombreServicio: string;
  PrecioUnitario: number;
  Cantidad: number;
  Subtotal: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

// Payment data structure matching the Pay model
interface PaymentData {
  metodo: string;
  cantidad: number;
  descripcion: string;
  // Tarjeta fields
  fechaTarjeta?: string;
  montoTarjeta?: number;
  bancoTarjeta?: string;
  modalidadTarjeta?: string;
  numeroTarjeta?: string;
  // Efectivo fields
  montoEfectivo?: number;
  monedaEfectivo?: string;
  // Pago Móvil fields
  fechaPagoMovil?: string;
  telefonoPagoMovil?: string;
  referenciaPagoMovil?: string;
  montoPagoMovil?: number;
}

const paymentMethods: PaymentMethod[] = [
  { id: "Efectivo", name: "Efectivo", icon: mdiCash },
  { id: "Tarjeta", name: "Tarjeta de Crédito/Débito", icon: mdiCreditCard },
  { id: "Pago Móvil", name: "Pago Móvil", icon: mdiCellphone },
];

export default function GenerateInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const rif = params?.rif as string;
  const numeroOrden = params?.numeroOrden as string;
  
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [franchise, setFranchise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [customerFrequency, setCustomerFrequency] = useState<number>(0);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [ivaAmount, setIvaAmount] = useState<number>(0);

  useEffect(() => {
    if (rif && numeroOrden) {
      fetchFranchiseInfo();
      fetchOrderDetails();
    }
  }, [rif, numeroOrden]);

  useEffect(() => {
    if (orderDetail?.CI_Cliente) {
      fetchCustomerFrequency();
    }
  }, [orderDetail]);

  useEffect(() => {
    // Calcular total pagado
    const total = payments.reduce((sum, payment) => {
      switch (payment.metodo) {
        case "Efectivo":
          return sum + (payment.montoEfectivo || 0);
        case "Tarjeta":
          return sum + (payment.montoTarjeta || 0);
        case "Pago Móvil":
          return sum + (payment.montoPagoMovil || 0);
        default:
          return sum + payment.cantidad;
      }
    }, 0);
    setTotalPaid(total);
  }, [payments]);

  useEffect(() => {
    // Calcular total general
    if (orderDetails?.products) {
      // Calcular costo de productos
      const totalProductCost = orderDetails.products.reduce((total: number, item: any) => {
        const quantity = item.CantidadUtilizada || 0;
        const price = item.PrecioProducto || 0;
        return total + (quantity * price);
      }, 0);

      // Calcular costo de mano de obra (actividades únicas)
      const uniqueActivities = Array.from(new Map(orderDetails.products.map((item: any) => [
        `${item.CodigoServicio}-${item.NumeroCorrelativoActividad}`,
        { Costo_Act: item.Costo_Act }
      ])).values());
      
      const totalLaborCost = uniqueActivities.reduce((total: number, act: any) => {
        const costo = Number(act && act.Costo_Act) || 0;
        return total + costo;
      }, 0);

      // Subtotal = productos + mano de obra
      const subtotalAmount = totalProductCost + totalLaborCost;
      setSubtotal(subtotalAmount);

      // Calcular descuento
      const discountAmountValue = (subtotalAmount * discountPercentage) / 100;
      setDiscountAmount(discountAmountValue);

      // Subtotal después del descuento
      const subtotalAfterDiscount = subtotalAmount - discountAmountValue;

      // Calcular IVA (16%)
      const ivaValue = subtotalAfterDiscount * 0.16;
      setIvaAmount(ivaValue);

      // Total de la factura = subtotal después del descuento + IVA
      setGrandTotal(subtotalAfterDiscount + ivaValue);
    }
  }, [orderDetails, discountPercentage]);

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

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/service_order/franchise/${rif}/${numeroOrden}/details`);
      if (!res.ok) throw new Error("Error cargando detalles de la orden");
      const data = await res.json();
      setOrderDetails(data);
      setOrderDetail(data.order);
    } catch (err) {
      console.error("Error:", err);
      setOrderDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerFrequency = async () => {
    if (!orderDetail?.CI_Cliente) return;
    
    try {
      const res = await fetch(`http://127.0.0.1:8000/customer/${orderDetail.CI_Cliente}/frequency_last_3_months`);
      if (!res.ok) throw new Error("Error cargando frecuencia del cliente");
      const data = await res.json();
      const frequency = data.frequency || 0;
      setCustomerFrequency(frequency);
      
      // Calculate discount based on frequency
      let discountPercent = 0;
      if (frequency >= 0 && frequency <= 2) {
        discountPercent = 5;
      } else if (frequency >= 3 && frequency <= 5) {
        discountPercent = 10;
      } else if (frequency >= 6) {
        discountPercent = 15;
      }
      
      setDiscountPercentage(discountPercent);
    } catch (err) {
      console.error("Error fetching customer frequency:", err);
      setCustomerFrequency(0);
      setDiscountPercentage(0);
    }
  };

  const addPayment = () => {
    setPayments([...payments, { 
      metodo: "Efectivo", 
      cantidad: 0, 
      descripcion: "",
      montoEfectivo: 0,
      monedaEfectivo: "Dolar"
    }]);
  };

  const removePayment = (index: number) => {
    const newPayments = payments.filter((_, i) => i !== index);
    setPayments(newPayments);
  };

  const updatePayment = (index: number, field: string, value: any) => {
    const newPayments = [...payments];
    newPayments[index] = { ...newPayments[index], [field]: value };
    
    // Update the cantidad field based on the payment method
    switch (newPayments[index].metodo) {
      case "Efectivo":
        newPayments[index].cantidad = newPayments[index].montoEfectivo || 0;
        break;
      case "Tarjeta":
        newPayments[index].cantidad = newPayments[index].montoTarjeta || 0;
        break;
      case "Pago Móvil":
        newPayments[index].cantidad = newPayments[index].montoPagoMovil || 0;
        break;
    }
    
    setPayments(newPayments);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateInput: string | Date) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString ? timeString.substring(0, 5) : "";
  };

  const calculateTotalProducts = (): number => {
    if (!orderDetails?.products) return 0;
    return orderDetails.products.reduce((total: number, item: any) => total + (item.CantidadUtilizada || 0), 0);
  };

  const calculateTotalCost = (): number => {
    if (!orderDetails?.products) return 0;
    return orderDetails.products.reduce((total: number, item: any) => {
      const quantity = item.CantidadUtilizada || 0;
      const price = item.PrecioProducto || 0;
      return total + (quantity * price);
    }, 0);
  };

  const calculateTotalLaborCost = (): number => {
    if (!orderDetails?.products) return 0;
    const uniqueActivities = Array.from(new Map(orderDetails.products.map((item: any) => [
      `${item.CodigoServicio}-${item.NumeroCorrelativoActividad}`,
      { Costo_Act: item.Costo_Act }
    ])).values()) as Array<{ Costo_Act: any }>;
    
    return uniqueActivities.reduce((total: number, act) => {
      const costoAct = Number(act.Costo_Act || 0);
      return total + costoAct;
    }, 0);
  };

  const generateInvoice = async () => {
    // Verificar si hay al menos un método de pago
    if (payments.length === 0) {
      alert("Debe agregar al menos un método de pago");
      return;
    }

    // Verificar si hay al menos un -1 o si los montos suman correctamente
    const hayMenosUno = payments.some(p => p.cantidad === -1);
    const totalPagosEspecificos = payments
      .filter(p => p.cantidad !== -1)
      .reduce((sum, p) => sum + p.cantidad, 0);
    
    if (!hayMenosUno) {
      // Si no hay -1, verificar que los montos sumen correctamente
      const tolerance = 0.01; // 1 centavo de tolerancia
      if (Math.abs(totalPagosEspecificos - grandTotal) > tolerance) {
        alert(`El total pagado (${formatCurrency(totalPagosEspecificos)}) debe ser igual al total de la factura (${formatCurrency(grandTotal)}) o usar -1 para pagar el restante`);
        return;
      }
    } else {
      // Si hay -1, verificar que no se exceda el total
      if (totalPagosEspecificos > grandTotal) {
        alert(`El total de pagos específicos (${formatCurrency(totalPagosEspecificos)}) no puede exceder el total de la factura (${formatCurrency(grandTotal)})`);
        return;
      }
    }

    try {
      const invoiceData = {
        NumeroOrden: parseInt(numeroOrden),
        FranquiciaRIF: rif,
        FechaFactura: new Date().toISOString().split('T')[0],
        MontoTotal: grandTotal,
        PorcentajeDescuento: discountPercentage,  // Enviar el porcentaje de descuento
        MontoIVA: ivaAmount,  // Enviar el monto del IVA
        MetodosPago: payments.map(p => ({
          Metodo: p.metodo,
          Cantidad: p.cantidad,
          Descripcion: p.descripcion || `${p.metodo}`,
          // Tarjeta fields
          FechaTarjeta: p.fechaTarjeta,
          MontoTarjeta: p.montoTarjeta,
          BancoTarjeta: p.bancoTarjeta,
          ModalidadTarjeta: p.modalidadTarjeta,
          NumeroTarjeta: p.numeroTarjeta,
          // Efectivo fields
          MontoEfectivo: p.montoEfectivo,
          MonedaEfectivo: p.monedaEfectivo,
          // Pago Móvil fields
          FechaPagoMovil: p.fechaPagoMovil,
          TelefonoPagoMovil: p.telefonoPagoMovil,
          ReferenciaPagoMovil: p.referenciaPagoMovil,
          MontoPagoMovil: p.montoPagoMovil,
        }))
      };

      const res = await fetch("http://127.0.0.1:8000/invoice/create_with_payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Error al generar la factura");
      }

      const data = await res.json();
      alert("Factura generada correctamente");
      router.push(`/dashboard/franchise/${rif}/orders`);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const renderPaymentFields = (payment: PaymentData, index: number) => {
    switch (payment.metodo) {
      case "Tarjeta":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Pago
              </label>
              <input
                type="date"
                value={payment.fechaTarjeta || ""}
                onChange={(e) => updatePayment(index, 'fechaTarjeta', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="-1"
                  value={payment.montoTarjeta || ""}
                  onChange={(e) => updatePayment(index, 'montoTarjeta', parseFloat(e.target.value) || 0)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="0.00"
                />
                <button
                  type="button"
                  onClick={() => updatePayment(index, 'montoTarjeta', -1)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                    payment.montoTarjeta === -1 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                  title="Usar -1 para pagar el restante"
                >
                  -1
                </button>
              </div>
              {payment.montoTarjeta === -1 && (
                <p className="text-xs text-blue-600 mt-1">
                  💡 Pagará el monto restante de la factura
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banco
              </label>
              <input
                type="text"
                value={payment.bancoTarjeta || ""}
                onChange={(e) => updatePayment(index, 'bancoTarjeta', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Nombre del banco"
                maxLength={50}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modalidad
              </label>
              <select
                value={payment.modalidadTarjeta || ""}
                onChange={(e) => updatePayment(index, 'modalidadTarjeta', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Seleccionar modalidad</option>
                <option value="Ahorro">Ahorro</option>
                <option value="Corriente">Corriente</option>
                <option value="Crédito">Crédito</option>
                <option value="Débito">Débito</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Tarjeta
              </label>
              <input
                type="text"
                value={payment.numeroTarjeta || ""}
                onChange={(e) => updatePayment(index, 'numeroTarjeta', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="1234567890123456"
                maxLength={16}
                minLength={16}
              />
            </div>
          </div>
        );

      case "Efectivo":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="-1"
                  value={payment.montoEfectivo || ""}
                  onChange={(e) => updatePayment(index, 'montoEfectivo', parseFloat(e.target.value) || 0)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="0.00"
                />
                <button
                  type="button"
                  onClick={() => updatePayment(index, 'montoEfectivo', -1)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                    payment.montoEfectivo === -1 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                  title="Usar -1 para pagar el restante"
                >
                  -1
                </button>
              </div>
              {payment.montoEfectivo === -1 && (
                <p className="text-xs text-blue-600 mt-1">
                  💡 Pagará el monto restante de la factura
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Moneda
              </label>
              <select
                value={payment.monedaEfectivo || "Dolar"}
                onChange={(e) => updatePayment(index, 'monedaEfectivo', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
              >
                <option value="Dolar">Dólar (USD)</option>
                <option value="Bolivar">Bolívar (VES)</option>
                <option value="Euro">Euro (EUR)</option>
              </select>
            </div>
          </div>
        );

      case "Pago Móvil":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Pago
              </label>
              <input
                type="date"
                value={payment.fechaPagoMovil || ""}
                onChange={(e) => updatePayment(index, 'fechaPagoMovil', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="text"
                value={payment.telefonoPagoMovil || ""}
                onChange={(e) => updatePayment(index, 'telefonoPagoMovil', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="04121234567"
                maxLength={12}
                minLength={12}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Referencia
              </label>
              <input
                type="text"
                value={payment.referenciaPagoMovil || ""}
                onChange={(e) => updatePayment(index, 'referenciaPagoMovil', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Número de referencia"
                maxLength={50}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="-1"
                  value={payment.montoPagoMovil || ""}
                  onChange={(e) => updatePayment(index, 'montoPagoMovil', parseFloat(e.target.value) || 0)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="0.00"
                />
                <button
                  type="button"
                  onClick={() => updatePayment(index, 'montoPagoMovil', -1)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                    payment.montoPagoMovil === -1 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                  title="Usar -1 para pagar el restante"
                >
                  -1
                </button>
              </div>
              {payment.montoPagoMovil === -1 && (
                <p className="text-xs text-blue-600 mt-1">
                  💡 Pagará el monto restante de la factura
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
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

  if (!orderDetail) {
    return (
      <SectionMain>
        <div className="text-center">
          <p>No se encontró la orden de servicio</p>
        </div>
      </SectionMain>
    );
  }

  return (
    <>
      <Head>
        <title>{getPageTitle("Generar Factura")}</title>
      </Head>

      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiReceipt}
          title={`Generar Factura - Orden #${numeroOrden}`}
          main
        >
          <Button
            href={`/dashboard/franchise/${rif}/orders`}
            color="info"
            label="Volver"
            roundedFull
          />
        </SectionTitleLineWithButton>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <CardBox className="bg-white shadow-lg">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i className="mdi mdi-information text-blue-600 mr-2"></i>
                Información de la Orden
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Número de Orden:</span>
                  <span className="font-semibold">#{orderDetail?.NumeroOrden}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Fecha de Entrada:</span>
                  <span className="font-semibold">{formatDate(orderDetail?.FechaOrden)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Hora de Entrada:</span>
                  <span className="font-semibold">{formatTime(orderDetail?.HoraEntrada)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estado:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    orderDetail?.Estado === "Completado" 
                      ? "bg-green-100 text-green-800" 
                      : orderDetail?.Estado === "A Facturar"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {orderDetail?.Estado}
                  </span>
                </div>
                {orderDetail?.FechaSalidaReal && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Fecha de Salida:</span>
                    <span className="font-semibold">{formatDate(orderDetail.FechaSalidaReal)}</span>
                  </div>
                )}
                {orderDetail?.HoraSalidaReal && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Hora de Salida:</span>
                    <span className="font-semibold">{formatTime(orderDetail.HoraSalidaReal)}</span>
                  </div>
                )}
              </div>
            </div>
          </CardBox>

          <CardBox className="bg-white shadow-lg">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i className="mdi mdi-account text-blue-600 mr-2"></i>
                Información del Cliente
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Nombre:</span>
                  <span className="font-semibold">{orderDetail?.NombreCliente}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">CI:</span>
                  <span className="font-semibold">{orderDetail?.CI_Cliente}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Vehículo:</span>
                  <span className="font-semibold">#{orderDetail?.CodigoVehiculo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Placa:</span>
                  <span className="font-semibold">{orderDetail?.Placa}</span>
                </div>
                {orderDetail?.Comentario && (
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600">Comentario:</span>
                    <span className="font-semibold text-right max-w-xs">{orderDetail.Comentario}</span>
                  </div>
                )}
              </div>
            </div>
          </CardBox>
        </div>

          {/* Resumen de Pagos */}
          <CardBox>
            <h3 className="text-lg font-semibold mb-4">Resumen de Pagos</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Total Productos:</span>
                <span className="text-sm text-gray-600">{formatCurrency(calculateTotalCost())}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Mano de Obra:</span>
                <span className="text-sm text-sm text-gray-600">{formatCurrency(calculateTotalLaborCost())}</span>
              </div>
              <Divider />
              <div className="flex justify-between">
                <span className="font-medium">Subtotal:</span>
                <span className="text-lg font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              {discountPercentage > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="font-medium">Frecuencia del Cliente (últimos 3 meses):</span>
                    <span className="text-sm text-blue-600 font-semibold">{customerFrequency} visitas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Descuento ({discountPercentage}%):</span>
                    <span className="text-lg font-semibold text-green-600">-{formatCurrency(discountAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Subtotal con Descuento:</span>
                    <span className="text-sm text-gray-600">{formatCurrency(subtotal - discountAmount)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="font-medium">IVA (16%):</span>
                <span className="text-sm text-gray-600">{formatCurrency(ivaAmount)}</span>
              </div>
              <Divider />
              <div className="flex justify-between">
                <span className="font-medium">Total Factura:</span>
                <span className="text-lg font-bold">{formatCurrency(grandTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Pagado:</span>
                <span className={`text-lg font-bold ${Math.abs(totalPaid - grandTotal) <= 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(totalPaid)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Diferencia:</span>
                <span className={`text-lg font-bold ${Math.abs(totalPaid - grandTotal) <= 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(totalPaid - grandTotal)}
                </span>
              </div>
            </div>
          </CardBox>

        <Divider />

        {/* Actividades de la Orden */}
        <CardBox className="bg-white shadow-lg mb-8">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <i className="mdi mdi-clipboard-list-outline text-blue-600 mr-2"></i>
              Actividades de la Orden
            </h3>
            {orderDetails?.products?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay actividades registradas para esta orden
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Servicio</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actividad</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Costo Mano de Obra</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from(new Map(orderDetails?.products?.map((item: any) => [
                        `${item.CodigoServicio}-${item.NumeroCorrelativoActividad}`,
                        { NombreServicio: item.NombreServicio, DescripcionActividad: item.DescripcionActividad, Costo_Act: item.Costo_Act }
                      ]) || []).values()).map((act: any, idx) => (
                        <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{act.NombreServicio}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{act.DescripcionActividad}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(Number(act?.Costo_Act || 0))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Divider />

                <div className="flex justify-end items-center mt-6">
                  <div className="text-right">
                    <p className="text-lg text-gray-600">Total Costo de Mano de Obra:</p>
                    <p className="text-3xl font-bold text-blue-600">{formatCurrency(calculateTotalLaborCost())}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardBox>

        {/* Productos Utilizados */}
        <CardBox className="bg-white shadow-lg">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <i className="mdi mdi-package text-blue-600 mr-2"></i>
              Productos Utilizados en la Orden
            </h3>

            {orderDetails?.products?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay productos registrados para esta orden
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Servicio</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actividad</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Producto</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Categoría</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cantidad Utilizada</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Precio Unitario</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails?.products?.map((product: any, index: number) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {product.NombreServicio}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {product.DescripcionActividad}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            <div>
                              <div className="font-medium">{product.NombreProducto}</div>
                              <div className="text-xs text-gray-500">{product.DescripcionProducto}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {product.Categoria}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {product.CantidadUtilizada}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {formatCurrency(Number(product.PrecioProducto) || 0)}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-red-600">
                            {formatCurrency((Number(product.CantidadUtilizada) || 0) * (Number(product.PrecioProducto) || 0))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Divider />

                <div className="flex justify-between items-center mt-6">
                  <div className="text-left">
                    <p className="text-sm text-gray-600">Total Productos Utilizados:</p>
                    <p className="text-lg font-semibold text-gray-800">{calculateTotalProducts()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg text-gray-600">Total Costo de Productos:</p>
                    <p className="text-3xl font-bold text-red-600">{formatCurrency(calculateTotalCost())}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardBox>

        <Divider />

        {/* Métodos de Pago */}
        <CardBox>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Métodos de Pago</h3>
            <Button
              type="button"
              onClick={addPayment}
              color="success"
              icon={mdiPlus}
              label="Agregar Pago"
              small
            />
          </div>

          {payments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No hay métodos de pago agregados. Haga clic en "Agregar Pago" para comenzar.
            </p>
          ) : (
            <div className="space-y-6">
              {payments.map((payment, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-lg">Pago #{index + 1}</h4>
                    <Button
                      type="button"
                      onClick={() => removePayment(index)}
                      color="danger"
                      icon={mdiClose}
                      small
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Método de Pago
                      </label>
                      <select
                        value={payment.metodo}
                        onChange={(e) => updatePayment(index, 'metodo', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                      >
                        {paymentMethods.map((method) => (
                          <option key={method.id} value={method.id}>
                            {method.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción (opcional)
                      </label>
                      <input
                        type="text"
                        value={payment.descripcion}
                        onChange={(e) => updatePayment(index, 'descripcion', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                        placeholder="Descripción del pago"
                      />
                    </div>
                  </div>

                  {/* Campos específicos según el método de pago */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h5 className="font-medium text-gray-800 mb-3">Detalles del Pago</h5>
                    {renderPaymentFields(payment, index)}
                  </div>

                  {/* Resumen del pago */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Monto de este pago:</span>
                      <span className="font-bold text-blue-600">
                        {formatCurrency(Number(payment.cantidad) || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBox>

        <Divider />

        {/* Botones de Acción */}
        <CardBox>
          <Buttons>
            <Button
              type="button"
              onClick={generateInvoice}
              color="success"
              label="Generar Factura"
              icon={mdiReceipt}
              disabled={payments.length === 0}
            />
            <Button
              type="button"
              onClick={() => router.push(`/dashboard/franchise/${rif}/orders`)}
              color="info"
              outline
              label="Cancelar"
            />
          </Buttons>
        </CardBox>
      </SectionMain>
    </>
  );
} 