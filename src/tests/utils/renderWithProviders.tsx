import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react-native";
import { type ReactElement, type ReactNode } from "react";

/** QueryClient isolado por teste, sem retry para falhar rápido. */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

/**
 * Renderiza com os providers globais (TanStack Query). Use nos testes que tocam
 * server state; para componentes puros, o `render` direto basta.
 */
export function renderWithProviders(ui: ReactElement) {
  const queryClient = createTestQueryClient();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return { queryClient, ...render(ui, { wrapper: Wrapper }) };
}
