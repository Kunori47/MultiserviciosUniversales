"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../_stores/hooks";
import { setUser } from "../_stores/mainSlice";

interface Employee {
  CI: string;
  NombreCompleto: string;
  Rol: string;
  FranquiciaRIF: string;
}

export type UserRole = 'Administrador' | 'Encargado' | 'Empleado';

interface Franchise {
  RIF: string;
  Nombre: string;
  Direccion: string;
}

export const useAuth = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [franchise, setFranchise] = useState<Franchise | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const employeeData = localStorage.getItem("employee");
        const franchiseData = localStorage.getItem("franchise");

        if (!employeeData) {
          router.push("/login");
          return;
        }

        const employeeObj = JSON.parse(employeeData);
        setEmployee(employeeObj);
        
        // Actualizar el store con el nombre del empleado
        dispatch(setUser({
          name: employeeObj.NombreCompleto,
          email: `${employeeObj.CI}@empleado.com` // Email temporal basado en CI
        }));

        if (franchiseData) {
          setFranchise(JSON.parse(franchiseData));
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, dispatch]);

  const logout = () => {
    localStorage.removeItem("employee");
    localStorage.removeItem("franchise");
    // Resetear el store al hacer logout
    dispatch(setUser({
      name: "John Doe",
      email: "doe.doe.doe@example.com"
    }));
    router.push("/login");
  };

  return {
    employee,
    franchise,
    loading,
    logout,
    isAuthenticated: !!employee,
    userRole: employee?.Rol as UserRole,
    isAdmin: employee?.Rol === 'administrador',
    isManager: employee?.Rol === 'encargado',
    isEmployee: employee?.Rol === 'empleado',
  };
}; 