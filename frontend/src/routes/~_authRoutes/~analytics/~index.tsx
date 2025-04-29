import { PageTitle } from "@/components/PageTitle";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/data/api";
import { Text } from "@mantine/core";

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

  const total = analytics?.reduce((acc, item) => acc + item.value, 0);

  return (
    <>
      <PageTitle title="Analytics" />
      {analytics && (
        <div className="flex flex-col gap-2">
          {analytics.map((item) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={item.name}>
                <div className="flex items-center gap-2">
                  <Text className="text-lg font-bold flex-grow">
                    {item.name}
                  </Text>
                  <Text className="text-status-danger font-bold">
                    {item.value.toFixed(2)} EUR
                  </Text>
                </div>
                <div
                  className="relative bg-status-danger rounded-md h-5"
                  style={{ width: `${percentage}%` }}
                >
                  <Text className="absolute left-1 top-1/2 -translate-y-1/2 text-xs">
                    {percentage}%
                  </Text>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
