import { BlurView } from "expo-blur";
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
  const isDark = rt.colorScheme === "dark";

  return (
    <View
      {...props}
      style={[style, styles.positioner]}
      pointerEvents="box-none"
    >
      <View accessibilityRole="tablist" style={styles.pill}>
        <BlurView
          intensity={100}
          tint={isDark ? "dark" : "light"}
          blurMethod="dimezisBlurViewSdk31Plus"
          blurTarget={blurTarget}
          style={styles.blur}
        />
        <View style={styles.row}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => {
  const isDark = rt.colorScheme === "dark";

  return {
    // Full-width apenas para posicionar; centraliza a pílula (compacta) no meio.
    positioner: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: theme.gap(1) + rt.insets.bottom,
      flexDirection: "column",
      alignItems: "center",
    },
    pill: {
      overflow: "hidden",
      borderRadius: theme.gap(3),
      borderWidth: 1,
      borderColor: isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.06)",
      // Tint leve sobre o BlurView (que agora borra de verdade): baixa opacidade
      // deixa o borrão do conteúdo aparecer sem ficar legível.
      backgroundColor: isDark
        ? "rgba(28,33,39,0.42)"
        : "rgba(255,255,255,0.42)",
      shadowColor: "#000",
      shadowOpacity: isDark ? 0 : 0.12,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
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
      paddingHorizontal: theme.gap(0.75),
    },
  };
});
