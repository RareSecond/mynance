import { P } from "ts-pattern";

import { Skeleton } from "@mantine/core";
import { match } from "ts-pattern";
import { Transaction } from "./Transaction";
import { useTransactionControllerListTransactions } from "@/data/api";

export function AllTransactions() {
  const { data: transactions } = useTransactionControllerListTransactions();

  return (
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
  );
}
