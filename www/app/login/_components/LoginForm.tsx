"use client";

import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppDispatch } from "../../_stores/hooks";
import { setUser } from "../../_stores/mainSlice";
import Button from "../../_components/Button";
import Buttons from "../../_components/Buttons";
import Divider from "../../_components/Divider";
import FormField from "../../_components/FormField";

type LoginForm = {
  cedula: string;
};

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (formValues: LoginForm) => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cedula: formValues.cedula }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Interceptar error de cédula no encontrada
        if (data.detail && data.detail.includes("No data found in Empleados")) {
          throw new Error("Cédula inválida");
        }
        throw new Error(data.detail || "Error de autenticación");
      }

      if (data.success) {
        // Guardar información del empleado y franquicia en localStorage
        localStorage.setItem("employee", JSON.stringify(data.employee));
        if (data.franchise) {
          localStorage.setItem("franchise", JSON.stringify(data.franchise));
        }
        
        // Actualizar el store inmediatamente con el nombre del empleado
        dispatch(setUser({
          name: data.employee.NombreCompleto,
          email: `${data.employee.CI}@empleado.com`
        }));
        
        // Redirigir al dashboard con el RIF de la franquicia
        if (data.employee.FranquiciaRIF) {
          router.push(`/dashboard/franchise/${data.employee.FranquiciaRIF}`);
        } else {
    router.push("/dashboard");
        }
      } else {
        setError("Error de autenticación");
      }
    } catch (err) {
      console.error("Error de login:", err);
      setError(err instanceof Error ? err.message : "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const initialValues: LoginForm = {
    cedula: ""
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Iniciar Sesión</h1>
      
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form>
          <FormField label="Cédula de Identidad" help="Introduzca su cédula de identidad">
            {({ className }) => (
              <Field 
                name="cedula" 
                className={className} 
                placeholder="Ej: V-12345678"
                disabled={loading}
              />
            )}
        </FormField>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

        <Divider />

        <Buttons>
            <Button 
              type="submit" 
              label={loading ? "Verificando..." : "Iniciar Sesión"} 
              color="info" 
              isGrouped 
              disabled={loading}
            />
        </Buttons>
      </Form>
    </Formik>
    </div>
  );
}
