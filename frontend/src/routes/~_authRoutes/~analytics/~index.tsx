import { PageTitle } from "@/components/PageTitle";
import { createFileRoute } from "@tanstack/react-router";
import { ActionIcon, Tabs, Text } from "@mantine/core";
import { AnalyticsTab } from "./AnalyticsTab";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { addMonths, format, startOfMonth, subMonths } from "date-fns";

export const Route = createFileRoute("/_authRoutes/analytics/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));

  return (
    <>
      <PageTitle title="Analytics" />
      <div className="flex items-center gap-2 mb-4">
        <ActionIcon
          color="primary"
          variant="light"
          size="lg"
          onClick={() => setStartDate(subMonths(startDate, 1))}
        >
          <ChevronLeft />
        </ActionIcon>
        <Text className="text-lg font-bold flex-grow text-center">
          {format(startDate, "MMMM yyyy")}
        </Text>
        <ActionIcon
          color="primary"
          variant="light"
          size="lg"
          onClick={() => setStartDate(addMonths(startDate, 1))}
        >
          <ChevronRight />
        </ActionIcon>
      </div>
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
          <AnalyticsTab type="expenses" startDate={startDate} />
        </Tabs.Panel>
        <Tabs.Panel value="income">
          <AnalyticsTab type="income" startDate={startDate} />
        </Tabs.Panel>
        <Tabs.Panel value="combined">
          <AnalyticsTab type="combined" startDate={startDate} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
