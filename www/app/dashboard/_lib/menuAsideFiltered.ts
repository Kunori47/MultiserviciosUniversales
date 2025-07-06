import { UserRole } from "../../_hooks/useAuth";
import menuAside from "./menuAside";
import { MenuAsideItem } from "../../_interfaces";
import { mdiBallotOutline, mdiWrench } from "@mdi/js";

export const getFilteredMenu = (userRole: UserRole, franchiseRIF?: string): MenuAsideItem[] => {
  if (userRole === 'Administrador') {
    // Administrador tiene acceso a todo
    return menuAside;
  }

  if (userRole === 'Encargado') {
    // Encargado solo ve su franquicia específica
    return [
      {
        href: `/dashboard/franchise/${franchiseRIF}`,
        icon: menuAside.find(item => item.href === "/dashboard/franchise")?.icon,
        label: "Mi Franquicia",
      },
      {
        href: `/dashboard/franchise/${franchiseRIF}/orders`,
        icon: mdiBallotOutline,
        label: "Órdenes de Servicio",
      },
      {
        href: `/dashboard/franchise/${franchiseRIF}/employee`,
        icon: menuAside.find(item => item.href === "/dashboard/customer")?.icon,
        label: "Empleados",
      },
      {
        href: `/dashboard/franchise/${franchiseRIF}/inventory`,
        icon: menuAside.find(item => item.href === "/dashboard/products")?.icon,
        label: "Inventario",
      },
      {
        href: `/dashboard/customer`,
        icon: menuAside.find(item => item.href === "/dashboard/customer")?.icon,
        label: "Clientes",
      },
      {
        href: `/dashboard/vehicle`,
        icon: menuAside.find(item => item.href === "/dashboard/vehicle")?.icon,
        label: "Vehículos",
      },
      {
        label: "Órdenes de Servicio",
        icon: mdiWrench,
        menu: [
          {
            href: "/dashboard/service-orders/create",
            label: "Crear Orden de Servicio",
            icon: mdiWrench,
          },
          {
            href: "/dashboard/service-orders",
            label: "Ordenes de Servicio",
            icon: mdiWrench,
          },
          
        ],
      },
    ];
  }

  if (userRole === 'Empleado') {
    // Empleado solo ve órdenes de servicio
    return [
      {
        href: `/dashboard/service-orders`,
        icon: mdiBallotOutline,
        label: "Órdenes de Servicio",
      },
      {
        href: `/dashboard/vehicle`,
        icon: menuAside.find(item => item.href === "/dashboard/vehicle")?.icon,
        label: "Vehículos",
      },
    ];
  }

  // Por defecto, no mostrar nada
  return [];
}; 