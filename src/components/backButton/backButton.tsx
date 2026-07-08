import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, type PressableProps } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface IBackButtonProps {
  onPress?: PressableProps["onPress"];
}

export function BackButton({ onPress }: IBackButtonProps) {
  const router = useRouter();
  const { theme } = useUnistyles();

  return (
    <Pressable
      onPress={onPress ?? (() => router.back())}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      style={styles.button}
    >
      <ChevronLeft size={24} color={theme.colors.textForeground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
