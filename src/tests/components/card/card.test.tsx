import { render, screen } from "@testing-library/react-native";

import { Card } from "@/components/card";
import { Text } from "@/components/text";

describe("Card", () => {
  it("renderiza os filhos", () => {
    render(
      <Card>
        <Text>Conteúdo</Text>
      </Card>,
    );
    expect(screen.getByText("Conteúdo")).toBeOnTheScreen();
  });

  it("repassa props de View (ex.: accessibilityLabel)", () => {
    render(
      <Card accessibilityLabel="cartão de resumo">
        <Text>x</Text>
      </Card>,
    );
    expect(screen.getByLabelText("cartão de resumo")).toBeOnTheScreen();
  });

  it("renderiza a variante glass", () => {
    render(
      <Card variant="glass">
        <Text>vidro</Text>
      </Card>,
    );
    expect(screen.getByText("vidro")).toBeOnTheScreen();
  });
});
