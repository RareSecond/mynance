import { Tag } from "lucide-react";
import {
  Combobox,
  ComboboxOptionProps,
  InputBase,
  Text,
  useCombobox,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { match } from "ts-pattern";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getTransactionControllerListTransactionsQueryKey,
  TransactionResponseDto,
  useCategoryControllerCreateCategory,
  useCategoryControllerFindAll,
  useTransactionControllerLinkCategory,
} from "@/data/api";

export function Category({
  transaction,
}: {
  transaction: TransactionResponseDto;
}) {
  const { data: categories, refetch } = useCategoryControllerFindAll();
  const queryClient = useQueryClient();
  const [opened, handlers] = useDisclosure(transaction.categories.length === 0);
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [search, setSearch] = useState("");
  const [value, setValue] = useState(
    transaction.categories?.[0]?.category.name || ""
  );

  const { mutate: createCategory, isPending: isCreatingCategory } =
    useCategoryControllerCreateCategory({
      mutation: {
        onSuccess: (data) => {
          refetch();
          linkCategory({
            transactionId: transaction.id,
            data: {
              categoryId: data.id,
            },
          });
        },
      },
    });

  const { mutate: linkCategory, isPending: isLinkingCategory } =
    useTransactionControllerLinkCategory({
      mutation: {
        onSuccess: async () => {
          await Promise.all([
            queryClient.refetchQueries({
              queryKey: getTransactionControllerListTransactionsQueryKey(),
            }),
            queryClient.refetchQueries({
              queryKey: getTransactionControllerListTransactionsQueryKey({
                uncategorizedOnly: true,
              }),
            }),
          ]);
        },
      },
    });

  const onSubmit = (val: string, optionProps: ComboboxOptionProps) => {
    if (val === "$create") {
      createCategory({ data: { category: search } });
    } else {
      setValue(optionProps.children as string);
      linkCategory({
        transactionId: transaction.id,
        data: {
          categoryId: val,
        },
      });
    }

    combobox.closeDropdown();
  };

  if (!categories) return null;

  const exactOptionMatch = categories.some(
    (category) => category.name === search
  );
  const filteredOptions = exactOptionMatch
    ? categories
    : categories.filter((category) =>
        category.name.toLowerCase().includes(search.toLowerCase().trim())
      );

  const options = filteredOptions.map((category) => (
    <Combobox.Option value={category.id} key={category.id}>
      {category.name}
    </Combobox.Option>
  ));

  return (
    <div
      className="flex items-center text-text-muted flex-row gap-1"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Tag size={14} />
      {match(opened)
        .with(true, () => (
          <Combobox
            store={combobox}
            withinPortal={false}
            onOptionSubmit={onSubmit}
            size="xs"
          >
            <Combobox.Target>
              <InputBase
                rightSection={<Combobox.Chevron />}
                value={search || value}
                onChange={(event) => {
                  combobox.openDropdown();
                  combobox.updateSelectedOptionIndex();
                  setSearch(event.currentTarget.value);
                  setValue(event.currentTarget.value);
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  combobox.openDropdown();
                }}
                onFocus={() => combobox.openDropdown()}
                placeholder="Pick a category"
                rightSectionPointerEvents="none"
                size="xs"
                disabled={isLinkingCategory || isCreatingCategory}
                classNames={{
                  input: "bg-dark-secondary text-text-muted border-none",
                }}
              />
            </Combobox.Target>

            <Combobox.Dropdown>
              <Combobox.Options>
                {options}
                {!exactOptionMatch && search.trim().length > 0 && (
                  <Combobox.Option value="$create">
                    + Create {search}
                  </Combobox.Option>
                )}
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
        ))
        .with(false, () => (
          <Text
            className="text-sm"
            onClick={() => {
              handlers.open();
            }}
          >
            {match(transaction.categories)
              .with([], () => "Add a category..")
              .otherwise((categories) =>
                categories.map((category) => category.category.name)
              )}
          </Text>
        ))
        .exhaustive()}
    </div>
  );
}
