import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/PageTitle";
import { Card, Text } from "@mantine/core";
import { useCategoryControllerFindAll } from "@/data/api";
import { match, P } from "ts-pattern";

export const Route = createFileRoute("/_authRoutes/settings/categories/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: categories } = useCategoryControllerFindAll();

  return (
    <>
      <PageTitle title="Categories" />
      <div className="flex flex-col gap-4">
        {match(categories)
          .with(P.nullish, () => (
            <Card className="bg-dark-card">
              <Text className="text-text-muted">Loading categories...</Text>
            </Card>
          ))
          .with([], () => (
            <Card className="bg-dark-card">
              <Text className="text-text-muted">No categories found</Text>
            </Card>
          ))
          .otherwise((categories) => (
            <>
              {categories.map((category) => (
                <Card key={category.id} className="bg-dark-card">
                  <div className="flex items-center justify-between">
                    <Text className="text-lg">{category.name}</Text>
                  </div>
                </Card>
              ))}
            </>
          ))}
      </div>
    </>
  );
}
