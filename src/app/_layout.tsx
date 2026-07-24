import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SystemBars } from "react-native-edge-to-edge";
import { useUnistyles } from "react-native-unistyles";
import { Toaster } from "sonner-native";

import { SessionBoot } from "@/components/sessionBoot";
import { SystemBarsBackground } from "@/components/systemBars";
import { useReactQueryFocus } from "@/hooks/useReactQueryFocus";
import { queryClient } from "@/lib/queryClient";
import { useSessionStore } from "@/stores/sessionStore";

export default function RootLayout() {
  const { theme, rt } = useUnistyles();
  const status = useSessionStore((state) => state.status);
  const validate = useSessionStore((state) => state.validate);

  useReactQueryFocus();

  useEffect(() => {
    if (status === "idle") {
      validate();
    }
  }, [status, validate]);

  // Valida a sessão antes de montar as rotas: assim o navegador de rotas (Stack
  // → Tabs) monta já num estado definido, sem swap de layout que quebra a tab bar.
  const isValidatingSession = status === "idle" || status === "validating";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          {/* Ícones das DUAS barras (status + navegação) acompanham o tema do SO:
              escuros no claro, claros no escuro. Sem isto, no edge-to-edge a barra de
              navegação fica com botões claros (invisíveis) sobre o fundo claro. */}
          <SystemBars style={rt.colorScheme === "dark" ? "light" : "dark"} />
          {isValidatingSession ? (
            <SessionBoot />
          ) : (
            <Stack
              screenOptions={{
                headerShown: false,
                // Fundo da cena = fundo do tema; sem isso, a transição de slide mostra o
                // branco padrão do navegador por um frame antes de a tela pintar (flash no
                // tema escuro).
                contentStyle: { backgroundColor: theme.colors.background },
              }}
            />
          )}
          <SystemBarsBackground />
          <Toaster position="top-center" theme="system" richColors />
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
