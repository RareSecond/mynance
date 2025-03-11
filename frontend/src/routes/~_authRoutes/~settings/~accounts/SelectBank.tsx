import { useNavigate } from "@tanstack/react-router";
import { Route } from "./~new";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../../data/api";
import { match, P } from "ts-pattern";
import { Text, Card } from "@mantine/core";

export function SelectBank() {
  const navigate = useNavigate({ from: Route.fullPath });

  const { data: banks } = useQuery<any[]>({
    queryKey: ["banks"],
    queryFn: async () => {
      const res = await api.get("/banks");
      return res.data;
    },
  });

  return (
    <div className="px-4">
      <Text>Add a new account</Text>
      {match(banks)
        .with(P.array(), (banks) => {
          return (
            <div className="flex flex-col gap-4">
              {banks.map((bank) => (
                <Card
                  key={bank.id}
                  className="flex flex-row items-center gap-4"
                  radius="lg"
                  onClick={() => {
                    navigate({
                      search: () => ({ bankId: bank.id }),
                    });
                  }}
                >
                  <img src={bank.logo} className="w-20 h-20 object-contain" />
                  <Text className="text-2xl font-bold">{bank.name}</Text>
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
