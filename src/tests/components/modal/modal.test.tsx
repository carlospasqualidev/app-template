import { render, screen, userEvent } from "@testing-library/react-native";

import { Modal } from "@/components/modal";
import { Text } from "@/components/text";

describe("Modal", () => {
  it("mostra título e filhos quando visível", () => {
    render(
      <Modal visible onClose={jest.fn()} title="Editar perfil">
        <Text>corpo da sheet</Text>
      </Modal>,
    );

    expect(screen.getByText("Editar perfil")).toBeOnTheScreen();
    expect(screen.getByText("corpo da sheet")).toBeOnTheScreen();
  });

  it("fecha pelo botão de fechar", async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    render(
      <Modal visible onClose={onClose} title="Editar perfil">
        <Text>corpo</Text>
      </Modal>,
    );

    await user.press(screen.getByRole("button", { name: "Fechar" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("não renderiza filhos quando fechado", () => {
    render(
      <Modal visible={false} onClose={jest.fn()} title="Editar perfil">
        <Text>corpo</Text>
      </Modal>,
    );

    expect(screen.queryByText("corpo")).not.toBeOnTheScreen();
  });
});
