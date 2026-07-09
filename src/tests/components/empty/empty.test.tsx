import { render, screen } from "@testing-library/react-native";

import { Button } from "@/components/button";
import { Empty } from "@/components/empty";

describe("Empty", () => {
  it("mostra título e descrição", () => {
    render(<Empty title="Nenhum item" description="Ainda não há dados." />);
    expect(screen.getByText("Nenhum item")).toBeOnTheScreen();
    expect(screen.getByText("Ainda não há dados.")).toBeOnTheScreen();
  });

  it("renderiza a ação quando passada", () => {
    render(<Empty title="Nenhum item" action={<Button>Recarregar</Button>} />);
    expect(
      screen.getByRole("button", { name: "Recarregar" }),
    ).toBeOnTheScreen();
  });

  it("omite a descrição quando não há", () => {
    render(<Empty title="Nenhum item" />);
    expect(screen.getByText("Nenhum item")).toBeOnTheScreen();
  });
});
