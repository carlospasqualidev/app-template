import { type ReactNode } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

import { BrandLogo } from "@/components/brandLogo";
import { Card } from "@/components/card";
import { Text } from "@/components/text";

interface IAuthLayoutProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

/**
 * Casca das telas de autenticação: fundo sólido do tema, a marca (BrandLogo) no topo,
 * cabeçalho opcional e um card com o formulário. Compartilhada por login e signup para
 * não repetir a estrutura. A identidade vem da marca e da paleta.
 */
export function AuthLayout({ title, subtitle, children }: IAuthLayoutProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior="padding" style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <BrandLogo />
          {title || subtitle ? (
            <View style={styles.header}>
              {title ? (
                <Text variant="h2" align="center">
                  {title}
                </Text>
              ) : null}
              {subtitle ? (
                <Text variant="p2" color="muted" align="center">
                  {subtitle}
                </Text>
              ) : null}
            </View>
          ) : null}
          <Card style={styles.panel}>{children}</Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  },
}));
