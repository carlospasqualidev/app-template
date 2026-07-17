import { Image } from "expo-image";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Text } from "@/components/text";
import { env } from "@/lib/env";

// Placeholder do template: usa o ícone do Expo como "marca" fictícia. Troque por
// uma imagem/SVG do logo real do projeto (mantendo fundo transparente para funcionar
// sobre claro e escuro).
const markSource = require("../../../assets/images/splash-icon.png");

interface IBrandLogoProps {
  /** Exibe um descritivo (placeholder) abaixo do wordmark. */
  showTagline?: boolean;
}

/**
 * Marca do app: símbolo (imagem) + wordmark com o nome do projeto. O wordmark usa a
 * cor de texto do tema, acompanhando a identidade em claro e escuro. Genérico e
 * reaproveitável — a identidade real entra trocando a imagem e o nome do projeto.
 */
export function BrandLogo({ showTagline = false }: IBrandLogoProps) {
  return (
    <View style={styles.container}>
      <Image
        source={markSource}
        style={styles.mark}
        contentFit="contain"
        accessibilityLabel={env.EXPO_PUBLIC_PROJECT_NAME}
      />
      <Text variant="h1" weight="bold">
        {env.EXPO_PUBLIC_PROJECT_NAME}
      </Text>
      {showTagline ? (
        <Text variant="p3" color="muted" style={styles.tagline}>
          SEU DESCRITIVO AQUI
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: "center",
    gap: theme.gap(0.75),
  },
  mark: {
    width: 76,
    height: 76,
  },
  tagline: {
    letterSpacing: 3,
  },
}));
