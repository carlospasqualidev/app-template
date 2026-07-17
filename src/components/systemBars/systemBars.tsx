import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

/**
 * Cobre as barras do sistema no edge-to-edge (SDK 56), onde elas são transparentes
 * e o conteúdo desenha atrás:
 *
 * - Topo (status bar): um gradiente na cor de fundo do tema, opaco sobre a área do
 *   relógio/ícones e desvanecendo para transparente logo abaixo — cobre o conteúdo
 *   que rola por trás sem linha nem frost, fundindo com o fundo do app.
 * - Base (barra de navegação): faixa sólida na cor de fundo, na altura do inset.
 *
 * No-op onde não há inset (ex.: navegação por gestos sem barra).
 */
export function SystemBarsBackground() {
  const { theme, rt } = useUnistyles();
  const topInset = Math.max(rt.insets.top, rt.statusBar.height);
  // Mantém opaco sobre o status bar e desvanece num respiro extra abaixo dele.
  const scrimHeight = topInset + theme.gap(2);
  const holdUntil = topInset / scrimHeight;
  const solid = theme.colors.background;
  const transparent = withAlpha(solid, 0);

  return (
    <>
      <LinearGradient
        pointerEvents="none"
        colors={[solid, solid, transparent] as const}
        locations={[0, holdUntil, 1] as const}
        style={[styles.statusScrim, { height: scrimHeight }]}
      />
      <View pointerEvents="none" style={styles.navBar} />
    </>
  );
}

/** Converte `#RRGGBB` do tema em `rgba(r,g,b,alpha)` — evita fade para cinza/preto. */
function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = StyleSheet.create((theme, rt) => ({
  statusScrim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  navBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: rt.insets.bottom,
    backgroundColor: theme.colors.background,
  },
}));
