import {
  getAccountControllerGetAccountQueryKey,
  useAccountControllerLinkUserToAccount,
  useUserControllerGetUser,
} from "@/data/api";
import { Button, Loader, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useQueryClient } from "@tanstack/react-query";

export function ConfirmLink({
  email,
  accountId,
}: {
  email: string;
  accountId: string;
}) {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useUserControllerGetUser(
    { email },
    {
      query: {
        enabled: !!email,
      },
    }
  );
  const { mutate: linkUserToAccount, isPending: isLinking } =
    useAccountControllerLinkUserToAccount({
      mutation: {
        onSuccess: async () => {
          await queryClient.refetchQueries({
            queryKey: getAccountControllerGetAccountQueryKey(accountId),
          });
          modals.closeAll();
        },
      },
    });

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <>
        <Text className="text-sm text-status-danger leading-none">
          User not found, please check the email address and try again.
        </Text>
      </>
    );
  }

  return (
    <>
      <Text className="text-sm text-status-warning leading-none">
        You are about to link the following user to this account. Please make
        sure this is correct before continuing.
      </Text>
      <Text className="my-4 text-lg font-bold text-center">{user.email}</Text>
      <Button
        className="w-full"
        color="primary"
        onClick={() =>
          linkUserToAccount({
            accountId,
            data: {
              userId: user.id,
            },
          })
        }
        loading={isLinking}
      >
        Link user
      </Button>
    </>
  );
}
