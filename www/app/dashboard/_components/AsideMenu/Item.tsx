"use client";

import React, { useEffect, useState } from "react";
import { mdiMinus, mdiPlus } from "@mdi/js";
import Icon from "../../../_components/Icon";
import Link from "next/link";
import { getButtonColor } from "../../../_lib/colors";
import AsideMenuList from "./List";
import { MenuAsideItem } from "../../../_interfaces";
import { usePathname } from "next/navigation";
import { useAuth } from "../../../_hooks/useAuth";

type Props = {
  item: MenuAsideItem;
  onRouteChange: () => void;
  isDropdownList?: boolean;
};

const AsideMenuItem = ({ item, isDropdownList = false, ...props }: Props) => {
  const [isLinkActive, setIsLinkActive] = useState(false);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const { logout } = useAuth();

  const activeClassAddon =
    !item.color && isLinkActive ? "aside-menu-item-active font-bold" : "";

  const pathname = usePathname();

  useEffect(() => {
    setIsLinkActive(item.href === pathname);
  }, [item.href, pathname]);

  const asideMenuItemInnerContents = (
    <>
      {item.icon && (
        <Icon
          path={item.icon}
          className={`flex-none ${activeClassAddon} text-green-600 dark:text-green-400`}
          w="w-16"
          size="18"
        />
      )}
      <span
        className={`grow text-ellipsis${
          item.menu ? "" : "pr-12"
        } ${activeClassAddon} text-green-700 dark:text-green-300`}
      >
        {item.label}
      </span>
      {item.menu && (
        <Icon
          path={isDropdownActive ? mdiMinus : mdiPlus}
          className={`flex-none ${activeClassAddon} text-green-600 dark:text-green-400`}
          w="w-12"
        />
      )}
    </>
  );

  const componentClass = [
    "flex cursor-pointer transition-all duration-200 hover:bg-green-100 dark:hover:bg-green-800/50",
    isDropdownList ? "py-3 px-6 text-sm" : "py-3",
    item.color
      ? getButtonColor(item.color, false, true)
      : `aside-menu-item dark:text-slate-300 dark:hover:text-white`,
    isLinkActive ? "bg-green-100 dark:bg-green-800/50 border-r-2 border-green-500" : "",
  ].join(" ");

  return (
    <li className="border-b border-green-100 dark:border-green-800/30 last:border-b-0">
      {item.href && !item.isLogout && (
        <Link
          href={item.href}
          target={item.target}
          className={componentClass}
          onClick={props.onRouteChange}
        >
          {asideMenuItemInnerContents}
        </Link>
      )}
      {item.href && item.isLogout && (
        <div
          className={`${componentClass} hover:bg-red-100 dark:hover:bg-red-800/50`}
          onClick={() => {
            logout();
            props.onRouteChange();
          }}
        >
          {asideMenuItemInnerContents}
        </div>
      )}
      {!item.href && (
        <div
          className={componentClass}
          onClick={() => setIsDropdownActive(!isDropdownActive)}
        >
          {asideMenuItemInnerContents}
        </div>
      )}
      {item.menu && (
        <AsideMenuList
          menu={item.menu}
          className={`aside-menu-dropdown ${
            isDropdownActive ? "block dark:bg-green-800/30" : "hidden"
          } bg-green-50/50 dark:bg-green-900/30`}
          onRouteChange={props.onRouteChange}
          isDropdownList
        />
      )}
    </li>
  );
};

export default AsideMenuItem;
