import { Text } from "@mantine/core";

export function AnalyticsTab({ analytics }: { analytics: any }) {
  const total = analytics.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="flex flex-col gap-2">
      {analytics.map((item) => {
        const percentage = ((item.value / total) * 100).toFixed(1);
        return (
          <div key={item.name}>
            <div className="flex items-center gap-2">
              <Text className="text-lg font-bold flex-grow">{item.name}</Text>
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
  );
}
