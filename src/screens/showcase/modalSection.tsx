import { useState } from "react";
import { Pressable } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Modal } from "@/components/modal";
import { Text } from "@/components/text";

import { ShowcaseSection } from "./showcaseSection";

export function ModalSection() {
  const [visible, setVisible] = useState(false);

  return (
    <ShowcaseSection
      title="Modal"
      description="Bottom sheet com overlay, animação, safe area e teclado."
    >
      <Pressable
        onPress={() => setVisible(true)}
        accessibilityRole="button"
        style={styles.chip}
      >
        <Text variant="p3" weight="medium">
          Abrir modal
        </Text>
      </Pressable>

      <Modal
        visible={visible}
        onClose={() => setVisible(false)}
        title="Exemplo de modal"
      >
        <Text variant="p2">
          Conteúdo do modal. Toque fora, no X ou use o botão voltar para fechar.
        </Text>
        <Text variant="p2" color="muted">
          O corpo rola quando o conteúdo é grande e sobe acima do teclado.
        </Text>
      </Modal>
    </ShowcaseSection>
  );
}

const styles = StyleSheet.create((theme) => ({
  chip: {
    alignSelf: "flex-start",
    minHeight: 44,
    justifyContent: "center",
    paddingVertical: theme.gap(1),
    paddingHorizontal: theme.gap(1.5),
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
}));
