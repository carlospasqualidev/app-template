import { type ReactNode } from "react";
import { View } from "react-native";
import {
  StyleSheet,
  type UnistylesThemes,
  useUnistyles,
} from "react-native-unistyles";

import { Text } from "@/components/text";

type AppTheme = UnistylesThemes["light"];

export type BadgeVariant =
  "default" | "secondary" | "success" | "warning" | "destructive" | "outline";

export interface IBadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

function labelColor(theme: AppTheme, variant: BadgeVariant): string {
  switch (variant) {
    case "default":
      return theme.colors.brandForeground;
    case "secondary":
      return theme.colors.secondaryForeground;
    case "success":
      return theme.colors.successForeground;
    case "warning":
      return theme.colors.warningForeground;
    case "destructive":
      return theme.colors.destructiveForeground;
    case "outline":
      return theme.colors.textForeground;
  }
}

export function Badge({ children, variant = "default" }: IBadgeProps) {
  const { theme } = useUnistyles();
  styles.useVariants({ variant: variant === "default" ? undefined : variant });
  const color = labelColor(theme, variant);

  return (
    <View style={styles.badge}>
      {typeof children === "string" ? (
        <Text variant="p3" weight="semibold" style={{ color }}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(0.5),
    paddingHorizontal: theme.gap(1),
    paddingVertical: theme.gap(0.25),
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.brand,
    variants: {
      variant: {
        secondary: { backgroundColor: theme.colors.secondary },
        success: { backgroundColor: theme.colors.success },
        warning: { backgroundColor: theme.colors.warning },
        destructive: { backgroundColor: theme.colors.destructive },
        outline: {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
      },
    },
  },
}));
