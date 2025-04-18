import { PageTitle } from "@/components/PageTitle";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/data/api";
import { PieChart } from "@mantine/charts";

function generateHexForString(str: string) {
  // Simple hash function to generate consistent colors for domain names
  const hash = str.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + acc * 31;
  }, 0);

  // Convert hash to hex color
  const color = Math.abs(hash).toString(16).substring(0, 6);
  return `#${color.padStart(6, "0")}`;
}

export const Route = createFileRoute("/_authRoutes/analytics/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: analytics } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await api.get("/transaction/analytics");
      return res.data;
    },
  });

  return (
    <>
      <PageTitle title="Analytics" />
      {analytics && (
        <PieChart
          data={analytics.map((item) => ({
            name: item.name,
            value: Math.round(Math.abs(item.value)),
            color: generateHexForString(item.name),
          }))}
          className="h-90"
          labelsPosition="outside"
          labelsType="value"
          withLabels
          pieProps={{
            label: (entry) => {
              return entry.name;
            },
          }}
        />
      )}
    </>
  );
}
