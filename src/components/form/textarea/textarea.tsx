import { forwardRef } from "react";
import { TextInput, type TextInputProps } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export interface ITextareaProps extends TextInputProps {
  hasError?: boolean;
}

export const Textarea = forwardRef<TextInput, ITextareaProps>(function Textarea(
  { hasError = false, editable = true, numberOfLines = 6, style, ...props },
  ref,
) {
  const { theme } = useUnistyles();
  styles.useVariants({ error: hasError, disabled: !editable });

  return (
    <TextInput
      ref={ref}
      editable={editable}
      multiline
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      placeholderTextColor={theme.colors.textMuted}
      style={[styles.textarea, style]}
      {...props}
    />
  );
});

const styles = StyleSheet.create((theme) => ({
  textarea: {
    minHeight: theme.gap(12),
    width: "100%",
    borderRadius: theme.gap(1.25),
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.gap(1.5),
    paddingVertical: theme.gap(1.25),
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
