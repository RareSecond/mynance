import { Tag, X } from "lucide-react";
import {
  Combobox,
  InputBase,
  Text,
  useCombobox,
  NumberInput,
  Button,
  Group,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { match } from "ts-pattern";
import { useState } from "react";
import {
  TransactionResponseDto,
  useCategoryControllerCreateCategory,
  useCategoryControllerFindAll,
} from "@/data/api";

export interface CategoryWithAmount {
  categoryId: string;
  categoryName: string;
  amount: number;
}

export function Category({
  transaction,
  onCategoriesChange,
}: {
  transaction: TransactionResponseDto;
  onCategoriesChange: (categories: CategoryWithAmount[]) => void;
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
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryWithAmount[]
  >(
    transaction.categories.map((tc) => ({
      categoryId: tc.category.id,
      categoryName: tc.category.name,
      amount: Math.abs(tc.amount),
    }))
  );
  const [currentAmount, setCurrentAmount] = useState<number>(
    Math.abs(transaction.amount)
  );

  const { mutate: createCategory, isPending: isCreatingCategory } =
    useCategoryControllerCreateCategory({
      mutation: {
        onSuccess: (data) => {
          refetch();
          setSearch("");
          const newCategory: CategoryWithAmount = {
            categoryId: data.id,
            categoryName: search,
            amount: currentAmount || 0,
          };
          const updatedCategories = [...selectedCategories, newCategory];
          setSelectedCategories(updatedCategories);
          onCategoriesChange(updatedCategories);
        },
      },
    });

  const onSubmit = (val: string) => {
    if (val === "$create") {
      createCategory({ data: { category: search } });
    } else {
      const category = categories.find((c) => c.id === val);
      if (category) {
        const newRemainingAmount =
          Math.abs(transaction.amount) -
          selectedCategories.reduce((sum, cat) => sum + cat.amount, 0);
        const newCategory: CategoryWithAmount = {
          categoryId: category.id,
          categoryName: category.name,
          amount:
            currentAmount > newRemainingAmount
              ? newRemainingAmount
              : currentAmount,
        };
        const updatedCategories = [...selectedCategories, newCategory];
        setSelectedCategories(updatedCategories);
        onCategoriesChange(updatedCategories);
        setSearch("");
        const finalRemainingAmount = newRemainingAmount - newCategory.amount;
        setCurrentAmount(finalRemainingAmount);
      }
    }
    combobox.closeDropdown();
  };

  const removeCategory = (categoryId: string) => {
    const updatedCategories = selectedCategories.filter(
      (c) => c.categoryId !== categoryId
    );
    const newRemainingAmount =
      Math.abs(transaction.amount) -
      updatedCategories.reduce((sum, cat) => sum + cat.amount, 0);
    setSelectedCategories(updatedCategories);
    onCategoriesChange(updatedCategories);
    setCurrentAmount(newRemainingAmount);
  };

  const exactOptionMatch = categories.some(
    (category) => category.name === search
  );
  const filteredOptions = exactOptionMatch
    ? categories
    : categories.filter((category) =>
        category.name.toLowerCase().includes(search.toLowerCase().trim())
      );

  const options = filteredOptions
    .filter(
      (category) =>
        !selectedCategories.some((sc) => sc.categoryId === category.id)
    )
    .map((category) => (
      <Combobox.Option value={category.id} key={category.id}>
        {category.name}
      </Combobox.Option>
    ));

  const remainingAmount =
    Math.abs(transaction.amount) -
    selectedCategories.reduce((sum, cat) => sum + cat.amount, 0);

  const handleAmountChange = (value: string | number) => {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;
    if (!isNaN(numericValue)) {
      setCurrentAmount(numericValue);
    }
  };

  return (
    <div
      className="flex flex-col gap-2"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="flex items-center gap-2">
        <Tag size={14} />
        {match(opened)
          .with(true, () => (
            <div className="flex-1">
              {selectedCategories.map((category) => (
                <Group key={category.categoryId} className="mb-2">
                  <Text size="sm">{category.categoryName}</Text>
                  <Text size="sm" c="dimmed">
                    {category.amount.toFixed(2)} {transaction.currency}
                  </Text>
                  <Button
                    variant="subtle"
                    size="xs"
                    onClick={() => removeCategory(category.categoryId)}
                  >
                    <X size={14} />
                  </Button>
                </Group>
              ))}
              {remainingAmount > 0 && (
                <div className="flex gap-2 items-center">
                  <Combobox
                    store={combobox}
                    withinPortal={false}
                    onOptionSubmit={onSubmit}
                    size="xs"
                  >
                    <Combobox.Target>
                      <InputBase
                        rightSection={<Combobox.Chevron />}
                        value={search}
                        onChange={(event) => {
                          combobox.openDropdown();
                          combobox.updateSelectedOptionIndex();
                          setSearch(event.currentTarget.value);
                        }}
                        onClick={() => combobox.openDropdown()}
                        onFocus={() => combobox.openDropdown()}
                        placeholder="Add category"
                        rightSectionPointerEvents="none"
                        size="xs"
                        disabled={isCreatingCategory}
                        classNames={{
                          input:
                            "bg-dark-secondary text-text-muted border-none",
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
                  <NumberInput
                    size="xs"
                    value={currentAmount}
                    onChange={handleAmountChange}
                    min={0}
                    max={remainingAmount}
                    placeholder={`Amount (max ${remainingAmount.toFixed(2)})`}
                    classNames={{
                      input: "bg-dark-secondary text-text-muted border-none",
                    }}
                  />
                </div>
              )}
            </div>
          ))
          .with(false, () => (
            <Text
              className="text-sm"
              onClick={() => {
                handlers.open();
              }}
            >
              {match(selectedCategories)
                .with([], () => "Add categories..")
                .otherwise((categories) =>
                  categories
                    .map(
                      (category) =>
                        `${category.categoryName} (${category.amount.toFixed(2)} ${transaction.currency})`
                    )
                    .join(", ")
                )}
            </Text>
          ))
          .exhaustive()}
      </div>
    </div>
  );
}
