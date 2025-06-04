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
import {
  TransactionResponseDto,
  useCategoryControllerCreateCategory,
  useCategoryControllerFindAll,
} from "@/data/api";

export function Category({
  transaction,
  onCategoryChange,
}: {
  transaction: TransactionResponseDto;
  onCategoryChange: (categoryId: string) => void;
}) {
  const { data: categories, refetch } = useCategoryControllerFindAll({
    query: {
      initialData: [],
    },
  });
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
          setValue(search);
          onCategoryChange(data.id);
        },
      },
    });

  const onSubmit = (val: string, optionProps: ComboboxOptionProps) => {
    if (val === "$create") {
      createCategory({ data: { category: search } });
    } else {
      setSearch("");
      setValue(optionProps.children as string);
      onCategoryChange(val);
    }
    combobox.closeDropdown();
  };

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
                disabled={isCreatingCategory}
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
