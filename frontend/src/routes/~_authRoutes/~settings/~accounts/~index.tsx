import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Card, Skeleton, Text } from "@mantine/core";
import { PageTitle } from "@/components/PageTitle";
import { match, P } from "ts-pattern";
import { CreditCard, RefreshCw, Settings } from "lucide-react";
import {
  useAccountControllerListAccounts,
  useTransactionControllerImportTransactions,
} from "@/data/api";

export const Route = createFileRoute("/_authRoutes/settings/accounts/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: accounts } = useAccountControllerListAccounts();

  const { mutate: importTransactions } =
    useTransactionControllerImportTransactions();

  return (
    <div>
      <PageTitle title="Accounts" />
      <div className="flex flex-col gap-4">
        {match(accounts)
          .with(P.nullish, () => (
            <>
              <Skeleton height={80} />
              <Skeleton height={80} />
              <Skeleton height={80} />
            </>
          ))
          .otherwise((accounts) => {
            return accounts.map((account) => (
              <Card key={account.id} className="bg-dark-card ">
                <Card.Section inheritPadding withBorder className="py-4">
                  <div className="flex items-center gap-2">
                    <CreditCard />
                    <Text className="text-lg font-bold">{account.iban}</Text>
                  </div>
                  <Text className="text-sm text-text-muted">
                    {account.name}
                  </Text>
                </Card.Section>
                <Card.Section
                  inheritPadding
                  withBorder
                  className="py-4 flex justify-between"
                >
                  <Button
                    size="sm"
                    leftSection={<RefreshCw size={12} />}
                    color="primary"
                    onClick={() =>
                      importTransactions({
                        data: {
                          accountId: account.id,
                        },
                      })
                    }
                  >
                    Fetch transactions
                  </Button>
                  <Link
                    to="/settings/accounts/$accountId"
                    params={{ accountId: account.id }}
                  >
                    <Button
                      size="sm"
                      variant="light"
                      color="primary"
                      leftSection={<Settings size={12} />}
                    >
                      Settings
                    </Button>
                  </Link>
                </Card.Section>
              </Card>
            ));
          })}
      </div>
    </div>
  );
}
