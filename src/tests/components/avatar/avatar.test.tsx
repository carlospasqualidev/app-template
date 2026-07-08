import { render, screen } from "@testing-library/react-native";

import { Avatar } from "@/components/avatar";

describe("Avatar", () => {
  it("mostra as iniciais quando não há imagem", () => {
    render(<Avatar name="Maria Silva" />);
    expect(screen.getByText("MS")).toBeOnTheScreen();
  });

  it("expõe o nome como label acessível", () => {
    render(<Avatar name="João Pereira" />);
    expect(screen.getByLabelText("João Pereira")).toBeOnTheScreen();
  });
});
