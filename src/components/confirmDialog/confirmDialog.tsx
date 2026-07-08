import { useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Button } from "@/components/button";
import { Input } from "@/components/form";
import { Modal } from "@/components/modal";
import { Text } from "@/components/text";

export interface IConfirmDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  /** Confirmação dupla: exige digitar esta palavra para habilitar o confirmar. */
  requireText?: string;
}

export function ConfirmDialog({
  visible,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  requireText,
}: IConfirmDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [typed, setTyped] = useState("");

  // Reseta o campo de confirmação ao abrir/fechar (ajuste no render, não em effect).
  const [lastVisible, setLastVisible] = useState(visible);
  if (visible !== lastVisible) {
    setLastVisible(visible);
    setTyped("");
  }

  const confirmDisabled = requireText != null && typed !== requireText;

  async function handleConfirm() {
    setIsConfirming(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // Mantém aberto; a camada de rede já exibe o toast de erro.
    } finally {
      setIsConfirming(false);
    }
  }

  return (
    <Modal visible={visible} onClose={onClose} title={title}>
      {description ? (
        <Text variant="p2" color="muted">
          {description}
        </Text>
      ) : null}

      {requireText != null ? (
        <Input
          value={typed}
          onChangeText={setTyped}
          placeholder={requireText}
          autoCapitalize="characters"
          autoCorrect={false}
        />
      ) : null}

      <View style={styles.actions}>
        <Button variant="outline" onPress={onClose} style={styles.action}>
          {cancelLabel}
        </Button>
        <Button
          variant={destructive ? "destructive" : "default"}
          loading={isConfirming}
          disabled={confirmDisabled}
          onPress={handleConfirm}
          style={styles.action}
        >
          {confirmLabel}
        </Button>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create((theme) => ({
  actions: {
    flexDirection: "row",
    gap: theme.gap(1),
    marginTop: theme.gap(1),
  },
  action: {
    flex: 1,
  },
}));
