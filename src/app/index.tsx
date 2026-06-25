import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>App Template</Text>
        <Text style={styles.subtitle}>Pronto para começar.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.gap(1),
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.textForeground,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
}));
