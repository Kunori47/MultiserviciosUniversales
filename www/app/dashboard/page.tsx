"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_hooks/useAuth";
import {
  mdiAccountMultiple,
  mdiCartOutline,
  mdiChartTimelineVariant,
  mdiGithub,
  mdiMonitorCellphone,
  mdiCar,
} from "@mdi/js";
import Button from "../_components/Button";
import SectionMain from "../_components/Section/Main";
import SectionTitleLineWithButton from "../_components/Section/TitleLineWithButton";
import CardBoxWidget from "../_components/CardBox/Widget";
import CardBoxTransaction from "../_components/CardBox/Transaction";
import { Client, Transaction } from "../_interfaces";
import CardBoxClient from "../_components/CardBox/Client";
import SectionBannerStarOnGitHub from "../_components/Section/Banner/StarOnGitHub";
import CardBox from "../_components/CardBox";
import NotificationBar from "../_components/NotificationBar";
import TableSampleClients from "./_components/Table/SampleClients";
import { getPageTitle } from "../_lib/config";
import { clients, transactions } from "./_lib/sampleData";
import ChartLineSampleComponentBlock from "./_components/ChartLineSample/ComponentBlock";

export default function DashboardPage() {
  const router = useRouter();
  const { employee, loading, userRole, isManager } = useAuth();

  useEffect(() => {
    if (!loading && employee) {
      if (isManager && employee.FranquiciaRIF) {
        // Encargado: redirigir a su franquicia específica
        router.replace(`/dashboard/franchise/${employee.FranquiciaRIF}`);
      } else if (userRole === 'Empleado') {
        // Empleado: redirigir a órdenes de servicio
        router.replace('/dashboard/service-orders');
      } else if (userRole === 'Administrador') {
        // Administrador: puede ver el dashboard general
        // No redirigir, mostrar el dashboard
      } else {
        // Otros roles: redirigir a su franquicia si tienen una
        if (employee.FranquiciaRIF) {
          router.replace(`/dashboard/franchise/${employee.FranquiciaRIF}`);
        }
      }
    }
  }, [employee, loading, router, userRole, isManager]);

  // Si está cargando, mostrar loading
  if (loading) {
    return (
      <SectionMain>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Cargando...</span>
        </div>
      </SectionMain>
    );
  }

  // Solo mostrar dashboard general para administradores
  if (userRole !== 'Administrador') {
    return (
      <SectionMain>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Redirigiendo...</span>
        </div>
      </SectionMain>
    );
  }

  const clientsListed = clients.slice(0, 4);

  return (
    <SectionMain>
      <SectionTitleLineWithButton
        icon={mdiChartTimelineVariant}
        title="Dashboard General - Administrador"
        main
      >
        <Button
          href="/dashboard/franchise"
          color="info"
          label="Ver Franquicias"
          roundedFull
        />
      </SectionTitleLineWithButton>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
        <CardBoxWidget
          trendLabel="12%"
          trendType="up"
          trendColor="success"
          icon={mdiAccountMultiple}
          iconColor="success"
          number={512}
          label="Clients"
        />
        <CardBoxWidget
          trendLabel="16%"
          trendType="down"
          trendColor="danger"
          icon={mdiCartOutline}
          iconColor="info"
          number={7770}
          numberPrefix="$"
          label="Sales"
        />
        <CardBoxWidget
          trendLabel="Overflow"
          trendType="warning"
          trendColor="warning"
          icon={mdiChartTimelineVariant}
          iconColor="danger"
          number={256}
          numberSuffix="%"
          label="Performance"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="flex flex-col justify-between">
          {transactions.map((transaction: Transaction) => (
            <CardBoxTransaction
              key={transaction.id}
              transaction={transaction}
            />
          ))}
        </div>
        <div className="flex flex-col justify-between">
          {clientsListed.map((client: Client) => (
            <CardBoxClient key={client.id} client={client} />
          ))}
        </div>
      </div>

      <div className="my-6">
        <SectionBannerStarOnGitHub />
      </div>

      <ChartLineSampleComponentBlock />

      <SectionTitleLineWithButton icon={mdiAccountMultiple} title="Clients" />

      <NotificationBar color="info" icon={mdiMonitorCellphone}>
        <b>Responsive table.</b> Collapses on mobile
      </NotificationBar>

      <CardBox hasTable>
        <TableSampleClients clients={clients} />
      </CardBox>
    </SectionMain>
  );
}
