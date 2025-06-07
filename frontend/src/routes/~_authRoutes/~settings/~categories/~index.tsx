import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/PageTitle";

export const Route = createFileRoute("/_authRoutes/settings/categories/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <PageTitle title="Categories" />
    </>
  );
}
