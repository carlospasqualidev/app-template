import {
  render,
  screen,
  userEvent,
  waitFor,
} from "@testing-library/react-native";

import { ConfirmDialog } from "@/components/confirmDialog";

describe("ConfirmDialog", () => {
  it("não renderiza conteúdo quando fechado", () => {
    render(
      <ConfirmDialog
        visible={false}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        title="Excluir post"
      />,
    );
    expect(screen.queryByText("Excluir post")).not.toBeOnTheScreen();
  });

  it("mostra título, descrição e ações quando visível", () => {
    render(
      <ConfirmDialog
        visible
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        title="Excluir post"
        description="Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
      />,
    );

    expect(screen.getByText("Excluir post")).toBeOnTheScreen();
    expect(
      screen.getByText("Esta ação não pode ser desfeita."),
    ).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Excluir" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeOnTheScreen();
  });

  it("chama onConfirm e fecha ao confirmar", async () => {
    const onConfirm = jest.fn().mockResolvedValue(undefined);
    const onClose = jest.fn();
    const user = userEvent.setup();
    render(
      <ConfirmDialog
        visible
        onClose={onClose}
        onConfirm={onConfirm}
        title="Excluir"
        confirmLabel="Excluir"
      />,
    );

    await user.press(screen.getByRole("button", { name: "Excluir" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("cancela sem chamar onConfirm", async () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    const user = userEvent.setup();
    render(
      <ConfirmDialog
        visible
        onClose={onClose}
        onConfirm={onConfirm}
        title="Excluir"
      />,
    );

    await user.press(screen.getByRole("button", { name: "Cancelar" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("com requireText, habilita o confirmar só ao digitar a palavra", async () => {
    const user = userEvent.setup();
    render(
      <ConfirmDialog
        visible
        onClose={jest.fn()}
        onConfirm={jest.fn().mockResolvedValue(undefined)}
        title="Apagar conta"
        confirmLabel="Apagar"
        requireText="APAGAR"
      />,
    );

    const confirm = screen.getByRole("button", { name: "Apagar" });
    expect(confirm).toBeDisabled();

    await user.type(screen.getByPlaceholderText("APAGAR"), "APAGAR");

    expect(confirm).toBeEnabled();
  });
});
