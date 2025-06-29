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
  mdiCar,
  mdiTag,
  mdiReproduction,
  mdiPackage,
  mdiTruck,
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
    href: "/dashboard/brands",
    label: "Marcas",
    icon: mdiCar,
  },
  {
    href: "/dashboard/specialty",
    label: "Especialidades",
    icon: mdiTag,
  },
  {
    href: "/dashboard/supplier-line",
    label: "Linea de Suministros",
    icon: mdiPackage,
  },
  {
    href: "/dashboard/vendor",
    label: "Proveedores",
    icon: mdiTruck,
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
