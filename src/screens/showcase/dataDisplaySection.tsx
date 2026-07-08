import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/badge";

import { ShowcaseSection } from "./showcaseSection";

export function DataDisplaySection() {
  return (
    <ShowcaseSection
      title="Badge e Avatar"
      description="Rótulos de status e avatares com fallback de iniciais."
    >
      <View style={styles.row}>
        <Badge>Padrão</Badge>
        <Badge variant="secondary">Secundário</Badge>
        <Badge variant="success">Ativo</Badge>
        <Badge variant="warning">Pendente</Badge>
        <Badge variant="destructive">Erro</Badge>
        <Badge variant="outline">Contorno</Badge>
      </View>
      <View style={styles.row}>
        <Avatar
          name="Maria Silva"
          uri="https://i.pravatar.cc/150?img=5"
          size={48}
        />
        <Avatar name="João Pereira" size={48} />
        <Avatar name="Ana" size={48} />
      </View>
    </ShowcaseSection>
  );
}

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: theme.gap(1),
  },
}));
