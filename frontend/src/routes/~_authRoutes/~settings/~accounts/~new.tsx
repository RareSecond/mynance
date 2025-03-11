import { createFileRoute } from "@tanstack/react-router";
import { SelectBank } from "./SelectBank";
import { Loader, Text } from "@mantine/core";

export const Route = createFileRoute("/_authRoutes/settings/accounts/new")({
  component: RouteComponent,
  validateSearch: (search: Record<string, string>) => {
    return {
      bankId: (search.bankId as string) || undefined,
    };
  },
});

function RouteComponent() {
  const { bankId } = Route.useSearch();

  if (!bankId) {
    return <SelectBank />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Loader />
      <Text>Adding account...</Text>
    </div>
  );
}
