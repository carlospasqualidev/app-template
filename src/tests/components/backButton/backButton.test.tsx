import { render, screen, userEvent } from "@testing-library/react-native";

import { BackButton } from "@/components/backButton";

jest.mock("expo-router", () => ({
  useRouter: () => ({ back: jest.fn() }),
}));

describe("BackButton", () => {
  it("é um botão acessível rotulado 'Voltar'", () => {
    render(<BackButton />);
    expect(screen.getByRole("button", { name: "Voltar" })).toBeOnTheScreen();
  });

  it("dispara o onPress fornecido", async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    render(<BackButton onPress={onPress} />);

    await user.press(screen.getByRole("button", { name: "Voltar" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
