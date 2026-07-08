import { UnistylesRuntime } from "react-native-unistyles";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { zustandStorage } from "@/lib/storage";

export type ThemePreference = "system" | "light" | "dark";

interface IThemeState {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

/**
 * Aplica a preferência ao runtime do Unistyles.
 * `system` volta ao tema adaptativo; `light`/`dark` fixam o tema.
 */
function applyTheme(preference: ThemePreference): void {
  if (preference === "system") {
    UnistylesRuntime.setAdaptiveThemes(true);
    return;
  }
  UnistylesRuntime.setAdaptiveThemes(false);
  UnistylesRuntime.setTheme(preference);
}

export const useThemeStore = create<IThemeState>()(
  persist(
    (set) => ({
      preference: "system",
      setPreference: (preference) => {
        applyTheme(preference);
        set({ preference });
      },
    }),
    {
      name: "theme-preference",
      storage: createJSONStorage(() => zustandStorage),
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.preference);
      },
    },
  ),
);
