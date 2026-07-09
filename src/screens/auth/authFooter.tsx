import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Button } from "@/components/button";
import { Text } from "@/components/text";

interface IAuthFooterProps {
  prompt: string;
  actionLabel: string;
  onPress: () => void;
}

/** Rodapé "Não tem conta? Criar conta" reutilizado entre login e signup. */
export function AuthFooter({ prompt, actionLabel, onPress }: IAuthFooterProps) {
  return (
    <View style={styles.footer}>
      <Text variant="p3" color="muted">
        {prompt}
      </Text>
      <Button variant="link" size="sm" onPress={onPress}>
        {actionLabel}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.gap(0.5),
  },
}));
