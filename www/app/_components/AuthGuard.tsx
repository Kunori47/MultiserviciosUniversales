"use client";

import { ReactNode } from "react";
import { useAuth } from "../_hooks/useAuth";

interface AuthGuardProps {
  children: ReactNode;
  requireFranchise?: boolean;
}

export default function AuthGuard({ children, requireFranchise = false }: AuthGuardProps) {
  const { employee, franchise, loading, isAuthenticated } = useAuth();

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Verificando autenticación...</span>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (el hook ya redirige)
  if (!isAuthenticated) {
    return null;
  }

  // Si requiere franquicia pero el empleado no tiene una asignada
  if (requireFranchise && !franchise) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Acceso Restringido
          </h2>
          <p className="text-gray-600">
            No tienes una franquicia asignada para acceder a esta sección.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 