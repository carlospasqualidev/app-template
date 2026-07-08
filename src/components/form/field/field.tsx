import { type ReactNode } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Text } from "@/components/text";

import { Label } from "../label";

export interface IFieldProps {
  label?: string;
  description?: string;
  error?: string;
  children: ReactNode;
}

/**
 * Casca apresentacional de um campo: label, descrição, o controle e a mensagem
 * de erro. Não conhece React Hook Form — os campos compostos (TextField, etc.)
 * é que ligam ao formulário e passam `error`.
 */
export function Field({ label, description, error, children }: IFieldProps) {
  return (
    <View style={styles.field}>
      {label ? <Label>{label}</Label> : null}
      {description ? (
        <Text variant="p3" color="muted">
          {description}
        </Text>
      ) : null}
      {children}
      {error ? (
        <Text variant="p3" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  field: {
    gap: theme.gap(0.75),
  },
  error: {
    color: theme.colors.destructive,
  },
}));
