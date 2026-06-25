import { StyleSheet } from "react-native-unistyles";

const sharedTokens = {
  gap: (value: number) => value * 8,
  typography: {
    h1: { fontSize: 32, lineHeight: 40, fontWeight: "700" as const },
    h2: { fontSize: 24, lineHeight: 32, fontWeight: "700" as const },
    h3: { fontSize: 20, lineHeight: 28, fontWeight: "600" as const },
    body: { fontSize: 16, lineHeight: 24, fontWeight: "400" as const },
    caption: { fontSize: 13, lineHeight: 18, fontWeight: "400" as const },
  },
};

const lightBrand = "#7D00B8";
const lightTheme = {
  colors: {
    brand: lightBrand,
    brandForeground: "#FFFFFF",
    background: "#FFFFFF",
    card: "#FFFFFF",
    textForeground: "#11181C",
    textMuted: "#6B7280",
    primary: lightBrand,
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
    textForeground: "#ECEDEE",
    textMuted: "#9CA3AF",
    primary: darkBrand,
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
