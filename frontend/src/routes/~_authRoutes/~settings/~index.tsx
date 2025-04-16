import { Card, Text, NavLink, Button } from "@mantine/core";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { useUser } from "../UserContext";
import { PageTitle } from "@/components/PageTitle";

export const Route = createFileRoute("/_authRoutes/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = useUser();

  return (
    <>
      <PageTitle title="Settings" />
      <Text className="text-md text-text-muted ">Bank Accounts</Text>
      <Card className="bg-dark-card p-2 mb-4">
        <NavLink
          label="Linked Accounts"
          component={Link}
          to="/settings/accounts"
          leftSection={<Wallet />}
          classNames={{
            label: "text-lg",
          }}
        />
      </Card>
      <Text className="text-md text-text-muted ">User</Text>
      <Card className="bg-dark-card p-2 mb-4">
        <Text className="px-3 py-2 text-lg">Logged in as {user?.email}</Text>
      </Card>
      <a href="http://localhost:3000/auth/logout">
        <Button className="w-full" color="danger">
          Log out
        </Button>
      </a>
    </>
  );
}
