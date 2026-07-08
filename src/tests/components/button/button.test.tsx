import { render, screen, userEvent } from "@testing-library/react-native";

import { Button } from "@/components/button";

describe("Button", () => {
  it("renderiza o rótulo como botão acessível", () => {
    render(<Button>Salvar</Button>);
    expect(screen.getByRole("button", { name: "Salvar" })).toBeOnTheScreen();
  });

  it("dispara onPress ao tocar", async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    render(<Button onPress={onPress}>Salvar</Button>);

    await user.press(screen.getByRole("button", { name: "Salvar" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("fica desabilitado e não dispara onPress quando loading", async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    render(
      <Button loading onPress={onPress}>
        Salvar
      </Button>,
    );

    const button = screen.getByRole("button");
    await user.press(button);

    expect(onPress).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });
});
