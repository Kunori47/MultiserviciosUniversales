import {
  mdiPlus,
  mdiTableBorder,
} from "@mdi/js";
import Button from "../../_components/Button";
import CardBox from "../../_components/CardBox";
import SectionMain from "../../_components/Section/Main";
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton";
import { getPageTitle } from "../../_lib/config";
import { fetchFranchises } from "../_lib/db";
import { Metadata } from "next";
import TableFranchise from "./table/Franchise";

export const metadata: Metadata = {
  title: getPageTitle("Franquicia"),
};

export default async function TablesPage() {
  const franchises = await fetchFranchises();

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
        <TableFranchise franchise={franchises} />
      </CardBox>
      
    </SectionMain>
  );
}
