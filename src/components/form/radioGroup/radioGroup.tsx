import { createContext, type ReactNode, useContext } from "react";
import { Pressable, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Text } from "@/components/text";

interface RadioGroupContextValue {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroupContext(): RadioGroupContextValue {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error("RadioGroupItem deve ser usado dentro de RadioGroup.");
  }
  return context;
}

export interface IRadioGroupProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  children: ReactNode;
}

export function RadioGroup({
  value,
  onValueChange,
  disabled,
  children,
}: IRadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, disabled }}>
      <View style={styles.group}>{children}</View>
    </RadioGroupContext.Provider>
  );
}

export interface IRadioGroupItemProps {
  value: string;
  label: string;
  disabled?: boolean;
}

export function RadioGroupItem({
  value,
  label,
  disabled,
}: IRadioGroupItemProps) {
  const context = useRadioGroupContext();
  const isSelected = context.value === value;
  const isDisabled = Boolean(disabled || context.disabled);
  styles.useVariants({ selected: isSelected, disabled: isDisabled });

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected, disabled: isDisabled }}
      accessibilityLabel={label}
      disabled={isDisabled}
      hitSlop={8}
      onPress={() => context.onValueChange(value)}
      style={styles.item}
    >
      <View style={styles.outer}>
        {isSelected ? <View style={styles.inner} /> : null}
      </View>
      <Text variant="p2">{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  group: {
    gap: theme.gap(1.5),
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(1.5),
    minHeight: 44,
    variants: {
      disabled: {
        true: { opacity: theme.opacity.disabled },
      },
    },
  },
  outer: {
    width: theme.gap(2.5),
    height: theme.gap(2.5),
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    variants: {
      selected: {
        true: { borderColor: theme.colors.brand },
      },
    },
  },
  inner: {
    width: theme.gap(1.25),
    height: theme.gap(1.25),
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.brand,
  },
}));
