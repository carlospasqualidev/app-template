import { type ComponentType, type ReactNode } from "react";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Text } from "@/components/text";

type IconComponent = ComponentType<{ size?: number; color?: string }>;

export interface IEmptyProps {
  title: string;
  description?: string;
  icon?: IconComponent;
  action?: ReactNode;
}

/** Estado vazio: ícone opcional, título, descrição e ação. Nunca deixe uma lista
 * vazia sem contexto — diga o que houve e o que fazer. */
export function Empty({ title, description, icon: Icon, action }: IEmptyProps) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      {Icon ? <Icon size={40} color={theme.colors.textMuted} /> : null}
      <Text variant="h3" align="center">
        {title}
      </Text>
      {description ? (
        <Text variant="p2" color="muted" align="center">
          {description}
        </Text>
      ) : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.gap(1),
    padding: theme.gap(3),
  },
  action: {
    marginTop: theme.gap(1),
  },
}));
