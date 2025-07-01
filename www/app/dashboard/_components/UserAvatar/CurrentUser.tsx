import React, { ReactNode } from "react";
import { useAppSelector } from "../../../_stores/hooks";
import { useAuth } from "../../../_hooks/useAuth";
import UserAvatar from ".";

type Props = {
  className?: string;
  children?: ReactNode;
};

export default function UserAvatarCurrentUser({
  className = "",
  children,
}: Props) {
  const userEmail = useAppSelector((state) => state.main.userEmail);
  const { employee, franchise, userRole } = useAuth();

  const displayName = employee?.NombreCompleto || userEmail || "Usuario";
  const roleText = userRole === 'Administrador' ? 'Administrador' : 
                   userRole === 'Encargado' ? 'Encargado' : 
                   userRole === 'Empleado' ? 'Empleado' : 'Usuario';
  const franchiseText = franchise?.Nombre || employee?.FranquiciaRIF || '';

  return (
    <UserAvatar username={displayName} className={className}>
      {children}
    </UserAvatar>
  );
}
