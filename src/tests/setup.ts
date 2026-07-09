// Mock do módulo nativo do Unistyles + configuração de temas para os testes.
import "react-native-unistyles/mocks";

import "../../unistyles";

// Reanimated não tem runtime nativo no Jest e o mock oficial (v4) ainda inicializa
// o worklets nativo. Mock manual mínimo: Animated.View vira View e os hooks/helpers
// usados por Modal/ConfirmDialog/Skeleton viram no-op. Cobre só o que o app importa.
jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");
  const identity = (value) => value;
  const easingFn = () => 0;
  const Easing = {
    in: () => easingFn,
    out: () => easingFn,
    inOut: () => easingFn,
    cubic: easingFn,
    quad: easingFn,
    ease: easingFn,
    linear: easingFn,
  };
  return {
    __esModule: true,
    default: { View, createAnimatedComponent: identity },
    View,
    useSharedValue: (value) => ({ value }),
    useAnimatedStyle: () => ({}),
    useReducedMotion: () => false,
    withTiming: identity,
    withRepeat: identity,
    withSequence: (...values) => values[0],
    Easing,
  };
});

// Safe area precisa de provider em runtime; no Jest, mock manual mínimo (insets
// zerados, SafeAreaView/Provider como passthrough). Cobre o que o app usa.
jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  const frame = { x: 0, y: 0, width: 390, height: 844 };
  return {
    __esModule: true,
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: View,
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => frame,
    initialWindowMetrics: { insets, frame },
  };
});
