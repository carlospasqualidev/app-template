import { type ComponentRef, forwardRef } from "react";
import { Text as TextPrimitive, type TextProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export type TextVariant = "h1" | "h2" | "h3" | "p1" | "p2" | "p3";
export type TextColor = "default" | "muted" | "brand";
export type TextAlign = "auto" | "left" | "center" | "right";
export type TextWeight = "regular" | "medium" | "semibold" | "bold";

export interface ITextProps extends TextProps {
  variant?: TextVariant;
  color?: TextColor;
  align?: TextAlign;
  weight?: TextWeight;
}

export const Text = forwardRef<ComponentRef<typeof TextPrimitive>, ITextProps>(
  function Text(
    {
      variant = "p2",
      color = "default",
      align = "auto",
      weight,
      style,
      ...props
    },
    ref,
  ) {
    styles.useVariants({
      variant,
      color: color === "default" ? undefined : color,
      align,
      weight,
    });

    return (
      <TextPrimitive
        ref={ref}
        accessibilityRole={variant[0] === "h" ? "header" : undefined}
        style={[styles.text, style]}
        {...props}
      />
    );
  },
);

const styles = StyleSheet.create((theme) => ({
  text: {
    color: theme.colors.textForeground,
    variants: {
      variant: {
        h1: theme.typography.h1,
        h2: theme.typography.h2,
        h3: theme.typography.h3,
        p1: theme.typography.p1,
        p2: theme.typography.p2,
        p3: theme.typography.p3,
      },
      color: {
        muted: { color: theme.colors.textMuted },
        brand: { color: theme.colors.brand },
      },
      align: {
        auto: { textAlign: "auto" },
        left: { textAlign: "left" },
        center: { textAlign: "center" },
        right: { textAlign: "right" },
      },
      weight: {
        regular: { fontWeight: "400" },
        medium: { fontWeight: "500" },
        semibold: { fontWeight: "600" },
        bold: { fontWeight: "700" },
      },
    },
  },
}));
