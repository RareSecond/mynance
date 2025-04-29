import { api } from "@/data/api";
import { Loader } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { AnalyticsTab } from "./AnalyticsTab";

export function Combined() {
  const { data: analytics } = useQuery({
    queryKey: ["analyticsCombined"],
    queryFn: async () => {
      const res = await api.get("/transaction/analytics", {
        params: {
          type: "combined",
        },
      });
      return res.data;
    },
  });

  if (!analytics) return <Loader />;

  return <AnalyticsTab analytics={analytics} />;
}
