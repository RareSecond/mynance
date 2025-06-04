import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { UserContext } from "./~_authRoutes/UserContext";
import { BottomNavigation } from "./BottomNavigation";
import { useAuthControllerGetCurrentUser } from "@/data/api";

export const Route = createFileRoute("/_authRoutes")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user, isLoading } = useAuthControllerGetCurrentUser();

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
