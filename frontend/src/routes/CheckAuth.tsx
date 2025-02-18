import { useQuery } from "@tanstack/react-query";
import { api } from "../data/api";

export function CheckAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{user?.username}</div>;
}
