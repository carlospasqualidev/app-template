import { type ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { BackButton } from "@/components/backButton";
import { Text } from "@/components/text";

interface IScreenProps {
  children?: ReactNode;
  title?: string;
  description?: string;
  headerActions?: ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  scrollable?: boolean;
  showsVerticalScrollIndicator?: boolean;
}

export function Screen({
  children,
  title,
  description,
  headerActions,
  showBackButton = false,
  onBack,
  scrollable = true,
  showsVerticalScrollIndicator = false,
}: IScreenProps) {
  const header = title ? (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        {showBackButton ? <BackButton onPress={onBack} /> : null}
        <Text variant="h1" style={styles.title}>
          {title}
        </Text>
        {headerActions ? (
          <View style={styles.actions}>{headerActions}</View>
        ) : null}
      </View>
      {description ? (
        <Text variant="p2" color="muted">
          {description}
        </Text>
      ) : null}
    </View>
  ) : null;

  const content = (
    <>
      {header}
      <View style={styles.body}>{children}</View>
    </>
  );

  // Safe area via insets do Unistyles (síncronos no 1º frame), não `SafeAreaView`
  // do safe-area-context (que aplica padding após medir e causa flash de conteúdo
  // colado na status bar no primeiro frame). O background cobre a tela toda
  // (edge-to-edge); só o conteúdo respeita o topo/base.
  return (
    <View style={styles.container}>
      {scrollable ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        >
          {content}
        </ScrollView>
      ) : (
        <View style={styles.staticContent}>{content}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    gap: theme.gap(3),
    paddingHorizontal: theme.gap(2),
    // `rt.statusBar.height` é síncrono; `rt.insets.top` cobre notch/cutout.
    paddingTop: theme.gap(1.5) + Math.max(rt.insets.top, rt.statusBar.height),
    // limpa a tab bar flutuante do grupo (app)
    paddingBottom: theme.gap(11) + rt.insets.bottom,
  },
  staticContent: {
    flex: 1,
    gap: theme.gap(3),
    paddingHorizontal: theme.gap(2),
    paddingTop: theme.gap(1.5) + Math.max(rt.insets.top, rt.statusBar.height),
    paddingBottom: theme.gap(2) + rt.insets.bottom,
  },
  header: {
    gap: theme.gap(0.5),
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(1),
  },
  title: {
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(1),
  },
  body: {
    flex: 1,
    gap: theme.gap(3),
  },
}));
