import { useRouter } from "expo-router";
import { z } from "zod";

import { Button } from "@/components/button";
import { PasswordField, TextField, useZodForm } from "@/components/form";
import { Screen } from "@/components/screen";
import { useSessionStore } from "@/stores/sessionStore";

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
    <Screen title="Entrar" description="Acesse sua conta para continuar.">
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
      <Button variant="link" onPress={() => router.push("/signup")}>
        Criar conta
      </Button>
    </Screen>
  );
}
