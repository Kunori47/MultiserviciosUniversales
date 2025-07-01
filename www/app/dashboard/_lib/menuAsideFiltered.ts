import { UserRole } from "../../_hooks/useAuth";
import menuAside from "./menuAside";
import { MenuAsideItem } from "../../_interfaces";
import { mdiBallotOutline } from "@mdi/js";

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
    ];
  }

  // Por defecto, no mostrar nada
  return [];
}; 