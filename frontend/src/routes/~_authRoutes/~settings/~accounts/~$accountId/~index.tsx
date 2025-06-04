import { PageTitle } from "@/components/PageTitle";
import { Button, Card, Skeleton, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";
import { match, P } from "ts-pattern";
import { LinkUserModal } from "./LinkUserModal";
import { useAccountControllerGetAccount } from "@/data/api";

export const Route = createFileRoute(
  "/_authRoutes/settings/accounts/$accountId/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { accountId } = Route.useParams();
  const { data: account } = useAccountControllerGetAccount(accountId || "");

  return (
    <>
      <PageTitle title="Account settings" />
      <Card className="bg-dark-card">
        {match(account)
          .with(P.nullish, () => <Skeleton height={80} className="w-full" />)
          .otherwise((account) => (
            <>
              <Text className="text-lg font-bold">{account.iban}</Text>
              <Text className="text-sm text-text-muted mb-4">
                {account.name}
              </Text>
              <div className="mb-2">
                {account.users.map((user) => (
                  <div key={user.id} className="flex items-center gap-2">
                    <User size={16} />
                    <Text key={user.id}>{user.email}</Text>
                  </div>
                ))}
              </div>
              <Button
                variant="light"
                color="primary"
                size="sm"
                onClick={() => {
                  modals.open({
                    title: "Add user to account",
                    classNames: {
                      body: "bg-dark-card",
                      header: "bg-dark-card",
                    },
                    children: <LinkUserModal accountId={accountId} />,
                  });
                }}
              >
                Add user
              </Button>
            </>
          ))}
      </Card>
    </>
  );
}
