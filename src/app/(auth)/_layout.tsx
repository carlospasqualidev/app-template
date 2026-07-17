import { Stack } from "expo-router";
import { useUnistyles } from "react-native-unistyles";

export default function AuthLayout() {
  const { theme } = useUnistyles();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // Fundo da cena = fundo do tema; evita o flash branco padrão do navegador na
        // transição de slide (ex.: login → cadastro) no tema escuro.
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    />
  );
}
