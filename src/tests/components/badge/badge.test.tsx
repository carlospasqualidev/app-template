import { render, screen } from "@testing-library/react-native";

import { Badge } from "@/components/badge";

describe("Badge", () => {
  it("renderiza o rótulo de texto", () => {
    render(<Badge>Ativo</Badge>);
    expect(screen.getByText("Ativo")).toBeOnTheScreen();
  });

  it("renderiza cada variante sem quebrar", () => {
    render(
      <>
        <Badge variant="secondary">Secundário</Badge>
        <Badge variant="success">Sucesso</Badge>
        <Badge variant="warning">Aviso</Badge>
        <Badge variant="destructive">Erro</Badge>
        <Badge variant="outline">Contorno</Badge>
      </>,
    );

    expect(screen.getByText("Secundário")).toBeOnTheScreen();
    expect(screen.getByText("Erro")).toBeOnTheScreen();
  });
});
