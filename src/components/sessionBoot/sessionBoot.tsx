import { ActivityIndicator, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { AuroraBackground } from "@/components/auroraBackground";
import { BrandLogo } from "@/components/brandLogo";

/**
 * Splash de boot: logo da marca sobre o fundo com brilhos, com um indicador
 * discreto. Aparece só enquanto a sessão é validada, antes de qualquer rota
 * protegida renderizar (exceção legítima da regra de loading).
 */
export function SessionBoot() {
  const { theme } = useUnistyles();

  return (
    <AuroraBackground>
      <View style={styles.center}>
        <BrandLogo />
        <ActivityIndicator color={theme.colors.brand} />
      </View>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create((theme) => ({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.gap(3),
  },
}));
