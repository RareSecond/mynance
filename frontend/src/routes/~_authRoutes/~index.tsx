import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "./UserContext";
import { Button } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authRoutes/")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = useUser();
  const navigate = useNavigate({ from: Route.fullPath });

  return (
    <>
      <div>Hello {user.email}!</div>
      <Button
        onClick={() => {
          navigate({
            to: "/settings/accounts/new",
            search: () => ({ bankId: undefined }),
          });
        }}
      >
        Logout
      </Button>
    </>
  );
}
