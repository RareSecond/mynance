import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_nonAuthRoutes")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
