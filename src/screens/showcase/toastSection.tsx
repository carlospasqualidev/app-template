import { Pressable, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Text } from "@/components/text";
import { toast } from "@/lib/toast";

import { ShowcaseSection } from "./showcaseSection";

const TRIGGERS = [
  { label: "Sucesso", onPress: () => toast.success("Registro salvo.") },
  {
    label: "Erro",
    onPress: () => toast.error("Falha ao salvar. Tente novamente."),
  },
  {
    label: "Info",
    onPress: () =>
      toast.info("Sincronização em andamento.", {
        description: "Isso pode levar alguns segundos.",
      }),
  },
  { label: "Aviso", onPress: () => toast.warning("Conexão instável.") },
];

export function ToastSection() {
  return (
    <ShowcaseSection
      title="Toast"
      description="Notificações via sonner-native, sempre por @/lib/toast."
    >
      <View style={styles.row}>
        {TRIGGERS.map(({ label, onPress }) => (
          <Pressable
            key={label}
            onPress={onPress}
            accessibilityRole="button"
            style={styles.chip}
          >
            <Text variant="p3" weight="medium">
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
    </ShowcaseSection>
  );
}

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.gap(1),
  },
  chip: {
    minHeight: 44,
    justifyContent: "center",
    paddingVertical: theme.gap(1),
    paddingHorizontal: theme.gap(1.5),
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
}));
