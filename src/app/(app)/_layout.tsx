import { type ErrorBoundaryProps, Redirect } from "expo-router";
import { Blocks, Newspaper, User } from "lucide-react-native";

import { ErrorFallback } from "@/components/errorFallback";
import { TabBar, type ITab } from "@/components/tabBar";
import { useSessionStore } from "@/stores/sessionStore";

const tabs: ITab[] = [
  { name: "index", href: "/", label: "Componentes", icon: Blocks },
  { name: "explore", href: "/explore", label: "Feed", icon: Newspaper },
  { name: "profile", href: "/profile", label: "Perfil", icon: User },
];

export default function AppLayout() {
  const status = useSessionStore((state) => state.status);

  // A validação/boot acontece no layout raiz; aqui a sessão já está resolvida.
  if (status === "unauthenticated") {
    return <Redirect href="/login" />;
  }

  return <TabBar tabs={tabs} />;
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <ErrorFallback error={error} onRetry={retry} />;
}
