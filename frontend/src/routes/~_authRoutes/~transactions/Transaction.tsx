import { Card, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Calendar, ChevronDown, Clock } from "lucide-react";

export function Transaction({ transaction }: { transaction: any }) {
  const [opened, handlers] = useDisclosure(false);

  return (
    <Card
      className="bg-dark-card p-4"
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
      {opened && (
        <>
          <Text className="text-text-muted text-sm">
            {transaction.description}
          </Text>
          <div className="flex items-center text-text-muted flex-row gap-1">
            <Calendar size={14} />
            <Text className=" text-sm">{transaction.createdAt}</Text>
          </div>
        </>
      )}
    </Card>
  );
}
