import {
  mdiAccountCircle,
  mdiMonitor,
  mdiAlertCircle,
  mdiBriefcase,
  mdiSquareEditOutline,
  mdiTable,
  mdiViewList,
  mdiTelevisionGuide,
  mdiStore,
  mdiRoomService,
} from "@mdi/js";
import { MenuAsideItem } from "../../_interfaces";

const menuAside: MenuAsideItem[] = [
  {
    href: "/dashboard",
    icon: mdiMonitor,
    label: "Dashboard",
  },
  {
    href: "/dashboard/franchise",
    icon: mdiStore,
    label: "Franquicia",
  },
  {
    href: "/dashboard/products",
    label: "Productos",
    icon: mdiRoomService,
  },
  {
    href: "/dashboard/ui",
    label: "UI",
    icon: mdiTelevisionGuide,
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: mdiAccountCircle,
  },
  {
    href: "/error",
    label: "Error",
    icon: mdiAlertCircle,
  },
  {
    label: "Administración",
    icon: mdiBriefcase,
    menu: [
      {
        label: "Marcas y Modelos",
        href: "/dashboard/administration/brands-models",
      },
      {
        label: "Planes de Mantenimiento",
        href: "/dashboard/administration/maintenance-plans",
      },
      {
        label: "Especialidades",
        href: "/dashboard/administration/specialty",
      },
      {
        label: "Lineas de Suministro",
        href: "/dashboard/administration/supply-lines",
      },
      {
        label: "Proveedores",
        href: "/dashboard/administration/suppliers",
      },
    ],
  },
];

export default menuAside;
