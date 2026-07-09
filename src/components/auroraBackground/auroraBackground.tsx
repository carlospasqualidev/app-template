import { LinearGradient } from "expo-linear-gradient";
import { type ReactNode } from "react";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface IAuroraBackgroundProps {
  children: ReactNode;
}

/**
 * Fundo genérico com brilhos degradê na cor da marca sobre a superfície do tema.
 * Puramente decorativo (não intercepta toques) e adaptativo a claro/escuro — a cor
 * vem do token `brand`, então acompanha a marca do projeto sem nada cravado.
 */
export function AuroraBackground({ children }: IAuroraBackgroundProps) {
  const { theme } = useUnistyles();
  const glow = [theme.colors.brand, "transparent"] as const;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={glow}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        pointerEvents="none"
        style={styles.glowTop}
      />
      <LinearGradient
        colors={glow}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        pointerEvents="none"
        style={styles.glowBottom}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  glowTop: {
    position: "absolute",
    top: -theme.gap(14),
    left: -theme.gap(12),
    width: theme.gap(44),
    height: theme.gap(44),
    borderRadius: theme.radius.full,
    opacity: rt.colorScheme === "dark" ? 0.5 : 0.32,
  },
  glowBottom: {
    position: "absolute",
    bottom: -theme.gap(16),
    right: -theme.gap(12),
    width: theme.gap(48),
    height: theme.gap(48),
    borderRadius: theme.radius.full,
    opacity: rt.colorScheme === "dark" ? 0.45 : 0.28,
  },
}));
