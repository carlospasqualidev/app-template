import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Text, type TextVariant } from "@/components/text";

import { ShowcaseSection } from "./showcaseSection";

const VARIANTS: { variant: TextVariant; sample: string }[] = [
  { variant: "h1", sample: "Título principal" },
  { variant: "h2", sample: "Título de seção" },
  { variant: "h3", sample: "Título de card" },
  { variant: "p1", sample: "Corpo em destaque" },
  { variant: "p2", sample: "Corpo padrão do app" },
  { variant: "p3", sample: "Texto de apoio e legendas" },
];

export function TypographySection() {
  return (
    <ShowcaseSection
      title="Tipografia"
      description="Escala h1–h3 (títulos) e p1–p3 (corpo) do componente Text."
    >
      {VARIANTS.map(({ variant, sample }) => (
        <View key={variant} style={styles.row}>
          <Text variant="p3" color="muted" style={styles.tag}>
            {variant}
          </Text>
          <Text variant={variant} style={styles.sample}>
            {sample}
          </Text>
        </View>
      ))}
      <View style={styles.group}>
        <Text>Cor padrão (textForeground)</Text>
        <Text color="muted">Cor muted</Text>
        <Text color="brand">Cor da marca</Text>
      </View>
      <View style={styles.group}>
        <Text weight="regular">Peso regular</Text>
        <Text weight="medium">Peso medium</Text>
        <Text weight="semibold">Peso semibold</Text>
        <Text weight="bold">Peso bold</Text>
      </View>
    </ShowcaseSection>
  );
}

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: theme.gap(1.5),
  },
  tag: {
    width: theme.gap(4),
  },
  sample: {
    flex: 1,
  },
  group: {
    gap: theme.gap(0.5),
    marginTop: theme.gap(1),
  },
}));
