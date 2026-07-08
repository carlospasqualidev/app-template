import * as CheckboxPrimitive from "@rn-primitives/checkbox";
import { Check } from "lucide-react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export interface ICheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Checkbox({
  checked,
  onCheckedChange,
  disabled = false,
}: ICheckboxProps) {
  const { theme } = useUnistyles();
  styles.useVariants({ checked, disabled });

  return (
    <CheckboxPrimitive.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      hitSlop={16}
      style={styles.root}
    >
      <CheckboxPrimitive.Indicator style={styles.indicator}>
        <Check size={14} color={theme.colors.brandForeground} strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

const styles = StyleSheet.create((theme) => ({
  root: {
    width: theme.gap(2.5),
    height: theme.gap(2.5),
    borderRadius: theme.gap(0.75),
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    variants: {
      checked: {
        true: { borderColor: theme.colors.brand },
      },
      disabled: {
        true: { opacity: 0.5 },
      },
    },
  },
  indicator: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.brand,
  },
}));
