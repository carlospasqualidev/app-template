import { type ReactNode } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

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
  const { theme } = useUnistyles();

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAwareScrollView
        bottomOffset={theme.gap(3)}
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
      </KeyboardAwareScrollView>
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
