import { Pressable, View } from "react-native";
import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Text } from "@/components/text";
import { useThemeStore, type ThemePreference } from "@/stores/themeStore";

interface IThemeOption {
  value: ThemePreference;
  label: string;
  Icon: LucideIcon;
}

const OPTIONS: IThemeOption[] = [
  { value: "system", label: "Sistema", Icon: Monitor },
  { value: "light", label: "Claro", Icon: Sun },
  { value: "dark", label: "Escuro", Icon: Moon },
];

export function ThemeToggle() {
  const { theme } = useUnistyles();
  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);

  return (
    <View accessibilityRole="radiogroup" style={styles.group}>
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = value === preference;
        return (
          <Pressable
            key={value}
            accessibilityRole="radio"
            accessibilityLabel={label}
            accessibilityState={{ selected: active }}
            onPress={() => setPreference(value)}
            style={[styles.option, active && styles.optionActive]}
          >
            <Icon
              size={18}
              color={active ? theme.colors.brand : theme.colors.textMuted}
            />
            <Text
              variant="p3"
              weight="medium"
              color={active ? "brand" : "muted"}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  group: {
    flexDirection: "row",
    gap: theme.gap(0.5),
    padding: theme.gap(0.5),
    borderRadius: theme.gap(1.5),
    backgroundColor: theme.colors.secondary,
  },
  option: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.gap(0.75),
    height: 40,
    borderRadius: theme.gap(1),
  },
  optionActive: {
    backgroundColor: theme.colors.brandSubtle,
  },
}));
