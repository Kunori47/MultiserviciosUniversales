"use client";

import { ReactNode } from "react";
import { useRouteProtection } from "../_hooks/useRouteProtection";
import { useAuth } from "../_hooks/useAuth";
import SectionMain from "./Section/Main";

interface RouteProtectionProps {
  children: ReactNode;
  requiredRole?: 'Administrador' | 'Encargado' | 'both';
  requireFranchiseMatch?: boolean;
  fallbackComponent?: ReactNode;
}

export default function RouteProtection({ 
  children, 
  requiredRole = 'both',
  requireFranchiseMatch = false,
  fallbackComponent
}: RouteProtectionProps) {
  const { employee, userRole } = useRouteProtection();
  const { loading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <SectionMain>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Verificando permisos...</span>
        </div>
      </SectionMain>
    );
  }

  // Verificar si el usuario tiene el rol requerido
  const hasRequiredRole = requiredRole === 'both' || userRole === requiredRole;

  if (!hasRequiredRole) {
    return fallbackComponent ? (
      <>{fallbackComponent}</>
    ) : (
      <SectionMain>
        <div className="text-center py-8">
          <div className="text-red-600 text-xl font-bold mb-4">
            Acceso Denegado
          </div>
          <p className="text-gray-600">
            No tienes permisos para acceder a esta página.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Tu rol actual: {userRole}
          </p>
        </div>
      </SectionMain>
    );
  }

  // Si se requiere que coincida con la franquicia del usuario
  if (requireFranchiseMatch && employee) {
    const pathname = window.location.pathname;
    const match = pathname.match(/\/dashboard\/franchise\/([^\/]+)/);
    const urlRif = match ? match[1] : null;

    if (urlRif && urlRif !== employee.FranquiciaRIF) {
      return fallbackComponent ? (
        <>{fallbackComponent}</>
      ) : (
        <SectionMain>
          <div className="text-center py-8">
            <div className="text-red-600 text-xl font-bold mb-4">
              Acceso Denegado
            </div>
            <p className="text-gray-600">
              Solo puedes acceder a tu franquicia asignada.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Franquicia solicitada: {urlRif}
            </p>
          </div>
        </SectionMain>
      );
    }
  }

  // Si pasa todas las verificaciones, mostrar el contenido
  return <>{children}</>;
} 