import { useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Button, type ButtonVariant } from "@/components/button";

import { ShowcaseSection } from "./showcaseSection";

const VARIANTS: ButtonVariant[] = [
  "default",
  "secondary",
  "outline",
  "destructive",
  "ghost",
  "link",
];

export function ButtonSection() {
  const [loading, setLoading] = useState(false);

  function simulateLoading() {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <ShowcaseSection
      title="Button"
      description="Variantes, tamanhos e estado de loading."
    >
      <View style={styles.group}>
        {VARIANTS.map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
      </View>
      <View style={styles.row}>
        <Button size="sm">sm</Button>
        <Button size="default">default</Button>
        <Button size="lg">lg</Button>
      </View>
      <Button loading={loading} onPress={simulateLoading}>
        {loading ? "Enviando..." : "Simular loading"}
      </Button>
    </ShowcaseSection>
  );
}

const styles = StyleSheet.create((theme) => ({
  group: {
    gap: theme.gap(1),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(1),
  },
}));
