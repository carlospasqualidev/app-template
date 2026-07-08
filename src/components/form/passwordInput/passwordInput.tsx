import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Input, type IInputProps } from "../input";

export type IPasswordInputProps = IInputProps;

export function PasswordInput({ style, ...props }: IPasswordInputProps) {
  const { theme } = useUnistyles();
  const [isVisible, setIsVisible] = useState(false);
  const ToggleIcon = isVisible ? EyeOff : Eye;

  return (
    <View style={styles.wrapper}>
      <Input
        secureTextEntry={!isVisible}
        style={[styles.input, style]}
        {...props}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isVisible ? "Ocultar senha" : "Mostrar senha"}
        hitSlop={8}
        onPress={() => setIsVisible((current) => !current)}
        style={styles.toggle}
      >
        <ToggleIcon size={18} color={theme.colors.textMuted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  wrapper: {
    justifyContent: "center",
  },
  input: {
    paddingRight: theme.gap(5.5),
  },
  toggle: {
    position: "absolute",
    right: theme.gap(1.5),
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
}));
