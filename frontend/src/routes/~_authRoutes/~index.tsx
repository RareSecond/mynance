import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "./UserContext";

export const Route = createFileRoute("/_authRoutes/")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = useUser();

  return <div>Hello {user.email}!</div>;
}
