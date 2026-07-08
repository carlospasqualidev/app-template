import { type ComponentType, forwardRef } from "react";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export type IconComponent = ComponentType<{ size?: number; color?: string }>;

export interface ITabBarButtonProps {
  icon: IconComponent;
  label: string;
  isFocused?: boolean;
  onPress?: PressableProps["onPress"];
  onLongPress?: PressableProps["onLongPress"];
  style?: StyleProp<ViewStyle>;
}

export const TabBarButton = forwardRef<View, ITabBarButtonProps>(
  function TabBarButton(
    { icon: Icon, label, isFocused = false, onPress, onLongPress, style },
    ref,
  ) {
    const { theme } = useUnistyles();
    const iconColor = isFocused ? theme.colors.primary : theme.colors.textMuted;

    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        onLongPress={onLongPress}
        accessibilityRole="tab"
        accessibilityState={{ selected: isFocused }}
        accessibilityLabel={label}
        style={[style, styles.button]}
      >
        <View
          collapsable={false}
          style={[
            styles.indicator,
            {
              backgroundColor: isFocused
                ? theme.colors.brandSubtle
                : "transparent",
            },
          ]}
        >
          <Icon size={24} color={iconColor} />
        </View>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create((theme) => ({
  button: {
    minHeight: 48,
    paddingHorizontal: theme.gap(1.5),
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    width: theme.gap(6),
    height: theme.gap(6),
    borderRadius: theme.gap(3),
    alignItems: "center",
    justifyContent: "center",
  },
}));
