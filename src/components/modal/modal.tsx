import { X } from "lucide-react-native";
import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  findNodeHandle,
  Modal as ModalPrimitive,
  Pressable,
  ScrollView,
  StatusBar,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Text } from "@/components/text";
import { useKeyboardHeight } from "@/hooks/useKeyboardHeight";

interface IModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxHeight?: number;
}

export function Modal({
  visible,
  onClose,
  title,
  children,
  maxHeight,
}: IModalProps) {
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const keyboardHeight = useKeyboardHeight();
  const reduceMotion = useReducedMotion();
  const sheetRef = useRef<View>(null);

  const bottomInset = Math.max(insets.bottom, theme.gap(1.5));
  // Ancora a base acima do teclado e reduz a altura para caber no espaço visível.
  const contentBottom = Math.max(bottomInset, keyboardHeight);
  const resolvedMaxHeight =
    (maxHeight ??
      windowHeight -
        Math.max(
          insets.top,
          (StatusBar.currentHeight ?? 0) + theme.gap(1),
          theme.gap(4),
        ) -
        bottomInset) - keyboardHeight;

  const overlayOpacity = useSharedValue(0);
  const contentOffset = useSharedValue(windowHeight);
  const [isMounted, setIsMounted] = useState(visible);
  // Distância de saída sempre atual, sem colocar windowHeight nas deps do efeito
  // de abrir/fechar (senão o resize do teclado no Android reiniciaria a animação).
  const slideOutDistance = useRef(windowHeight);
  useEffect(() => {
    slideOutDistance.current = windowHeight;
  }, [windowHeight]);

  useEffect(() => {
    if (visible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- monta para animar a entrada; a sheet segue montada durante a saída
      setIsMounted(true);
      if (reduceMotion) {
        overlayOpacity.value = 1;
        contentOffset.value = 0;
        return;
      }
      overlayOpacity.value = withTiming(1, { duration: 280 });
      contentOffset.value = withTiming(0, {
        duration: 360,
        easing: Easing.out(Easing.cubic),
      });
      return;
    }

    if (reduceMotion) {
      overlayOpacity.value = 0;
      contentOffset.value = slideOutDistance.current;
      setIsMounted(false);
      return;
    }

    overlayOpacity.value = withTiming(0, { duration: 140 });
    contentOffset.value = withTiming(slideOutDistance.current, {
      duration: 180,
      easing: Easing.in(Easing.quad),
    });
    // Desmonta por timer (não pelo callback): a animação pode ser cancelada.
    const hideTimer = setTimeout(() => setIsMounted(false), 220);

    return () => clearTimeout(hideTimer);
  }, [contentOffset, overlayOpacity, reduceMotion, visible]);

  // Manda o foco do leitor de tela para a sheet ao abrir.
  useEffect(() => {
    if (!visible) return;

    const focusTimer = setTimeout(() => {
      const tag = sheetRef.current ? findNodeHandle(sheetRef.current) : null;
      if (tag) AccessibilityInfo.setAccessibilityFocus(tag);
    }, 120);

    return () => clearTimeout(focusTimer);
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));
  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentOffset.value }],
  }));

  return (
    <ModalPrimitive
      animationType="none"
      navigationBarTranslucent
      statusBarTranslucent
      transparent
      visible={isMounted}
      onRequestClose={onClose}
    >
      <Animated.View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[styles.overlay, { bottom: insets.bottom }, overlayStyle]}
      >
        <Pressable style={styles.overlayPress} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[styles.anchor, { bottom: contentBottom }, contentStyle]}
      >
        <View
          ref={sheetRef}
          accessibilityViewIsModal
          style={[styles.sheet, { maxHeight: resolvedMaxHeight }]}
        >
          <View style={styles.header}>
            {title ? (
              <Text variant="h3" style={styles.title}>
                {title}
              </Text>
            ) : (
              <View style={styles.title} />
            )}
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
              hitSlop={theme.gap(1)}
              style={styles.close}
            >
              <X size={18} color={theme.colors.textForeground} />
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.body}
          >
            {children}
          </ScrollView>
        </View>
      </Animated.View>
    </ModalPrimitive>
  );
}

const styles = StyleSheet.create((theme) => ({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  overlayPress: {
    flex: 1,
  },
  anchor: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  sheet: {
    overflow: "hidden",
    borderTopLeftRadius: theme.gap(3.5),
    borderTopRightRadius: theme.gap(3.5),
    backgroundColor: theme.colors.background,
    paddingBottom: theme.gap(2.5),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.gap(2),
    paddingHorizontal: theme.gap(2.5),
    paddingTop: theme.gap(2.5),
    paddingBottom: theme.gap(2),
  },
  title: {
    flex: 1,
  },
  close: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 36,
    minHeight: 36,
    borderRadius: theme.gap(2.5),
    backgroundColor: theme.colors.border,
  },
  body: {
    gap: theme.gap(2.5),
    paddingHorizontal: theme.gap(2.5),
    paddingBottom: theme.gap(2),
  },
}));
