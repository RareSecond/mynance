import { api } from "@/data/api";
import { Loader, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { match, P } from "ts-pattern";

export function AnalyticsTab({
  type,
  startDate,
}: {
  type: "expenses" | "income" | "combined";
  startDate: Date;
}) {
  const { data: analytics } = useQuery({
    queryKey: ["analytics", type, startDate],
    queryFn: async () => {
      const res = await api.get("/transaction/analytics", {
        params: {
          type,
          startDate,
        },
      });
      return res.data;
    },
  });

  if (!analytics) return <Loader />;

  const totalExpenses = analytics
    .filter((item) => item.value < 0)
    .reduce((acc, item) => acc + item.value, 0);
  const totalIncome = analytics
    .filter((item) => item.value > 0)
    .reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="flex flex-col gap-2">
      {analytics.map((item) => {
        const percentage = match(item.value as number)
          .with(P.number.lte(0), () =>
            ((item.value / totalExpenses) * 100).toFixed(1)
          )
          .otherwise(() => ((item.value / totalIncome) * 100).toFixed(1));
        return (
          <div key={item.name}>
            <div className="flex items-center gap-2">
              <Text className="text-lg font-bold flex-grow">{item.name}</Text>
              <Text
                className="font-bold"
                style={{
                  color:
                    item.value < 0
                      ? "var(--color-status-danger)"
                      : "var(--color-status-success)",
                }}
              >
                {item.value.toFixed(2)} EUR
              </Text>
            </div>
            <div
              className="relative bg-status-danger rounded-md h-5"
              style={{
                width: `${percentage}%`,
                backgroundColor:
                  item.value < 0
                    ? "var(--color-status-danger)"
                    : "var(--color-status-success)",
              }}
            >
              <Text className="absolute left-1 top-1/2 -translate-y-1/2 text-xs text-shadow-md font-bold">
                {percentage}%
              </Text>
            </div>
          </div>
        );
      })}
    </div>
  );
}
