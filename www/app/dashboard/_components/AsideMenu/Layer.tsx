import React from "react";
import { mdiLogout, mdiClose, mdiLeaf } from "@mdi/js";
import Icon from "../../../_components/Icon";
import AsideMenuItem from "./Item";
import AsideMenuList from "./List";
import { MenuAsideItem } from "../../../_interfaces";
import { useAppSelector } from "../../../_stores/hooks";
import { useAuth } from "../../../_hooks/useAuth";

type Props = {
  menu: MenuAsideItem[];
  className?: string;
  onAsideLgCloseClick: () => void;
  onRouteChange: () => void;
};

export default function AsideMenuLayer({
  menu,
  className = "",
  ...props
}: Props) {
  const darkMode = useAppSelector((state) => state.darkMode.isEnabled);
  const { logout } = useAuth();

  const logoutItem: MenuAsideItem = {
    label: "Cerrar Sesión",
    icon: mdiLogout,
    color: "info",
    isLogout: true,
    href: "#",
  };

  const handleAsideLgCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    props.onAsideLgCloseClick();
  };

  return (
    <aside
      className={`${className} zzz lg:py-2 lg:pl-2 w-60 fixed flex z-40 top-0 h-screen transition-position overflow-hidden`}
    >
      <div
        className={`aside lg:rounded-2xl flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 border-r border-green-200 dark:border-green-700 shadow-lg`}
      >
        <div
          className={`aside-brand flex flex-row h-14 items-center justify-between bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-800 dark:to-blue-800 border-b border-green-200 dark:border-green-600`}
        >
          <div className="text-center flex-1 lg:text-left lg:pl-6 xl:text-center xl:pl-0">
            <div className="flex items-center justify-center lg:justify-start xl:justify-center">
              <Icon path={mdiLeaf} size="24" className="text-green-600 dark:text-green-400 mr-2" />
              <b className="font-black text-green-700 dark:text-green-300">EcoMenu</b>
            </div>
          </div>
          <button
            className="hidden lg:inline-block xl:hidden p-3 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
            onClick={handleAsideLgCloseClick}
          >
            <Icon path={mdiClose} />
          </button>
        </div>
        <div
          className={`flex-1 overflow-y-auto overflow-x-hidden ${
            darkMode ? "aside-scrollbars-[slate]" : "aside-scrollbars"
          } bg-gradient-to-b from-green-50/50 to-blue-50/50 dark:from-green-900/50 dark:to-blue-900/50`}
        >
          <AsideMenuList menu={menu} onRouteChange={props.onRouteChange} />
        </div>
        <ul className="border-t border-green-200 dark:border-green-700 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900 dark:to-pink-900">
          <AsideMenuItem item={logoutItem} onRouteChange={props.onRouteChange} />
        </ul>
      </div>
    </aside>
  );
}
