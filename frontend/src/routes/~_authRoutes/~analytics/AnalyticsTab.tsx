import { Text } from "@mantine/core";
import { match, P } from "ts-pattern";

export function AnalyticsTab({ analytics }: { analytics: any }) {
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
              <Text className="absolute left-1 top-1/2 -translate-y-1/2 text-xs">
                {percentage}%
              </Text>
            </div>
          </div>
        );
      })}
    </div>
  );
}
