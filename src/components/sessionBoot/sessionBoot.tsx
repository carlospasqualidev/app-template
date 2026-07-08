import { ActivityIndicator, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Text } from "@/components/text";

/**
 * Indicador de tela cheia legítimo: aparece só no boot, enquanto a sessão é
 * validada e antes de qualquer rota protegida renderizar (exceção da regra de
 * loading em "Loading e estados intermediários").
 */
export function SessionBoot() {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.brand} />
      <Text variant="p3" color="muted">
        Carregando…
      </Text>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.gap(2),
    backgroundColor: theme.colors.background,
  },
}));
