import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="pt-8 px-4">
      <Outlet />
    </div>
  ),
});
