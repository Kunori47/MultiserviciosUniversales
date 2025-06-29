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
    href: "/dashboard/forms",
    label: "Forms",
    icon: mdiSquareEditOutline,
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
