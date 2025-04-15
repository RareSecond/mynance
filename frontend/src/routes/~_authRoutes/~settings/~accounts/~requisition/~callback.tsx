import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "../../../../../data/api";

export const Route = createFileRoute(
  "/_authRoutes/settings/accounts/requisition/callback"
)({
  component: RouteComponent,
  validateSearch: (search: Record<string, string>) => {
    return {
      ref: (search.ref as string) || undefined,
    };
  },
});

function RouteComponent() {
  const { ref } = Route.useSearch();

  const { data } = useQuery({
    queryKey: ["accounts", ref],
    queryFn: () =>
      api.get("/account", {
        params: {
          externalRequisitionId: ref,
        },
      }),
  });

  return (
    <div>
      Hello "/_authRoutes/requisition/callback"! You are looking for requisition{" "}
      {ref}
    </div>
  );
}
