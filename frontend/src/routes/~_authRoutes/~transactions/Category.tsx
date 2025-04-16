import { Tag, X } from "lucide-react";
import { Combobox, InputBase, Text, useCombobox } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { match } from "ts-pattern";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/data/api";

export function Category({ transaction }: { transaction: any }) {
  const { data: categories, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/category");
      return res.data;
    },
  });
  const [opened, handlers] = useDisclosure(false);
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [search, setSearch] = useState("");

  const { mutate: createCategory } = useMutation({
    mutationFn: async (category: string) => {
      const res = await api.post("/category", { category });
      return res.data;
    },
    onSuccess: () => {
      refetch();
    },
  });

  const onSubmit = (val: string) => {
    if (val === "$create") {
      createCategory(search);
    } else {
      setSearch(val);
    }

    handlers.close();
    combobox.closeDropdown();
  };

  if (!categories) return null;

  const exactOptionMatch = categories.some(
    (category: any) => category.name === search
  );
  const filteredOptions = exactOptionMatch
    ? categories
    : categories.filter((category: any) =>
        category.name.toLowerCase().includes(search.toLowerCase().trim())
      );

  const options = filteredOptions.map((category: any) => (
    <Combobox.Option value={category.name} key={category.id}>
      {category.name}
    </Combobox.Option>
  ));

  return (
    <div
      className="flex items-center text-text-muted flex-row gap-1"
      onClick={(e) => {
        e.stopPropagation();

        if (!opened) {
          handlers.open();
        }
      }}
    >
      <Tag size={14} />
      {match(opened)
        .with(true, () => (
          <Combobox
            store={combobox}
            withinPortal={false}
            onOptionSubmit={onSubmit}
            size="sm"
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
                // onBlur={() => {
                //   combobox.closeDropdown();
                //   setSearch(value || "");
                // }}
                placeholder="Search value"
                rightSectionPointerEvents="none"
                size="sm"
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
        .with(false, () => <Text className=" text-sm">Add a category..</Text>)
        .exhaustive()}
    </div>
  );
}
