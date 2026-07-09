import { type ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

import { AuroraBackground } from "@/components/auroraBackground";
import { Text } from "@/components/text";

interface IAuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/**
 * Casca das telas de autenticação: fundo com brilhos (AuroraBackground), cabeçalho
 * e um painel de vidro (tokens `glassSurface`/`glassBorder`) com o formulário.
 * Compartilhada por login e signup para não repetir a estrutura.
 */
export function AuthLayout({ title, subtitle, children }: IAuthLayoutProps) {
  return (
    <AuroraBackground>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.safe}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text variant="h1">{title}</Text>
              {subtitle ? (
                <Text variant="p2" color="muted">
                  {subtitle}
                </Text>
              ) : null}
            </View>
            <View style={styles.panel}>{children}</View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create((theme) => ({
  safe: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    gap: theme.gap(3),
    padding: theme.gap(3),
  },
  header: {
    gap: theme.gap(1),
  },
  panel: {
    gap: theme.gap(2),
    padding: theme.gap(2.5),
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    backgroundColor: theme.colors.glassSurface,
  },
}));
