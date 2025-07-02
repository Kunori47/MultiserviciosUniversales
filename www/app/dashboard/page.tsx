"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_hooks/useAuth";
import {
  mdiAccountMultiple,
  mdiCartOutline,
  mdiChartTimelineVariant,
  mdiGithub,
  mdiMonitorCellphone,
  mdiCar,
  mdiChartBar,
  mdiStore,
  mdiCarMultiple,
  mdiTruckDelivery,
} from "@mdi/js";
import Button from "../_components/Button";
import SectionMain from "../_components/Section/Main";
import SectionTitleLineWithButton from "../_components/Section/TitleLineWithButton";
import CardBoxWidget from "../_components/CardBox/Widget";
import CardBoxTransaction from "../_components/CardBox/Transaction";
import { Client, Transaction } from "../_interfaces";
import CardBoxClient from "../_components/CardBox/Client";
import SectionBannerStarOnGitHub from "../_components/Section/Banner/StarOnGitHub";
import CardBox from "../_components/CardBox";
import NotificationBar from "../_components/NotificationBar";
import TableSampleClients from "./_components/Table/SampleClients";
import { getPageTitle } from "../_lib/config";
import { clients, transactions } from "./_lib/sampleData";
import ChartLineSampleComponentBlock from "./_components/ChartLineSample/ComponentBlock";

