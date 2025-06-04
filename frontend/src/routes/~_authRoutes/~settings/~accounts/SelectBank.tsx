import { useNavigate } from "@tanstack/react-router";
import { Route } from "./~new";
import { match, P } from "ts-pattern";
import { Text, Card } from "@mantine/core";
import { useBanksControllerGetBanks } from "@/data/api";

export function SelectBank() {
  const navigate = useNavigate({ from: Route.fullPath });

  const { data: banks } = useBanksControllerGetBanks();

  return (
    <div>
      <Text className="text-2xl font-bold mb-4 text-text-light">
        Add a new account
      </Text>
      {match(banks)
        .with(P.array(), (banks) => {
          return (
            <div className="flex flex-col gap-4">
              {banks.map((bank) => (
                <Card
                  key={bank.id}
                  className="flex flex-row items-center gap-4 bg-dark-card cursor-pointer"
                  radius="lg"
                  onClick={() => {
                    navigate({
                      search: () => ({ bankId: bank.id }),
                    });
                  }}
                >
                  <img
                    src={bank.logo}
                    className="w-10 h-10 object-contain"
                    alt={bank.name}
                  />
                  <Text className="text-md font-bold">{bank.name}</Text>
                </Card>
              ))}
            </div>
          );
        })
        .with(P.nullish, () => {
          return <div>No banks found</div>;
        })
        .exhaustive()}
    </div>
  );
}
