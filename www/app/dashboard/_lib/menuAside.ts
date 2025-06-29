import {
  mdiAccountCircle,
  mdiMonitor,
  mdiAlertCircle,
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
    label: "Dropdown",
    icon: mdiViewList,
    menu: [
      {
        label: "Item One",
      },
      {
        label: "Item Two",
      },
    ],
  },
];

export default menuAside;
