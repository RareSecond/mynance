import { Button, Card, Collapse, Text, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Calendar, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { Category, CategoryWithAmount } from "./Category";
import {
  getTransactionControllerListTransactionsQueryKey,
  TransactionResponseDto,
  useTransactionControllerUpdateTransaction,
} from "@/data/api";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function Transaction({
  transaction,
  defaultOpen = false,
}: {
  transaction: TransactionResponseDto;
  defaultOpen?: boolean;
}) {
  const [opened, handlers] = useDisclosure(defaultOpen);
  const [note, setNote] = useState(transaction.note ?? "");
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryWithAmount[]
  >(
    transaction.categories.map((tc) => ({
      categoryId: tc.category.id,
      categoryName: tc.category.name,
      amount: transaction.amount > 0 ? transaction.amount : -transaction.amount,
    }))
  );
  const queryClient = useQueryClient();

  const { mutate: updateTransaction, isPending } =
    useTransactionControllerUpdateTransaction({
      mutation: {
        onSuccess: () => {
          Promise.all([
            queryClient.refetchQueries({
              queryKey: getTransactionControllerListTransactionsQueryKey(),
            }),
            queryClient.refetchQueries({
              queryKey: getTransactionControllerListTransactionsQueryKey({
                uncategorizedOnly: true,
              }),
            }),
          ]);
        },
      },
    });

  const handleSave = () => {
    updateTransaction({
      transactionId: transaction.id,
      data: {
        note,
        categories: selectedCategories.map((cat) => ({
          categoryId: cat.categoryId,
          amount: cat.amount,
        })),
      },
    });
  };

  return (
    <Card
      className="bg-dark-card p-4 overflow-visible"
      key={transaction.id}
      onClick={handlers.toggle}
    >
      <div className="flex items-center flex-row justify-between gap-4">
        <Text truncate className="flex-1 text-text-light text-md font-bold">
          {transaction.counterPartyName}
        </Text>
        <Text
          className="text-sm font-bold"
          style={{
            color:
              transaction.amount > 0
                ? "var(--color-status-success)"
                : "var(--color-status-danger)",
          }}
        >
          {transaction.amount.toFixed(2)} {transaction.currency}
        </Text>
        <ChevronDown size={16} />
      </div>
      <Collapse in={opened}>
        <>
          <Text className="text-text-muted text-sm">
            {transaction.description}
          </Text>
          <div className="flex items-center text-text-muted flex-row gap-1">
            <Calendar size={14} />
            <Text className=" text-sm">
              {format(transaction.createdAt, "dd/MM/yyyy (HH:mm)")}
            </Text>
          </div>
          <Category
            transaction={transaction}
            onCategoriesChange={(categories) =>
              setSelectedCategories(categories)
            }
          />
          <div onClick={(e) => e.stopPropagation()}>
            <Textarea
              placeholder="Note"
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
              }}
              classNames={{
                wrapper: "mt-1",
                input: "bg-dark-secondary text-text-muted border-none",
              }}
            />
          </div>
          <div className="flex justify-end mt-2">
            <Button
              variant="light"
              color="success"
              size="xs"
              className="text-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              loading={isPending}
            >
              Save
            </Button>
          </div>
        </>
      </Collapse>
    </Card>
  );
}
