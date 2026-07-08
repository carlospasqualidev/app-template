import { Button } from "@/components/button";
import { Screen } from "@/components/screen";
import { Text } from "@/components/text";
import { useSessionStore } from "@/stores/sessionStore";

export default function ProfileScreen() {
  const user = useSessionStore((state) => state.user);
  const signOut = useSessionStore((state) => state.signOut);

  return (
    <Screen title="Perfil" description="Gerencie sua conta.">
      {user ? (
        <>
          <Text variant="p2" weight="medium">
            {user.name}
          </Text>
          <Text variant="p3" color="muted">
            {user.email}
          </Text>
        </>
      ) : null}
      <Button variant="outline" onPress={() => signOut()}>
        Sair
      </Button>
    </Screen>
  );
}
