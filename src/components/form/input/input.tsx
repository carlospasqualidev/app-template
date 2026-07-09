import { forwardRef } from "react";
import { TextInput, type TextInputProps } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export interface IInputProps extends TextInputProps {
  hasError?: boolean;
}

export const Input = forwardRef<TextInput, IInputProps>(function Input(
  { hasError = false, editable = true, style, ...props },
  ref,
) {
  const { theme } = useUnistyles();
  styles.useVariants({ error: hasError, disabled: !editable });

  return (
    <TextInput
      ref={ref}
      editable={editable}
      placeholderTextColor={theme.colors.textMuted}
      style={[styles.input, style]}
      {...props}
    />
  );
});

const styles = StyleSheet.create((theme) => ({
  input: {
    height: 44,
    width: "100%",
    borderRadius: theme.gap(1.25),
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.gap(1.5),
    color: theme.colors.textForeground,
    fontSize: theme.typography.p2.fontSize,
    variants: {
      error: {
        true: { borderColor: theme.colors.destructive },
      },
      disabled: {
        true: { opacity: 0.5 },
      },
    },
  },
}));
