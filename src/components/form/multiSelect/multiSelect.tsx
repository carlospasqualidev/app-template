import { Check, ChevronDown } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Modal } from "@/components/modal";
import { Text } from "@/components/text";

import { Input } from "../input";

export interface IMultiSelectOption {
  label: string;
  value: string;
}

export interface IMultiSelectProps {
  options: IMultiSelectOption[];
  value?: string[];
  onValueChange: (values: string[]) => void;
  placeholder?: string;
  title?: string;
  searchable?: boolean;
  disabled?: boolean;
  hasError?: boolean;
}

export function MultiSelect({
  options,
  value = [],
  onValueChange,
  placeholder = "Selecione",
  title = "Selecione",
  searchable = false,
  disabled = false,
  hasError = false,
}: IMultiSelectProps) {
  const { theme } = useUnistyles();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  styles.useVariants({ error: hasError, disabled });

  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label);

  const filteredOptions = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(normalized),
    );
  }, [options, search]);

  function handleClose() {
    setIsOpen(false);
    setSearch("");
  }

  function toggle(optionValue: string) {
    if (value.includes(optionValue)) {
      onValueChange(value.filter((item) => item !== optionValue));
      return;
    }
    onValueChange([...value, optionValue]);
  }

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        accessibilityLabel={title}
        disabled={disabled}
        onPress={() => setIsOpen(true)}
        style={styles.trigger}
      >
        <Text
          variant="p2"
          color={selectedLabels.length ? "default" : "muted"}
          numberOfLines={1}
          style={styles.triggerText}
        >
          {selectedLabels.length ? selectedLabels.join(", ") : placeholder}
        </Text>
        <ChevronDown size={18} color={theme.colors.textMuted} />
      </Pressable>

      <Modal visible={isOpen} onClose={handleClose} title={title}>
        {searchable ? (
          <Input
            placeholder="Buscar"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
        ) : null}

        <View style={styles.options}>
          {filteredOptions.length ? (
            filteredOptions.map((option) => {
              const isSelected = value.includes(option.value);

              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSelected }}
                  onPress={() => toggle(option.value)}
                  style={[styles.option, isSelected && styles.optionSelected]}
                >
                  <Text variant="p2" style={styles.optionText}>
                    {option.label}
                  </Text>
                  {isSelected ? (
                    <Check size={18} color={theme.colors.brand} />
                  ) : null}
                </Pressable>
              );
            })
          ) : (
            <Text variant="p3" color="muted" align="center">
              Nenhuma opção encontrada.
            </Text>
          )}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  trigger: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.gap(1),
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.gap(1.5),
    paddingVertical: theme.gap(1),
    variants: {
      error: {
        true: { borderColor: theme.colors.destructive },
      },
      disabled: {
        true: { opacity: theme.opacity.disabled },
      },
    },
  },
  triggerText: {
    flex: 1,
  },
  options: {
    gap: theme.gap(0.5),
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.gap(1),
    minHeight: 44,
    paddingHorizontal: theme.gap(1.5),
    paddingVertical: theme.gap(1),
    borderRadius: theme.radius.md,
  },
  optionSelected: {
    backgroundColor: theme.colors.brandSubtle,
  },
  optionText: {
    flex: 1,
  },
}));
