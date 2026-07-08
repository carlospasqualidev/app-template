import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

/**
 * Faixa sólida (cor do tema) atrás da barra de navegação do Android.
 *
 * No edge-to-edge do SDK 56 a barra do sistema é transparente e o conteúdo do
 * app desenha atrás dela. Este overlay fica por cima do conteúdo, na altura do
 * inset inferior, garantindo que nada vaze por trás da barra. No-op quando não
 * há inset (ex.: navegação por gestos sem barra).
 */
export function SystemBarsBackground() {
  return <View pointerEvents="none" style={styles.navBar} />;
}

const styles = StyleSheet.create((theme, rt) => ({
  navBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: rt.insets.bottom,
    backgroundColor: theme.colors.background,
  },
}));