export default function DashboardPage() {
  const router = useRouter();
  const { employee, loading, userRole, isManager } = useAuth();
  const [customerCount, setCustomerCount] = useState<number>(0);
  const [customerCountLoading, setCustomerCountLoading] = useState(true);
  const [vehicleCount, setVehicleCount] = useState<number>(0);
  const [vehicleCountLoading, setVehicleCountLoading] = useState(true);
  const [employeeCount, setEmployeeCount] = useState<number>(0);
  const [employeeCountLoading, setEmployeeCountLoading] = useState(true);
  const [serviceStats, setServiceStats] = useState<any[]>([]);
  const [serviceStatsLoading, setServiceStatsLoading] = useState(true);
  const [franchiseComparison, setFranchiseComparison] = useState<Array<{
    RIF: string;
    Nombre: string;
    Direccion: string;
    CantidadServicios: number;
    TotalFacturacion: number;
    PromedioPorServicio: number;
  }>>([]);
  const [franchiseComparisonLoading, setFranchiseComparisonLoading] = useState(true);
  const [brandServiceStats, setBrandServiceStats] = useState<Array<{
    CodigoMarca: number;
    NombreMarca: string;
    Servicios: Array<{
      CodigoServicio: number;
      NombreServicio: string;
      Cantidad: number;
    }>;
  }>>([]);
  const [brandServiceStatsLoading, setBrandServiceStatsLoading] = useState(true);
  const [vendorSupplyStats, setVendorSupplyStats] = useState<Array<{
    RIF: string;
    RazonSocial: string;
    Direccion: string;
    TelefonoLocal: string;
    TelefonoCelular: string;
    PersonaContacto: string;
    CantidadProductos: number;
    Productos: Array<{
      CodigoProducto: number;
      NombreProducto: string;
      DescripcionProducto: string;
    }>;
  }>>([]);
  const [vendorSupplyStatsLoading, setVendorSupplyStatsLoading] = useState(true);

  useEffect(() => {
    if (!loading && employee) {
      if (isManager && employee.FranquiciaRIF) {
        // Encargado: redirigir a su franquicia específica
        router.replace(`/dashboard/franchise/${employee.FranquiciaRIF}`);
      } else if (userRole === 'Empleado') {
        // Empleado: redirigir a órdenes de servicio
        router.replace('/dashboard/service-orders');
      } else if (userRole === 'Administrador') {
        // Administrador: puede ver el dashboard general
        // No redirigir, mostrar el dashboard
        fetchCustomerCount();
        fetchVehicleCount();
        fetchEmployeeCount();
        fetchServiceStats();
        fetchFranchiseComparison();
        fetchBrandServiceStats();
        fetchVendorSupplyStats();
      } else {
        // Otros roles: redirigir a su franquicia si tienen una
        if (employee.FranquiciaRIF) {
      router.replace(`/dashboard/franchise/${employee.FranquiciaRIF}`);
        }
      }
    }
  }, [employee, loading, router, userRole, isManager]);

  const fetchCustomerCount = async () => {
    try {
      setCustomerCountLoading(true);
      const res = await fetch('http://127.0.0.1:8000/customer');
      if (!res.ok) throw new Error('Error obteniendo clientes');
      const customers = await res.json();
      setCustomerCount(Array.isArray(customers) ? customers.length : 0);
    } catch (error) {
      console.error('Error fetching customer count:', error);
      setCustomerCount(0);
    } finally {
      setCustomerCountLoading(false);
    }
  };

  const fetchVehicleCount = async () => {
    try {
      setVehicleCountLoading(true);
      const res = await fetch('http://127.0.0.1:8000/vehicle');
      if (!res.ok) throw new Error('Error obteniendo vehículos');
      const vehicles = await res.json();
      setVehicleCount(Array.isArray(vehicles) ? vehicles.length : 0);
    } catch (error) {
      console.error('Error fetching vehicle count:', error);
      setVehicleCount(0);
    } finally {
      setVehicleCountLoading(false);
    }
  };

  const fetchEmployeeCount = async () => {
    try {
      setEmployeeCountLoading(true);
      const res = await fetch('http://127.0.0.1:8000/employee');
      if (!res.ok) throw new Error('Error obteniendo empleados');
      const employees = await res.json();
      setEmployeeCount(Array.isArray(employees) ? employees.length : 0);
    } catch (error) {
      console.error('Error fetching employee count:', error);
      setEmployeeCount(0);
    } finally {
      setEmployeeCountLoading(false);
    }
  };

  const fetchServiceStats = async () => {
    try {
      setServiceStatsLoading(true);
      
      // Obtener todas las actividades de órdenes
      const orderActivitiesRes = await fetch('http://127.0.0.1:8000/orderxactivity');
      if (!orderActivitiesRes.ok) throw new Error('Error obteniendo actividades de órdenes');
      const orderActivities = await orderActivitiesRes.json();
      
      // Obtener todos los servicios
      const servicesRes = await fetch('http://127.0.0.1:8000/service');
      if (!servicesRes.ok) throw new Error('Error obteniendo servicios');
      const services = await servicesRes.json();
      
      if (Array.isArray(orderActivities) && Array.isArray(services)) {
        // Contar cuántas veces se solicita cada servicio
        const serviceCounts: { [key: number]: number } = {};
        
        orderActivities.forEach((activity: any) => {
          const serviceCode = activity.CodigoServicio;
          serviceCounts[serviceCode] = (serviceCounts[serviceCode] || 0) + 1;
        });
        
        // Crear array de estadísticas con información del servicio
        const stats = services.map((service: any) => ({
          CodigoServicio: service.CodigoServicio,
          NombreServicio: service.NombreServicio,
          CantidadSolicitudes: serviceCounts[service.CodigoServicio] || 0
        }));
        
        // Ordenar de más solicitado a menos solicitado
        stats.sort((a, b) => b.CantidadSolicitudes - a.CantidadSolicitudes);
        
        setServiceStats(stats);
      }
    } catch (error) {
      console.error('Error fetching service stats:', error);
      setServiceStats([]);
    } finally {
      setServiceStatsLoading(false);
    }
  };

  const fetchFranchiseComparison = async () => {
    try {
      setFranchiseComparisonLoading(true);
      
      // Obtener todas las franquicias
      const franchisesRes = await fetch('http://127.0.0.1:8000/franchise');
      if (!franchisesRes.ok) throw new Error('Error obteniendo franquicias');
      const franchises = await franchisesRes.json();
      
      if (Array.isArray(franchises)) {
        const comparisonData: Array<{
          RIF: string;
          Nombre: string;
          Direccion: string;
          CantidadServicios: number;
          TotalFacturacion: number;
          PromedioPorServicio: number;
        }> = [];
        
        for (const franchise of franchises) {
          try {
            // Obtener facturas por franquicia (que representan los servicios realizados)
            const invoicesRes = await fetch(`http://127.0.0.1:8000/invoice/franchise/${franchise.RIF}`);
            const invoices = invoicesRes.ok ? await invoicesRes.json() : [];
            
            // Calcular total de facturación
            const totalInvoicing = Array.isArray(invoices) 
              ? invoices.reduce((sum: number, invoice: any) => sum + (invoice.MontoTotal || 0), 0)
              : 0;
            
            // Calcular promedio por servicio (cada factura = un servicio)
            const avgPerService = Array.isArray(invoices) && invoices.length > 0 
              ? totalInvoicing / invoices.length 
              : 0;
            
            comparisonData.push({
              RIF: franchise.RIF,
              Nombre: franchise.Nombre,
              Direccion: franchise.Direccion,
              CantidadServicios: Array.isArray(invoices) ? invoices.length : 0,
              TotalFacturacion: totalInvoicing,
              PromedioPorServicio: avgPerService
            });
          } catch (error) {
            console.error(`Error obteniendo datos para franquicia ${franchise.RIF}:`, error);
            // Agregar franquicia con datos en cero si hay error
            comparisonData.push({
              RIF: franchise.RIF,
              Nombre: franchise.Nombre,
              Direccion: franchise.Direccion,
              CantidadServicios: 0,
              TotalFacturacion: 0,
              PromedioPorServicio: 0
            });
          }
        }
        
        // Ordenar por total de facturación (de mayor a menor)
        comparisonData.sort((a, b) => b.TotalFacturacion - a.TotalFacturacion);
        
        setFranchiseComparison(comparisonData);
      }
    } catch (error) {
      console.error('Error fetching franchise comparison:', error);
      setFranchiseComparison([]);
    } finally {
      setFranchiseComparisonLoading(false);
    }
  };

  const fetchBrandServiceStats = async () => {
    try {
      setBrandServiceStatsLoading(true);
      
      // Obtener todas las órdenes de servicio con detalles
      const ordersRes = await fetch('http://127.0.0.1:8000/service_order/all');
      if (!ordersRes.ok) throw new Error('Error obteniendo órdenes de servicio');
      const orders = await ordersRes.json();
      
      // Obtener todas las marcas
      const brandsRes = await fetch('http://127.0.0.1:8000/brand');
      if (!brandsRes.ok) throw new Error('Error obteniendo marcas');
      const brands = await brandsRes.json();
      
      // Obtener todos los servicios
      const servicesRes = await fetch('http://127.0.0.1:8000/service');
      if (!servicesRes.ok) throw new Error('Error obteniendo servicios');
      const services = await servicesRes.json();
      
      if (Array.isArray(orders) && Array.isArray(brands) && Array.isArray(services)) {
        // Crear mapa de servicios para acceso rápido
        const servicesMap = new Map(services.map((service: any) => [service.CodigoServicio, service.NombreServicio]));
        
        // Crear mapa de marcas para acceso rápido
        const brandsMap = new Map(brands.map((brand: any) => [brand.CodigoMarca, brand.Nombre]));
        
        // Contar servicios por marca
        const brandServiceCounts: { [key: number]: { [key: number]: number } } = {};
        
        orders.forEach((order: any) => {
          if (order.CodigoVehiculo && order.CodigoMarca) {
            const marcaCodigo = order.CodigoMarca;
            
            // Obtener actividades de esta orden
            const orderActivities = order.Actividades || [];
            
            orderActivities.forEach((activity: any) => {
              const serviceCode = activity.CodigoServicio;
              
              if (!brandServiceCounts[marcaCodigo]) {
                brandServiceCounts[marcaCodigo] = {};
              }
              
              if (!brandServiceCounts[marcaCodigo][serviceCode]) {
                brandServiceCounts[marcaCodigo][serviceCode] = 0;
              }
              
              brandServiceCounts[marcaCodigo][serviceCode]++;
            });
          }
        });
        
        // Crear array de estadísticas
        const stats = brands.map((brand: any) => {
          const marcaServices = brandServiceCounts[brand.CodigoMarca] || {};
          
          const servicios = Object.entries(marcaServices).map(([serviceCode, cantidad]) => ({
            CodigoServicio: parseInt(serviceCode),
            NombreServicio: servicesMap.get(parseInt(serviceCode)) || 'Servicio Desconocido',
            Cantidad: cantidad as number
          }));
          
          // Ordenar servicios por cantidad (de mayor a menor)
          servicios.sort((a, b) => b.Cantidad - a.Cantidad);
          
          return {
            CodigoMarca: brand.CodigoMarca,
            NombreMarca: brand.Nombre,
            Servicios: servicios
          };
        });
        
        // Filtrar solo marcas que tienen servicios
        const marcasConServicios = stats.filter(marca => marca.Servicios.length > 0);
        
        // Ordenar por total de servicios (de mayor a menor)
        marcasConServicios.sort((a, b) => {
          const totalA = a.Servicios.reduce((sum, service) => sum + service.Cantidad, 0);
          const totalB = b.Servicios.reduce((sum, service) => sum + service.Cantidad, 0);
          return totalB - totalA;
        });
        
        setBrandServiceStats(marcasConServicios);
      }
    } catch (error) {
      console.error('Error fetching brand service stats:', error);
      setBrandServiceStats([]);
    } finally {
      setBrandServiceStatsLoading(false);
    }
  };

  const fetchVendorSupplyStats = async () => {
    try {
      setVendorSupplyStatsLoading(true);
      
      // Obtener todos los proveedores
      const vendorsRes = await fetch('http://127.0.0.1:8000/vendor');
      if (!vendorsRes.ok) throw new Error('Error obteniendo proveedores');
      const vendors = await vendorsRes.json();
      
      // Obtener todos los productos
      const productsRes = await fetch('http://127.0.0.1:8000/product');
      if (!productsRes.ok) throw new Error('Error obteniendo productos');
      const products = await productsRes.json();
      
      if (Array.isArray(vendors) && Array.isArray(products)) {
        // Crear mapa de productos para acceso rápido
        const productsMap = new Map(products.map((product: any) => [product.CodigoProducto, product]));
        
        // Contar productos por proveedor
        const vendorProductCounts: { [key: string]: number[] } = {};
        
        // Obtener suministros para cada proveedor
        for (const vendor of vendors) {
          try {
            const suppliesRes = await fetch(`http://127.0.0.1:8000/supply/vendor/${vendor.RIF}`);
            const supplies = suppliesRes.ok ? await suppliesRes.json() : [];
            
            if (Array.isArray(supplies)) {
              vendorProductCounts[vendor.RIF] = supplies.map((supply: any) => supply.CodigoProducto);
            } else {
              vendorProductCounts[vendor.RIF] = [];
            }
          } catch (error) {
            console.error(`Error obteniendo suministros para proveedor ${vendor.RIF}:`, error);
            vendorProductCounts[vendor.RIF] = [];
          }
        }
        
        // Crear array de estadísticas
        const stats = vendors.map((vendor: any) => {
          const productosCodigos = vendorProductCounts[vendor.RIF] || [];
          
          const productos = productosCodigos.map((codigoProducto: number) => {
            const producto = productsMap.get(codigoProducto);
            return {
              CodigoProducto: codigoProducto,
              NombreProducto: producto ? producto.NombreProducto : 'Producto Desconocido',
              DescripcionProducto: producto ? producto.DescripcionProducto : 'Sin descripción'
            };
          });
          
          return {
            RIF: vendor.RIF,
            RazonSocial: vendor.RazonSocial,
            Direccion: vendor.Direccion,
            TelefonoLocal: vendor.TelefonoLocal,
            TelefonoCelular: vendor.TelefonoCelular,
            PersonaContacto: vendor.PersonaContacto,
            CantidadProductos: productos.length,
            Productos: productos
          };
        });
        
        // Ordenar por cantidad de productos (de mayor a menor)
        stats.sort((a, b) => b.CantidadProductos - a.CantidadProductos);
        
        setVendorSupplyStats(stats);
      }
    } catch (error) {
      console.error('Error fetching vendor supply stats:', error);
      setVendorSupplyStats([]);
    } finally {
      setVendorSupplyStatsLoading(false);
    }
  };

  // Si está cargando, mostrar loading
  if (loading) {
    return (
      <SectionMain>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Cargando...</span>
        </div>
      </SectionMain>
    );
  }

  // Solo mostrar dashboard general para administradores
  if (userRole !== 'Administrador') {
    return (
      <SectionMain>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Redirigiendo...</span>
        </div>
      </SectionMain>
    );
  }

  const clientsListed = clients.slice(0, 4);

  return (
    <SectionMain>
      <SectionTitleLineWithButton
        icon={mdiChartTimelineVariant}
        title="Dashboard General - Administrador"
        main
      >
        <Button
          href="/dashboard/franchise"
          color="info"
          label="Ver Franquicias"
          roundedFull
        />
      </SectionTitleLineWithButton>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
        <CardBoxWidget
          trendLabel="Total"
          trendType="up"
          trendColor="success"
          icon={mdiAccountMultiple}
          iconColor="success"
          number={customerCountLoading ? 0 : customerCount}
          label="Clientes"
        />
        <CardBoxWidget
          trendLabel="Total"
          trendType="up"
          trendColor="success"
          icon={mdiCar}
          iconColor="info"
          number={vehicleCountLoading ? 0 : vehicleCount}
          label="Vehículos"
        />
        <CardBoxWidget
          trendLabel="Total"
          trendType="up"
          trendColor="success"
          icon={mdiAccountMultiple}
          iconColor="success"
          number={employeeCountLoading ? 0 : employeeCount}
          label="Empleados"
        />
      </div>

      {/* Estadísticas de Servicios */}
      <SectionTitleLineWithButton icon={mdiChartBar} title="Estadísticas de Servicios" />

      <CardBox className="mb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900">Servicios Más Solicitados</h4>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm text-gray-500">Ordenados por demanda</span>
            </div>
          </div>

          {serviceStatsLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Cargando estadísticas...</span>
            </div>
          ) : serviceStats.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">No hay datos de servicios disponibles</p>
            </div>
          ) : (
            <div className="space-y-3">
              {serviceStats.map((service, index) => (
                <div key={service.CodigoServicio} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{service.NombreServicio}</h5>
                      <p className="text-sm text-gray-500">Código: #{service.CodigoServicio}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{service.CantidadSolicitudes}</div>
                    <div className="text-sm text-gray-500">
                      {service.CantidadSolicitudes === 1 ? 'solicitud' : 'solicitudes'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardBox>

      {/* Comparación entre Franquicias */}
      <SectionTitleLineWithButton icon={mdiStore} title="Comparación entre Franquicias" />

      <CardBox className="mb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900">Rendimiento por Franquicia</h4>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span className="text-sm text-gray-500">Ordenadas por facturación total</span>
            </div>
          </div>

          {franchiseComparisonLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <span className="ml-2 text-gray-600">Cargando comparación...</span>
            </div>
          ) : franchiseComparison.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">No hay datos de franquicias disponibles</p>
            </div>
          ) : (
            <div className="space-y-4">
              {franchiseComparison.map((franchise, index) => (
                <div key={franchise.RIF} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-lg ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h5 className="text-xl font-bold text-gray-900">{franchise.Nombre}</h5>
                        <p className="text-sm text-gray-500">RIF: {franchise.RIF}</p>
                        <p className="text-sm text-gray-500">{franchise.Direccion}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600">
                        ${franchise.TotalFacturacion.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">Total Facturado</div>
                    </div>
                  </div>
                  
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-blue-50 p-4 rounded-lg">
                       <div className="flex items-center justify-between">
                         <div>
                           <p className="text-sm font-medium text-blue-600">Servicios Realizados</p>
                           <p className="text-2xl font-bold text-blue-900">{franchise.CantidadServicios}</p>
                         </div>
                         <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                         </svg>
                       </div>
                     </div>
                     
                     <div className="bg-purple-50 p-4 rounded-lg">
                       <div className="flex items-center justify-between">
                         <div>
                           <p className="text-sm font-medium text-purple-600">Promedio por Servicio</p>
                           <p className="text-2xl font-bold text-purple-900">
                             ${franchise.PromedioPorServicio.toFixed(2)}
                           </p>
                         </div>
                         <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                         </svg>
                       </div>
                     </div>
                   </div>
                  
                  {index === 0 && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-yellow-800">
                          🏆 Franquicia con mayor facturación
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {index === franchiseComparison.length - 1 && franchiseComparison.length > 1 && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-red-800">
                          ⚠️ Franquicia con menor facturación
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardBox>

      {/* Estadísticas de Marcas por Servicio */}
      <SectionTitleLineWithButton icon={mdiCarMultiple} title="Marcas Más Atendidas por Servicio" />

      <CardBox className="mb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900">Análisis de Marcas por Tipo de Servicio</h4>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm text-gray-500">Ordenadas por demanda total</span>
            </div>
          </div>

          {brandServiceStatsLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              <span className="ml-2 text-gray-600">Cargando estadísticas de marcas...</span>
            </div>
          ) : brandServiceStats.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">No hay datos de marcas y servicios disponibles</p>
            </div>
          ) : (
            <div className="space-y-6">
              {brandServiceStats.map((marca, marcaIndex) => {
                const totalServicios = marca.Servicios.reduce((sum, service) => sum + service.Cantidad, 0);
                
                return (
                  <div key={marca.CodigoMarca} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg ${
                          marcaIndex === 0 ? 'bg-yellow-500' : 
                          marcaIndex === 1 ? 'bg-gray-400' : 
                          marcaIndex === 2 ? 'bg-orange-500' : 'bg-indigo-500'
                        }`}>
                          {marcaIndex + 1}
                        </div>
                        <div>
                          <h5 className="text-xl font-bold text-gray-900">{marca.NombreMarca}</h5>
                          <p className="text-sm text-gray-500">Código: #{marca.CodigoMarca}</p>
                          <p className="text-sm text-indigo-600 font-medium">
                            Total de servicios: {totalServicios}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">{totalServicios}</div>
                        <div className="text-sm text-gray-500">Servicios Totales</div>
        </div>
      </div>

                    <div className="space-y-3">
                      <h6 className="text-lg font-semibold text-gray-800 mb-3">Servicios por Tipo:</h6>
                      {marca.Servicios.map((servicio, servicioIndex) => (
                        <div key={servicio.CodigoServicio} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-white font-bold text-xs ${
                              servicioIndex === 0 ? 'bg-green-500' : 
                              servicioIndex === 1 ? 'bg-blue-500' : 
                              servicioIndex === 2 ? 'bg-purple-500' : 'bg-gray-500'
                            }`}>
                              {servicioIndex + 1}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{servicio.NombreServicio}</p>
                              <p className="text-sm text-gray-500">Código: #{servicio.CodigoServicio}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-indigo-600">{servicio.Cantidad}</div>
                            <div className="text-sm text-gray-500">
                              {servicio.Cantidad === 1 ? 'vez' : 'veces'}
                            </div>
                          </div>
                        </div>
                      ))}
      </div>

                    {marcaIndex === 0 && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium text-yellow-800">
                            🏆 Marca con mayor demanda de servicios
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardBox>

      {/* Estadísticas de Proveedores */}
      <SectionTitleLineWithButton icon={mdiTruckDelivery} title="Proveedores por Suministro" />

      <CardBox className="mb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900">Análisis de Proveedores por Cantidad de Productos</h4>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-sm text-gray-500">Ordenados por cantidad de productos</span>
            </div>
          </div>

          {vendorSupplyStatsLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
              <span className="ml-2 text-gray-600">Cargando estadísticas de proveedores...</span>
            </div>
          ) : vendorSupplyStats.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">No hay datos de proveedores disponibles</p>
            </div>
          ) : (
            <div className="space-y-6">
              {vendorSupplyStats.map((vendor, vendorIndex) => (
                <div key={vendor.RIF} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg ${
                        vendorIndex === 0 ? 'bg-yellow-500' : 
                        vendorIndex === 1 ? 'bg-gray-400' : 
                        vendorIndex === 2 ? 'bg-orange-500' : 'bg-teal-500'
                      }`}>
                        {vendorIndex + 1}
                      </div>
                      <div>
                        <h5 className="text-xl font-bold text-gray-900">{vendor.RazonSocial}</h5>
                        <p className="text-sm text-gray-500">RIF: {vendor.RIF}</p>
                        <p className="text-sm text-gray-500">{vendor.Direccion}</p>
                        <p className="text-sm text-teal-600 font-medium">
                          Contacto: {vendor.PersonaContacto}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-teal-600">{vendor.CantidadProductos}</div>
                      <div className="text-sm text-gray-500">Productos Suministrados</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-teal-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-teal-600">Teléfono Local</p>
                          <p className="text-sm text-teal-900">{vendor.TelefonoLocal || 'No disponible'}</p>
                        </div>
                        <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-600">Teléfono Celular</p>
                          <p className="text-sm text-blue-900">{vendor.TelefonoCelular || 'No disponible'}</p>
                        </div>
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {vendor.Productos.length > 0 && (
                    <div className="space-y-3">
                      <h6 className="text-lg font-semibold text-gray-800 mb-3">Productos Suministrados:</h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {vendor.Productos.map((producto, productoIndex) => (
                          <div key={producto.CodigoProducto} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 text-sm">{producto.NombreProducto}</p>
                                <p className="text-xs text-gray-500 mt-1">{producto.DescripcionProducto}</p>
                                <p className="text-xs text-gray-400 mt-1">Código: #{producto.CodigoProducto}</p>
                              </div>
                              <div className="ml-2">
                                <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-bold text-teal-600">{productoIndex + 1}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {vendorIndex === 0 && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-yellow-800">
                          🏆 Proveedor con mayor variedad de productos
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {vendorIndex === vendorSupplyStats.length - 1 && vendorSupplyStats.length > 1 && vendor.CantidadProductos === 0 && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-red-800">
                          ⚠️ Proveedor sin productos suministrados
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardBox>
    </SectionMain>
  );
}
