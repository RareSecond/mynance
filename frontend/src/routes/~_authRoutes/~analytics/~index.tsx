import { PageTitle } from "@/components/PageTitle";
import { createFileRoute } from "@tanstack/react-router";
import { Tabs } from "@mantine/core";
import { AnalyticsTab } from "./AnalyticsTab";

export const Route = createFileRoute("/_authRoutes/analytics/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <PageTitle title="Analytics" />
      <Tabs defaultValue="expenses">
        <Tabs.List className="mb-4 grid grid-cols-3">
          <Tabs.Tab
            value="expenses"
            className="data-[active]:border-purple-primary"
          >
            Expenses
          </Tabs.Tab>
          <Tabs.Tab
            value="income"
            className="data-[active]:border-purple-primary"
          >
            Income
          </Tabs.Tab>
          <Tabs.Tab
            value="combined"
            className="data-[active]:border-purple-primary"
          >
            Combined
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="expenses">
          <AnalyticsTab type="expenses" />
        </Tabs.Panel>
        <Tabs.Panel value="income">
          <AnalyticsTab type="income" />
        </Tabs.Panel>
        <Tabs.Panel value="combined">
          <AnalyticsTab type="combined" />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
