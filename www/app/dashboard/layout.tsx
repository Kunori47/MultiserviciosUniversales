"use client";

import React, { ReactNode } from "react";
import { useState } from "react";
import { mdiForwardburger, mdiBackburger, mdiMenu, mdiLogout, mdiLeaf } from "@mdi/js";
import menuAside from "./_lib/menuAside";
import menuNavBar from "./_lib/menuNavBar";
import { getFilteredMenu } from "./_lib/menuAsideFiltered";
import Icon from "../_components/Icon";
import NavBar from "./_components/NavBar";
import NavBarItemPlain from "./_components/NavBar/Item/Plain";
import AsideMenu from "./_components/AsideMenu";
import FormField from "../_components/FormField";
import Button from "../_components/Button";
import { Field, Form, Formik } from "formik";
import { useAuth } from "../_hooks/useAuth";
import { useRouteProtection } from "../_hooks/useRouteProtection";
import { ecoClasses } from "../_lib/ecoTheme";
import "../css/eco-theme.css";

type Props = {
  children: ReactNode;
};

export default function LayoutAuthenticated({ children }: Props) {
  const [isAsideMobileExpanded, setIsAsideMobileExpanded] = useState(false);
  const [isAsideLgActive, setIsAsideLgActive] = useState(false);
  const { employee, franchise, loading, logout, isAuthenticated, userRole, isManager } = useAuth();

  // Aplicar protección de rutas
  useRouteProtection();

  // Obtener el menú filtrado basado en el rol del usuario
  const filteredMenu = getFilteredMenu(userRole, employee?.FranquiciaRIF);

  const handleRouteChange = () => {
    setIsAsideMobileExpanded(false);
    setIsAsideLgActive(false);
  };

  const layoutAsidePadding = "xl:pl-60";

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <span className="text-green-700 font-medium">Verificando autenticación...</span>
          <div className="mt-2 text-sm text-green-600">🌱 Cargando sistema ecológico</div>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (el hook ya redirige)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`overflow-hidden lg:overflow-visible`}>
      <div
        className={`${layoutAsidePadding} ${
          isAsideMobileExpanded ? "ml-60 lg:ml-0" : ""
        } pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50 dark:from-green-900 dark:via-blue-900 dark:to-cyan-900 dark:text-slate-100`}
      >
        <NavBar
          menu={menuNavBar}
          className={`${layoutAsidePadding} ${isAsideMobileExpanded ? "ml-60 lg:ml-0" : ""} bg-white/80 backdrop-blur-sm border-b border-green-200 dark:bg-gray-800/80 dark:border-green-700`}
        >
          <NavBarItemPlain
            display="flex lg:hidden"
            onClick={() => setIsAsideMobileExpanded(!isAsideMobileExpanded)}
          >
            <Icon
              path={isAsideMobileExpanded ? mdiBackburger : mdiForwardburger}
              size="24"
              className="text-green-600 hover:text-green-700 transition-colors"
            />
          </NavBarItemPlain>
          <NavBarItemPlain
            display="hidden lg:flex xl:hidden"
            onClick={() => setIsAsideLgActive(true)}
          >
            <Icon 
              path={mdiMenu} 
              size="24" 
              className="text-green-600 hover:text-green-700 transition-colors"
            />
          </NavBarItemPlain>
        </NavBar>
        <AsideMenu
          isAsideMobileExpanded={isAsideMobileExpanded}
          isAsideLgActive={isAsideLgActive}
          menu={filteredMenu}
          onAsideLgClose={() => setIsAsideLgActive(false)}
          onRouteChange={handleRouteChange}
        />
        <div className="relative">
          {/* Elementos decorativos ecológicos */}
          <div className="absolute top-0 left-0 w-full h-32 pointer-events-none">
            <div className="absolute top-4 left-4 w-8 h-8 bg-green-200 rounded-full opacity-30 animate-pulse"></div>
            <div className="absolute top-8 right-8 w-6 h-6 bg-blue-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
            <div className="absolute top-16 left-1/4 w-4 h-4 bg-cyan-200 rounded-full opacity-30 animate-pulse delay-2000"></div>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}
