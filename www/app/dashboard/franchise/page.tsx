import {
  mdiGithub,
  mdiMonitorCellphone,
  mdiPlus,
  mdiTableBorder,
  mdiTableOff,
} from "@mdi/js";
import Button from "../../_components/Button";
import CardBox from "../../_components/CardBox";
import CardBoxComponentEmpty from "../../_components/CardBox/Component/Empty";
import NotificationBar from "../../_components/NotificationBar";
import SectionMain from "../../_components/Section/Main";
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton";
import TableSampleClients from "../_components/Table/SampleClients";
import { getPageTitle } from "../../_lib/config";
import { clients } from "../_lib/sampleData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: getPageTitle("Franquicia"),
};

export default function TablesPage() {
  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiTableBorder} title="Franquicia" main>
        <Button
            label={"Agregar"}
            icon={mdiPlus}
            color="info"
            href="/dashboard/franchise/create">

        </Button>


      </SectionTitleLineWithButton>


      <CardBox className="mb-6" hasTable>
        <TableSampleClients clients={clients} />
      </CardBox>
      
    </SectionMain>
  );
}
