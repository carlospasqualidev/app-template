import { type ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import {
  StyleSheet,
  type UnistylesThemes,
  useUnistyles,
} from "react-native-unistyles";

import { Text } from "@/components/text";

type AppTheme = UnistylesThemes["light"];

export type ButtonVariant =
  "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
export type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface IButtonProps extends Omit<
  PressableProps,
  "children" | "disabled" | "style"
> {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

function labelColor(theme: AppTheme, variant: ButtonVariant): string {
  switch (variant) {
    case "default":
      return theme.colors.brandForeground;
    case "destructive":
      return theme.colors.destructiveForeground;
    case "secondary":
      return theme.colors.secondaryForeground;
    case "link":
      return theme.colors.brand;
    case "outline":
    case "ghost":
      return theme.colors.textForeground;
  }
}

export function Button({
  children,
  variant = "default",
  size = "default",
  loading = false,
  disabled = false,
  style,
  ...props
}: IButtonProps) {
  const { theme } = useUnistyles();
  const isDisabled = disabled || loading;
  styles.useVariants({
    variant: variant === "default" ? undefined : variant,
    size: size === "default" ? undefined : size,
    disabled: isDisabled,
  });
  const color = labelColor(theme, variant);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={[styles.button, style]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={color} />
      ) : typeof children === "string" ? (
        <Text
          weight="semibold"
          style={[{ color }, variant === "link" && styles.link]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.gap(1),
    borderRadius: theme.radius.md,
    variants: {
      variant: {
        default: { backgroundColor: theme.colors.brand },
        destructive: { backgroundColor: theme.colors.destructive },
        outline: {
          backgroundColor: theme.colors.card,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        secondary: { backgroundColor: theme.colors.secondary },
        ghost: { backgroundColor: "transparent" },
        link: { backgroundColor: "transparent" },
      },
      size: {
        default: { height: 44, paddingHorizontal: theme.gap(2) },
        sm: { height: 36, paddingHorizontal: theme.gap(1.5) },
        lg: { height: 52, paddingHorizontal: theme.gap(3) },
        icon: { height: 44, width: 44 },
      },
      disabled: {
        true: { opacity: theme.opacity.disabled },
      },
    },
  },
  link: {
    textDecorationLine: "underline",
  },
}));
