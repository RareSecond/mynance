import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { api } from "../data/api";
import { UserContext } from "./~_authRoutes/UserContext";
import { BottomNavigation } from "./BottomNavigation";

export const Route = createFileRoute("/_authRoutes")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data;
    },
    retry: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <UserContext.Provider value={{ email: user.email }}>
      <Outlet />
      <BottomNavigation />
    </UserContext.Provider>
  );
}
