import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Screen } from "@/components/screen";
import { Text } from "@/components/text";
import { useSessionStore } from "@/stores/sessionStore";

export function ProfileScreen() {
  const user = useSessionStore((state) => state.user);
  const signOut = useSessionStore((state) => state.signOut);

  return (
    <Screen title="Perfil" description="Gerencie sua conta.">
      {user ? (
        <View style={styles.header}>
          <Avatar name={user.name} uri={user.image} size={72} />
          <Text variant="h3">{user.name}</Text>
          <Text variant="p3" color="muted">
            {user.email}
          </Text>
          <Badge variant="success">Sessão ativa</Badge>
        </View>
      ) : null}

      <Button variant="outline" onPress={() => signOut()}>
        Sair
      </Button>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    alignItems: "center",
    gap: theme.gap(1),
  },
}));
