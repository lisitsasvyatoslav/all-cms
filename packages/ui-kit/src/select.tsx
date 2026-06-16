import { Select as RadixSelect } from "@radix-ui/themes";

export type SelectSize = "sm" | "md" | "lg";

export type SelectOption = {
  value: string;
  label: string;
};

const sizeMap: Record<SelectSize, "1" | "2" | "3"> = {
  sm: "1",
  md: "2",
  lg: "3",
};

export interface SelectProps {
  /** Список пунктов { value, label }. */
  options: SelectOption[];
  /** Текст, когда значение не выбрано. */
  placeholder?: string;
  /** value выбранного пункта по умолчанию. */
  defaultValue?: string;
  /** Высота триггера: sm, md, lg. */
  selectSize?: SelectSize;
}

export function Select({
  placeholder = "Выберите…",
  options,
  defaultValue,
  selectSize = "md",
}: SelectProps) {
  return (
    <RadixSelect.Root size={sizeMap[selectSize]} defaultValue={defaultValue}>
      <RadixSelect.Trigger placeholder={placeholder} />
      <RadixSelect.Content>
        {options.map((option) => (
          <RadixSelect.Item key={option.value} value={option.value}>
            {option.label}
          </RadixSelect.Item>
        ))}
      </RadixSelect.Content>
    </RadixSelect.Root>
  );
}
