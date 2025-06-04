import { createFileRoute } from "@tanstack/react-router";
import { Card, Skeleton, Text, Button } from "@mantine/core";
import { match, P } from "ts-pattern";
import { SuccessIllustration } from "./SuccessIllustration";
import {
  useAccountControllerCreateAccounts,
  useRequisitionControllerGetAccounts,
} from "@/data/api";

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

  const { data: accounts } = useRequisitionControllerGetAccounts(ref || "", {
    query: {
      enabled: !!ref,
    },
  });

  const {
    mutate: createAccounts,
    isPending,
    isSuccess,
  } = useAccountControllerCreateAccounts();

  if (!ref) {
    return <div>No ref</div>;
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center ">
        <SuccessIllustration />
        <Text className="text-2xl font-bold mb-4">
          Accounts linked successfully
        </Text>
      </div>
    );
  }

  return (
    <div>
      <Text className="text-2xl font-bold mb-4">About to link accounts</Text>
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
            return (
              <>
                {accounts.map((account) => {
                  return (
                    <Card key={account.id} className="bg-dark-card">
                      <Text className="text-lg font-bold">{account.iban}</Text>
                      <Text className="text-sm text-gray-400">
                        {account.name}
                      </Text>
                    </Card>
                  );
                })}
                <Button
                  className="bg-purple-primary text-white disabled:bg-purple-light"
                  disabled={!accounts}
                  onClick={() =>
                    createAccounts({
                      data: {
                        externalRequisitionId: ref,
                        accounts: accounts.map((account) => account.id),
                      },
                    })
                  }
                  loading={isPending}
                >
                  Link accounts
                </Button>
              </>
            );
          })}
      </div>
    </div>
  );
}
