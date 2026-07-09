import { useRouter } from "expo-router";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { z } from "zod";

import { Button } from "@/components/button";
import { PasswordField, TextField, useZodForm } from "@/components/form";
import { toast } from "@/lib/toast";
import { useSessionStore } from "@/stores/sessionStore";

import { AuthFooter } from "../authFooter";
import { AuthLayout } from "../authLayout";

const schema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe sua senha."),
});

export function LoginScreen() {
  const router = useRouter();
  const signIn = useSessionStore((state) => state.signIn);
  const isAuthenticating = useSessionStore((state) => state.isAuthenticating);
  const form = useZodForm(schema, {
    defaultValues: { email: "", password: "" },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await signIn(values);
      router.replace("/");
    } catch {
      // A camada de rede já exibe o toast de erro.
    }
  });

  return (
    <AuthLayout title="Bem-vindo" subtitle="Acesse sua conta para continuar.">
      <TextField
        control={form.control}
        name="email"
        label="E-mail"
        placeholder="voce@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <PasswordField
        control={form.control}
        name="password"
        label="Senha"
        placeholder="Sua senha"
      />

      <Button onPress={handleSubmit} loading={isAuthenticating}>
        Entrar
      </Button>

      <View style={styles.footerGroup}>
        <Button
          variant="link"
          size="sm"
          onPress={() => toast.info("Recuperação de senha em breve.")}
        >
          Esqueci a senha
        </Button>
        <AuthFooter
          prompt="Não tem uma conta?"
          actionLabel="Criar conta"
          onPress={() => router.push("/signup")}
        />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create((theme) => ({
  footerGroup: {
    alignItems: "center",
    gap: theme.gap(0.5),
  },
}));
