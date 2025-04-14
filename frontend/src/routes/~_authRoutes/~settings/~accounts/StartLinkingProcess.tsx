import { Loader } from "@mantine/core";
import { api } from "../../../../data/api";
import { useQuery } from "@tanstack/react-query";

export function StartLinkingProcess({ bankId }: { bankId: string }) {
  const { data: link } = useQuery({
    queryKey: ["banks", bankId],
    queryFn: async () => {
      const { data } = await api.get("/banks/link", {
        params: {
          bankId,
        },
      });
      return data;
    },
  });

  if (!link) {
    return <Loader />;
  } else {
    window.location.href = link;

    return null;
  }
}
