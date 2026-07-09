import { useRouter } from "expo-router";
import { SearchX } from "lucide-react-native";

import { Button } from "@/components/button";
import { Empty } from "@/components/empty";
import { Screen } from "@/components/screen";

export function NotFoundScreen() {
  const router = useRouter();

  return (
    <Screen scrollable={false}>
      <Empty
        icon={SearchX}
        title="Página não encontrada"
        description="O endereço que você tentou abrir não existe ou foi movido."
        action={
          <Button onPress={() => router.replace("/")}>Ir para o início</Button>
        }
      />
    </Screen>
  );
}
