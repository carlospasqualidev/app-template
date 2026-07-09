import { render, screen } from "@testing-library/react-native";

import { Screen } from "@/components/screen";
import { Text } from "@/components/text";

jest.mock("expo-router", () => ({
  useRouter: () => ({ back: jest.fn() }),
}));

describe("Screen", () => {
  it("renderiza título como cabeçalho, descrição e corpo", () => {
    render(
      <Screen title="Perfil" description="Gerencie sua conta.">
        <Text>corpo</Text>
      </Screen>,
    );

    expect(screen.getByRole("header", { name: "Perfil" })).toBeOnTheScreen();
    expect(screen.getByText("Gerencie sua conta.")).toBeOnTheScreen();
    expect(screen.getByText("corpo")).toBeOnTheScreen();
  });

  it("mostra o botão de voltar quando showBackButton", () => {
    render(
      <Screen title="Detalhe" showBackButton>
        <Text>corpo</Text>
      </Screen>,
    );

    expect(screen.getByRole("button", { name: "Voltar" })).toBeOnTheScreen();
  });
});
