import { Button, Card, Collapse, Text, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Calendar, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { Category } from "./Category";
import { TransactionResponseDto } from "@/data/api";
import { useState } from "react";

export function Transaction({
  transaction,
  defaultOpen = false,
}: {
  transaction: TransactionResponseDto;
  defaultOpen?: boolean;
}) {
  const [opened, handlers] = useDisclosure(defaultOpen);
  const [localTransaction, setLocalTransaction] = useState(transaction);

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
          <Category transaction={transaction} />
          <div onClick={(e) => e.stopPropagation()}>
            <Textarea
              placeholder="Note"
              value={localTransaction.note ?? ""}
              onChange={(e) => {
                setLocalTransaction({
                  ...localTransaction,
                  note: e.target.value,
                });
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
            >
              Save
            </Button>
          </div>
        </>
      </Collapse>
    </Card>
  );
}
