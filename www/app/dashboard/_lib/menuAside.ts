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
  mdiAccountGroup,
  mdiBallotOutline,
  mdiEarth,
  mdiTree,
  mdiLeaf,
  mdiRecycle,
  mdiSprout,
  mdiWarehouse,
  mdiWrench,
  mdiClipboardList,
  mdiCarMultiple,
  mdiTagOutline,
  mdiPackageVariant,
  mdiTruckDelivery,
  mdiAccountMultiple,
} from "@mdi/js";
import { MenuAsideItem } from "../../_interfaces";

const menuAside: MenuAsideItem[] = [
  {
    href: "/dashboard",
    icon: mdiEarth,
    label: "Dashboard Ecológico",
  },
  {
    href: "/dashboard/franchise",
    icon: mdiStore,
    label: "Franquicias",
  },
  {
    href: "/dashboard/products",
    label: "Productos",
    icon: mdiPackageVariant,
  },
  {
    href: "/dashboard/brands",
    label: "Marcas",
    icon: mdiCarMultiple,
  },
  {
    href: "/dashboard/specialty",
    label: "Especialidades",
    icon: mdiTagOutline,
  },
  {
    href: "/dashboard/supplier-line",
    label: "Líneas de Suministro",
    icon: mdiPackage,
  },
  {
    href: "/dashboard/vendor",
    label: "Proveedores",
    icon: mdiTruckDelivery,
  },
  {
    href: "/dashboard/customer",
    label: "Clientes",
    icon: mdiAccountMultiple,
  },
  {
    href: "/dashboard/vehicle",
    label: "Vehículos",
    icon: mdiCar,
  },
];

export default menuAside;
