import { Children, Fragment, type ReactNode } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Card } from "@/components/card";
import { Text } from "@/components/text";

interface IProfileMenuSectionProps {
  title?: string;
  children: ReactNode;
}

/** Grupo do menu de perfil: título opcional e as linhas num cartão, com divisória entre elas. */
export function ProfileMenuSection({
  title,
  children,
}: IProfileMenuSectionProps) {
  const items = Children.toArray(children);

  return (
    <View style={styles.section}>
      {title ? (
        <Text variant="p3" color="muted" weight="semibold" style={styles.title}>
          {title}
        </Text>
      ) : null}
      <Card style={styles.card}>
        {items.map((item, index) => (
          <Fragment key={index}>
            {index > 0 ? <View style={styles.divider} /> : null}
            {item}
          </Fragment>
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  section: {
    gap: theme.gap(1),
  },
  title: {
    paddingHorizontal: theme.gap(0.5),
  },
  card: {
    gap: 0,
    padding: 0,
    overflow: "hidden",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: theme.gap(2) + 40 + theme.gap(1.5),
    backgroundColor: theme.colors.border,
  },
}));
