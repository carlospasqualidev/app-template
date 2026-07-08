import { type ReactNode } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Text } from "@/components/text";

interface IShowcaseSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function ShowcaseSection({
  title,
  description,
  children,
}: IShowcaseSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text variant="h3">{title}</Text>
        {description ? (
          <Text variant="p3" color="muted">
            {description}
          </Text>
        ) : null}
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  section: {
    gap: theme.gap(1.5),
    padding: theme.gap(2),
    borderRadius: theme.gap(2),
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  header: {
    gap: theme.gap(0.5),
  },
  body: {
    gap: theme.gap(1.5),
  },
}));
