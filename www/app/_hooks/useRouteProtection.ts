"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./useAuth";

// Definir las rutas protegidas por rol
const ADMIN_ONLY_ROUTES = [
  "/dashboard/franchise",
  "/dashboard/products",
  "/dashboard/brands", 
  "/dashboard/specialty",
  "/dashboard/supplier-line",
  "/dashboard/vendor",
];

const MANAGER_ONLY_ROUTES = [
  "/dashboard/franchise/[rif]/employee",
  "/dashboard/franchise/[rif]/inventory", 
  "/dashboard/franchise/[rif]/orders",
  "/dashboard/franchise/[rif]/purchase",
  "/dashboard/franchise/[rif]/services",
];

// Rutas permitidas solo para empleados
const EMPLOYEE_ONLY_ROUTES = [
  "/dashboard/service-orders",
  "/dashboard/vehicle",
];

// Rutas que requieren que el usuario pertenezca a la franquicia específica
const FRANCHISE_SPECIFIC_ROUTES = [
  "/dashboard/franchise/[rif]",
  "/dashboard/franchise/[rif]/employee",
  "/dashboard/franchise/[rif]/inventory",
  "/dashboard/franchise/[rif]/orders", 
  "/dashboard/franchise/[rif]/purchase",
  "/dashboard/franchise/[rif]/services",
  "/dashboard/franchise/[rif]/profitability",
  "/dashboard/franchise/[rif]/revenue",
];

export const useRouteProtection = () => {
  const { employee, userRole, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // Esperar a que termine la carga de autenticación

    // Si no hay empleado autenticado, no hacer nada (el hook de auth ya maneja esto)
    if (!employee) return;

    // Verificar si la ruta actual requiere acceso de administrador
    const isAdminRoute = ADMIN_ONLY_ROUTES.some(route => {
      // Para rutas que no son de franquicia específica, usar startsWith
      if (route === "/dashboard/franchise") {
        // Solo bloquear /dashboard/franchise exacto, no las subrutas
        return pathname === "/dashboard/franchise";
      }
      return pathname.startsWith(route);
    });

    // Extraer el RIF de la URL si es una ruta de franquicia
    const franchiseMatch = pathname.match(/\/dashboard\/franchise\/([^\/]+)/);
    const urlRif = franchiseMatch ? franchiseMatch[1] : null;

    // Debug logs
    console.log("Route Protection Debug:", {
      pathname,
      userRole,
      employeeRif: employee.FranquiciaRIF,
      urlRif,
      isAdminRoute,
      isExactFranchiseRoute: pathname === "/dashboard/franchise"
    });

    // Lógica de protección de rutas
    if (userRole === 'Encargado') {
      console.log("Procesando Encargado - Ruta:", pathname);
      
      // 1. Encargado no puede acceder a rutas de administrador
      if (isAdminRoute) {
        console.warn("Acceso denegado: Encargado intentando acceder a ruta de administrador");
        router.replace(`/dashboard/franchise/${employee.FranquiciaRIF}`);
        return;
      }

      // 2. Si está en el dashboard principal, redirigir a su franquicia
      if (pathname === "/dashboard") {
        console.log("Redirigiendo Encargado del dashboard a su franquicia");
        router.replace(`/dashboard/franchise/${employee.FranquiciaRIF}`);
        return;
      }

      // 3. Si está accediendo a una franquicia diferente a la suya, redirigir
      if (urlRif && urlRif !== employee.FranquiciaRIF) {
        console.warn("Acceso denegado: Encargado intentando acceder a franquicia diferente");
        router.replace(`/dashboard/franchise/${employee.FranquiciaRIF}`);
        return;
      }

      // 4. Si está accediendo a su propia franquicia o a rutas permitidas, permitir acceso
      console.log("Permitiendo acceso a Encargado");
    }

    if (userRole === 'Empleado') {
      console.log("Procesando Empleado - Ruta:", pathname);
      
      // 1. Empleado solo puede acceder a órdenes de servicio
      const isEmployeeAllowedRoute = EMPLOYEE_ONLY_ROUTES.some(route => 
        pathname.startsWith(route)
      );
      
      if (!isEmployeeAllowedRoute) {
        console.warn("Acceso denegado: Empleado intentando acceder a ruta no permitida");
        router.replace("/dashboard/service-orders");
        return;
      }

      // 2. Si está en el dashboard principal, redirigir a órdenes de servicio
      if (pathname === "/dashboard") {
        console.log("Redirigiendo Empleado del dashboard a órdenes de servicio");
        router.replace("/dashboard/service-orders");
        return;
      }

      console.log("Permitiendo acceso a Empleado");
    }

    // Administrador puede acceder a todo
    if (userRole === 'Administrador') {
      return;
    }

  }, [pathname, employee, userRole, loading, router]);

  return {
    isAuthorized: true, // Este valor se puede usar para mostrar/ocultar elementos
    userRole,
    employee,
  };
}; 