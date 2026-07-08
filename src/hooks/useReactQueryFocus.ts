import { focusManager } from "@tanstack/react-query";
import { useEffect } from "react";
import { AppState, type AppStateStatus, Platform } from "react-native";

/**
 * Liga o "focus" do TanStack Query ao ciclo de foreground/background do app
 * (`AppState`), habilitando `refetchOnWindowFocus` no RN. Chame uma vez no boot.
 */
export function useReactQueryFocus(): void {
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (status: AppStateStatus) => {
        if (Platform.OS !== "web") {
          focusManager.setFocused(status === "active");
        }
      },
    );

    return () => subscription.remove();
  }, []);
}
