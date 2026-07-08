import { type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export interface ICardProps extends ViewProps {
  children: ReactNode;
}

/** Superfície padrão (borda + fundo `card` + raio). Base para cards de conteúdo. */
export function Card({ children, style, ...props }: ICardProps) {
  return (
    <View {...props} style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    gap: theme.gap(1),
    padding: theme.gap(2),
    borderRadius: theme.gap(2),
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
}));
