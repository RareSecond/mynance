import { PageTitle } from "@/components/PageTitle";
import { createFileRoute } from "@tanstack/react-router";
import { Tabs } from "@mantine/core";
import { AllTransactions } from "./AllTransactions";
import { Uncategorized } from "./Uncategorized";

export const Route = createFileRoute("/_authRoutes/transactions/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <PageTitle title="Transactions" />
      <Tabs defaultValue="uncategorized" keepMounted={false}>
        <Tabs.List className=" mb-4 grid grid-cols-2">
          <Tabs.Tab
            value="uncategorized"
            className="data-[active]:border-purple-primary"
          >
            Uncategorized
          </Tabs.Tab>
          <Tabs.Tab value="all" className="data-[active]:border-purple-primary">
            All
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="uncategorized">
          <Uncategorized />
        </Tabs.Panel>
        <Tabs.Panel value="all">
          <AllTransactions />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
