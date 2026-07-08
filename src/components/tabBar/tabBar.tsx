import { BlurView, type BlurTint } from "expo-blur";
import { type RefObject } from "react";
import { View, type ViewProps } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface ITabBarBaseProps extends ViewProps {
  blurTarget?: RefObject<View | null>;
}

export function TabBarBase({
  children,
  style,
  blurTarget,
  ...props
}: ITabBarBaseProps) {
  const { rt } = useUnistyles();
  const tint: BlurTint = rt.colorScheme === "dark" ? "dark" : "light";

  return (
    <View accessibilityRole="tablist" {...props} style={[style, styles.container]}>
      <BlurView
        intensity={50}
        tint={tint}
        blurMethod="dimezisBlurView"
        blurTarget={blurTarget}
        style={styles.blur}
      />
      <View style={styles.row}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => {
  const isDark = rt.colorScheme === "dark";

  return {
    container: {
      position: "absolute",
      left: theme.gap(2),
      right: theme.gap(2),
      bottom: theme.gap(1) + rt.insets.bottom,
      borderRadius: theme.gap(3),
      overflow: "hidden",
      borderWidth: 1,
      borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
      backgroundColor: isDark
        ? "rgba(17,24,28,0.25)"
        : "rgba(255,255,255,0.25)",
      elevation: isDark ? 0 : 8,
    },
    blur: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    row: {
      flexDirection: "row",
      paddingVertical: theme.gap(0.75),
      paddingHorizontal: theme.gap(1),
    },
  };
});
