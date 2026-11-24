import Constants from "expo-constants";
import {
  Bell,
  CircleQuestionMark,
  FileText,
  FingerprintPattern,
  KeyRound,
  Languages,
  LogOut,
  MapPin,
  MessageCircle,
  Palette,
  Pencil,
  ScrollText,
  ShieldCheck,
  Smartphone,
  UserRound,
} from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Avatar } from "@/components/avatar";
import { Button } from "@/components/button";
import { ConfirmDialog } from "@/components/confirmDialog";
import { Screen } from "@/components/screen";
import { Text } from "@/components/text";
import { toast } from "@/lib/toast";
import { useSessionStore } from "@/stores/sessionStore";

import { ProfileMenuItem } from "./profileMenuItem";
import { ProfileMenuSection } from "./profileMenuSection";

/**
 * MOCK: as opções abaixo ainda não têm tela nem backend. Cada uma chama
 * `showComingSoon`; ao implementar uma, troque pelo `router.push` da tela.
 * Os interruptores guardam só o estado local da tela.
 */
function showComingSoon() {
  toast.info("Disponível em breve.");
}

const appVersion = Constants.expoConfig?.version;

export function ProfileScreen() {
  const user = useSessionStore((state) => state.user);
  const signOut = useSessionStore((state) => state.signOut);

  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [signOutVisible, setSignOutVisible] = useState(false);

  return (
    <Screen title="Perfil" description="Gerencie sua conta.">
      {user ? (
        <View style={styles.header}>
          <Avatar name={user.name} uri={user.image} size={80} />
          <View style={styles.identity}>
            <Text variant="h3" align="center">
              {user.name}
            </Text>
            <Text variant="p3" color="muted" align="center">
              {user.email}
            </Text>
          </View>
          <Button
            variant="outline"
            size="sm"
            icon={Pencil}
            onPress={showComingSoon}
          >
            Editar perfil
          </Button>
        </View>
      ) : null}

      <ProfileMenuSection title="Conta">
        <ProfileMenuItem
          icon={UserRound}
          label="Dados pessoais"
          description="Nome, e-mail e telefone"
          onPress={showComingSoon}
        />
        <ProfileMenuItem
          icon={MapPin}
          label="Endereços"
          onPress={showComingSoon}
        />
        <ProfileMenuItem
          icon={FileText}
          label="Documentos"
          onPress={showComingSoon}
        />
      </ProfileMenuSection>

      <ProfileMenuSection title="Segurança">
        <ProfileMenuItem
          icon={KeyRound}
          label="Alterar senha"
          onPress={showComingSoon}
        />
        <ProfileMenuItem
          icon={FingerprintPattern}
          label="Entrar com biometria"
          checked={biometricsEnabled}
          onCheckedChange={setBiometricsEnabled}
        />
        <ProfileMenuItem
          icon={Smartphone}
          label="Dispositivos conectados"
          onPress={showComingSoon}
        />
      </ProfileMenuSection>

      <ProfileMenuSection title="Preferências">
        <ProfileMenuItem
          icon={Bell}
          label="Notificações"
          checked={notificationsEnabled}
          onCheckedChange={setNotificationsEnabled}
        />
        <ProfileMenuItem
          icon={Palette}
          label="Aparência"
          value="Automático"
          onPress={showComingSoon}
        />
        <ProfileMenuItem
          icon={Languages}
          label="Idioma"
          value="Português"
          onPress={showComingSoon}
        />
      </ProfileMenuSection>

      <ProfileMenuSection title="Ajuda">
        <ProfileMenuItem
          icon={CircleQuestionMark}
          label="Central de ajuda"
          onPress={showComingSoon}
        />
        <ProfileMenuItem
          icon={MessageCircle}
          label="Fale conosco"
          onPress={showComingSoon}
        />
        <ProfileMenuItem
          icon={ScrollText}
          label="Termos de uso"
          onPress={showComingSoon}
        />
        <ProfileMenuItem
          icon={ShieldCheck}
          label="Política de privacidade"
          onPress={showComingSoon}
        />
      </ProfileMenuSection>

      <ProfileMenuSection>
        <ProfileMenuItem
          icon={LogOut}
          label="Sair da conta"
          destructive
          showChevron={false}
          onPress={() => setSignOutVisible(true)}
        />
      </ProfileMenuSection>

      {appVersion ? (
        <Text variant="p3" color="muted" align="center">
          Versão {appVersion}
        </Text>
      ) : null}

      <ConfirmDialog
        visible={signOutVisible}
        onClose={() => setSignOutVisible(false)}
        onConfirm={() => signOut()}
        title="Sair da conta?"
        confirmLabel="Sair"
        destructive
      />
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    alignItems: "center",
    gap: theme.gap(1.5),
  },
  identity: {
    alignItems: "center",
  },
}));
