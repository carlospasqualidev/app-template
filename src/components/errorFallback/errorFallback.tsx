import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

import { Button } from "@/components/button";
import { Text } from "@/components/text";

interface IErrorFallbackProps {
  error?: Error;
  onRetry: () => void;
}

/**
 * Fallback de erro de rota protegida (exportado como `ErrorBoundary` no layout).
 * Mensagem amigável em pt-BR + "Tentar novamente" — nunca expõe stack ao usuário.
 */
export function ErrorFallback({ error, onRetry }: IErrorFallbackProps) {
  if (__DEV__ && error) {
    console.error(error);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="h2">Algo deu errado</Text>
        <Text variant="p2" color="muted" align="center">
          Não foi possível carregar esta tela. Tente novamente.
        </Text>
        <Button onPress={onRetry}>Tentar novamente</Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.gap(2),
    padding: theme.gap(3),
  },
}));
