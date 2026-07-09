import { StyleSheet } from "react-native-unistyles";

const sharedTokens = {
  gap: (value: number) => value * 8,
  // Escala de raio inspirada no shadcn (--radius base = `lg` 10px). Fonte única de
  // curvatura do app — componentes usam theme.radius.* em vez de valor solto.
  radius: {
    sm: 6, // checkbox, skeleton
    md: 8, // botões, inputs, badge, controles
    lg: 10, // base
    xl: 14, // cards / superfícies
    xxl: 20, // bottom sheet (Modal)
    full: 9999, // círculos e pílulas (radio, avatar, dia do calendário)
  },
  // Opacidades de estado (fonte única) — ex.: controle desabilitado.
  opacity: {
    disabled: 0.5,
  },
  typography: {
    h1: {
      fontSize: 36,
      lineHeight: 40,
      fontWeight: "800" as const,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 30,
      lineHeight: 36,
      fontWeight: "600" as const,
      letterSpacing: -0.4,
    },
    h3: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: "600" as const,
      letterSpacing: -0.3,
    },
    p1: { fontSize: 18, lineHeight: 28, fontWeight: "400" as const },
    p2: { fontSize: 16, lineHeight: 24, fontWeight: "400" as const },
    p3: { fontSize: 14, lineHeight: 20, fontWeight: "400" as const },
  },
};

const lightBrand = "#7D00B8";
const lightTheme = {
  colors: {
    brand: lightBrand,
    brandForeground: "#FFFFFF",
    background: "#FFFFFF",
    card: "#FFFFFF",
    border: "#E5E7EB",
    brandSubtle: "#EFE2FA",
    textForeground: "#11181C",
    textMuted: "#6B7280",
    primary: lightBrand,
    secondary: "#F1F3F5",
    secondaryForeground: "#11181C",
    destructive: "#DC2626",
    destructiveForeground: "#FFFFFF",
    success: "#16A34A",
    successForeground: "#FFFFFF",
    warning: "#D97706",
    warningForeground: "#FFFFFF",
    // Efeitos: scrim do modal, tints do glass (tab bar) e cor da sombra.
    overlay: "rgba(0,0,0,0.6)",
    glassSurface: "rgba(255,255,255,0.42)",
    glassBorder: "rgba(0,0,0,0.06)",
    shadow: "#000000",
  },
  ...sharedTokens,
};

const darkBrand = "#A855F7";
const darkTheme = {
  colors: {
    brand: darkBrand,
    brandForeground: "#FFFFFF",
    background: "#11181C",
    card: "#1C2127",
    border: "#2A2F36",
    brandSubtle: "#2B1D3A",
    textForeground: "#ECEDEE",
    textMuted: "#9CA3AF",
    primary: darkBrand,
    secondary: "#262B31",
    secondaryForeground: "#ECEDEE",
    destructive: "#EF4444",
    destructiveForeground: "#FFFFFF",
    success: "#22C55E",
    successForeground: "#052E16",
    warning: "#F59E0B",
    warningForeground: "#3A2606",
    // Efeitos: scrim do modal, tints do glass (tab bar) e cor da sombra.
    overlay: "rgba(0,0,0,0.6)",
    glassSurface: "rgba(28,33,39,0.42)",
    glassBorder: "rgba(255,255,255,0.10)",
    shadow: "#000000",
  },
  ...sharedTokens,
};

const appThemes = {
  light: lightTheme,
  dark: darkTheme,
};

const breakpoints = {
  xs: 0,
  sm: 300,
  md: 500,
  lg: 800,
  xl: 1200,
};

type AppBreakpoints = typeof breakpoints;
type AppThemes = typeof appThemes;

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  settings: {
    adaptiveThemes: true,
  },
  breakpoints,
  themes: appThemes,
});
