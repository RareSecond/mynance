import { createFileRoute } from "@tanstack/react-router";
import { SelectBank } from "./SelectBank";
import { StartLinkingProcess } from "./StartLinkingProcess";

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

  return <StartLinkingProcess bankId={bankId} />;
}
