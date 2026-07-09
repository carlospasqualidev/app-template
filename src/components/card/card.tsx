import { type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export type CardVariant = "default" | "glass";

export interface ICardProps extends ViewProps {
  children: ReactNode;
  /** `glass`: superfície translúcida para uso sobre a `AuroraBackground`. */
  variant?: CardVariant;
}

/** Superfície padrão (borda + fundo `card` + raio). Base para cards de conteúdo. */
export function Card({
  children,
  variant = "default",
  style,
  ...props
}: ICardProps) {
  styles.useVariants({ variant: variant === "default" ? undefined : variant });

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
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    variants: {
      variant: {
        glass: {
          backgroundColor: theme.colors.glassSurface,
          borderColor: theme.colors.glassBorder,
        },
      },
    },
  },
}));
