import { Loader } from "@mantine/core";
import { useBanksControllerCreateLink } from "@/data/api";
import { useEffect } from "react";

export function StartLinkingProcess({ bankId }: { bankId: string }) {
  const { mutate: createLink } = useBanksControllerCreateLink({
    mutation: {
      onSuccess: (data) => {
        window.location.href = data.link;
      },
    },
  });

  useEffect(() => {
    createLink({
      data: {
        bankId,
      },
    });
  }, [bankId, createLink]);

  return <Loader />;
}
