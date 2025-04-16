import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "../../../../data/api";
import { Card, Skeleton, Text } from "@mantine/core";
import { PageTitle } from "@/components/PageTitle";
import { match, P } from "ts-pattern";
import { CreditCard } from "lucide-react";

export const Route = createFileRoute("/_authRoutes/settings/accounts/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const response = await api.get("/account");
      return response.data;
    },
  });

  console.log(accounts);

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
                <div className="flex items-center gap-2">
                  <CreditCard />
                  <Text className="text-lg font-bold">{account.iban}</Text>
                </div>
                <Text className="text-sm text-text-muted">{account.name}</Text>
              </Card>
            ));
          })}
      </div>
    </div>
  );
}
