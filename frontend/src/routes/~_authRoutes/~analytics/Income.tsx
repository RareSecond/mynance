import { api } from "@/data/api";
import { Loader } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { AnalyticsTab } from "./AnalyticsTab";

export function Income() {
  const { data: analytics } = useQuery({
    queryKey: ["analyticsIncome"],
    queryFn: async () => {
      const res = await api.get("/transaction/analytics", {
        params: {
          type: "income",
        },
      });
      return res.data;
    },
  });

  if (!analytics) return <Loader />;

  return <AnalyticsTab analytics={analytics} />;
}
