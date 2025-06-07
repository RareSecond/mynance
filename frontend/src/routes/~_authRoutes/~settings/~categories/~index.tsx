import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/PageTitle";
import { Card, Text, Switch } from "@mantine/core";
import {
  useCategoryControllerFindAll,
  useCategoryControllerUpdateCategory,
  getCategoryControllerFindAllQueryKey,
} from "@/data/api";
import { match, P } from "ts-pattern";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authRoutes/settings/categories/")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const { data: categories } = useCategoryControllerFindAll();
  const { mutate: updateCategory } = useCategoryControllerUpdateCategory();

  const handleToggle = (categoryId: string, enabled: boolean) => {
    const previousCategories = queryClient.getQueryData(
      getCategoryControllerFindAllQueryKey()
    );

    queryClient.setQueryData(
      getCategoryControllerFindAllQueryKey(),
      (old: typeof categories) => {
        if (!old) return old;
        return old.map((category) =>
          category.id === categoryId ? { ...category, enabled } : category
        );
      }
    );

    updateCategory(
      {
        id: categoryId,
        data: { enabled },
      },
      {
        onError: () => {
          queryClient.setQueryData(
            getCategoryControllerFindAllQueryKey(),
            previousCategories
          );
        },
      }
    );
  };

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
                    <Switch
                      checked={category.enabled}
                      onChange={(event) =>
                        handleToggle(category.id, event.currentTarget.checked)
                      }
                      size="md"
                      color="purple"
                    />
                  </div>
                </Card>
              ))}
            </>
          ))}
      </div>
    </>
  );
}
