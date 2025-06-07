import { Card, Text, Button } from "@mantine/core";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Wallet, Tags } from "lucide-react";
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
        <Link
          to="/settings/accounts"
          className="flex items-center gap-2 px-3 py-2 -mx-2 -my-2 hover:bg-dark-card-hover rounded-lg transition-colors"
        >
          <Wallet size={20} />
          <Text className="text-lg">Linked Accounts</Text>
        </Link>
      </Card>
      <Text className="text-md text-text-muted ">Categories</Text>
      <Card className="bg-dark-card p-2 mb-4">
        <Link
          to="/settings/categories"
          className="flex items-center gap-2 px-3 py-2 -mx-2 -my-2 hover:bg-dark-card-hover rounded-lg transition-colors"
        >
          <Tags size={20} />
          <Text className="text-lg">Manage Categories</Text>
        </Link>
      </Card>
      <Text className="text-md text-text-muted ">User</Text>
      <Card className="bg-dark-card p-2 mb-4">
        <Text className="text-lg">Logged in as {user?.email}</Text>
      </Card>
      <a href="http://localhost:3000/auth/logout">
        <Button className="w-full" color="danger">
          Log out
        </Button>
      </a>
    </>
  );
}
