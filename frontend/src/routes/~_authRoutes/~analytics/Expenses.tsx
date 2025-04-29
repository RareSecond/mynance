import { api } from "@/data/api";
import { useQuery } from "@tanstack/react-query";
import { AnalyticsTab } from "./AnalyticsTab";
import { Loader } from "@mantine/core";

export function Expenses() {
  const { data: analytics } = useQuery({
    queryKey: ["analyticsExpenses"],
    queryFn: async () => {
      const res = await api.get("/transaction/analytics");
      return res.data;
    },
  });

  if (!analytics) return <Loader />;

  return <AnalyticsTab analytics={analytics} />;
}
