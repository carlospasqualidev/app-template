import { render, screen } from "@testing-library/react-native";

import { Text } from "@/components/text";

describe("Text", () => {
  it("renderiza o conteúdo", () => {
    render(<Text>Olá</Text>);
    expect(screen.getByText("Olá")).toBeOnTheScreen();
  });

  it("expõe os títulos como header para o leitor de tela", () => {
    render(<Text variant="h1">Título</Text>);
    expect(screen.getByRole("header", { name: "Título" })).toBeOnTheScreen();
  });

  it("não marca corpo (p*) como header", () => {
    render(<Text variant="p2">Corpo</Text>);
    expect(screen.queryByRole("header")).not.toBeOnTheScreen();
  });
});
