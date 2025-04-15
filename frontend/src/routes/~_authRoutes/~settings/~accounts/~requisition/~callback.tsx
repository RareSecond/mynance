import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "../../../../../data/api";
import { Card, Skeleton, Text, Button } from "@mantine/core";
import { match, P } from "ts-pattern";

export const Route = createFileRoute(
  "/_authRoutes/settings/accounts/requisition/callback"
)({
  component: RouteComponent,
  validateSearch: (search: Record<string, string>) => {
    return {
      ref: (search.ref as string) || undefined,
    };
  },
});

function RouteComponent() {
  const { ref } = Route.useSearch();

  const { data } = useQuery({
    queryKey: ["externalAccounts", ref],
    queryFn: () => api.get(`/requisition/${ref}/accounts`),
  });

  return (
    <div>
      <Text className="text-2xl font-bold mb-4">About to link accounts</Text>
      <div className="flex flex-col gap-4">
        {match(data)
          .with(P.nullish, () => (
            <>
              <Skeleton height={80} />
              <Skeleton height={80} />
              <Skeleton height={80} />
            </>
          ))
          .otherwise((data) => {
            return data.data.map((account) => {
              return (
                <Card key={account.id} className="bg-dark-card">
                  <Text className="text-lg font-bold">{account.iban}</Text>
                  <Text className="text-sm text-gray-400">{account.name}</Text>
                </Card>
              );
            });
          })}
        <Button
          className="bg-purple-primary text-white disabled:bg-purple-light"
          disabled={!data}
        >
          Link accounts
        </Button>
      </div>
    </div>
  );
}
