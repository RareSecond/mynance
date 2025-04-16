import { PageTitle } from "@/components/PageTitle";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/data/api";
import { match, P } from "ts-pattern";
import { ActionIcon, Card, Skeleton, Text } from "@mantine/core";
import { ArrowUpRight, ChevronDown, ChevronDownCircle } from "lucide-react";
import { Transaction } from "./Transaction";
export const Route = createFileRoute("/_authRoutes/transactions/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: transactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await api.get("/transaction");
      return response.data;
    },
  });

  return (
    <div>
      <PageTitle title="Transactions" />
      <div className="flex flex-col gap-2">
        {match(transactions)
          .with(P.nullish, () => (
            <>
              <Skeleton height={57} />
              <Skeleton height={57} />
              <Skeleton height={57} />
            </>
          ))
          .otherwise((transactions) => (
            <>
              {transactions.map((transaction) => (
                <Transaction key={transaction.id} transaction={transaction} />
              ))}
            </>
          ))}
      </div>
    </div>
  );
}
