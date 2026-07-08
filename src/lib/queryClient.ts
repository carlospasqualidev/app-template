import NetInfo from "@react-native-community/netinfo";
import { onlineManager, QueryClient } from "@tanstack/react-query";

// Liga o estado online do TanStack Query à conectividade real (NetInfo). Assim
// as queries pausam offline e refazem ao reconectar. Roda uma vez no boot.
onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((state) => setOnline(Boolean(state.isConnected))),
);

/**
 * Cliente único do TanStack Query para todo o app.
 * Ajuste os defaults conforme a necessidade do projeto.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});
