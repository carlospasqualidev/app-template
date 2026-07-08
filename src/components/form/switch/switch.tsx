import { Switch as SwitchPrimitive } from "react-native";
import { useUnistyles } from "react-native-unistyles";

export interface ISwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export function Switch({
  value,
  onValueChange,
  disabled = false,
}: ISwitchProps) {
  const { theme } = useUnistyles();

  return (
    <SwitchPrimitive
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: theme.colors.border, true: theme.colors.brand }}
      thumbColor={theme.colors.card}
      ios_backgroundColor={theme.colors.border}
    />
  );
}
