import { useRouter } from "expo-router";
import { z } from "zod";

import { Button } from "@/components/button";
import { PasswordField, TextField, useZodForm } from "@/components/form";
import { Screen } from "@/components/screen";
import { useSessionStore } from "@/stores/sessionStore";

const schema = z.object({
  name: z.string().min(2, "Informe seu nome."),
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(8, "Mínimo de 8 caracteres."),
});

export function SignupScreen() {
  const router = useRouter();
  const signUp = useSessionStore((state) => state.signUp);
  const isAuthenticating = useSessionStore((state) => state.isAuthenticating);
  const form = useZodForm(schema, {
    defaultValues: { name: "", email: "", password: "" },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await signUp(values);
      router.replace("/");
    } catch {
      // A camada de rede já exibe o toast de erro.
    }
  });

  return (
    <Screen
      title="Nova conta"
      description="Preencha seus dados para começar."
      showBackButton
    >
      <TextField
        control={form.control}
        name="name"
        label="Nome"
        placeholder="Seu nome"
      />
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
        placeholder="Mínimo de 8 caracteres"
      />
      <Button onPress={handleSubmit} loading={isAuthenticating}>
        Criar conta
      </Button>
    </Screen>
  );
}
