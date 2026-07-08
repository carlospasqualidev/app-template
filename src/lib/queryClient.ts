import { QueryClient } from "@tanstack/react-query";

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
