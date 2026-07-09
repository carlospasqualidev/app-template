import { render, screen } from "@testing-library/react-native";

import { Field } from "@/components/form/field";
import { Text } from "@/components/text";

describe("Field", () => {
  it("mostra label, descrição, filhos e erro", () => {
    render(
      <Field label="E-mail" description="Seu melhor e-mail" error="Obrigatório">
        <Text>controle</Text>
      </Field>,
    );

    expect(screen.getByText("E-mail")).toBeOnTheScreen();
    expect(screen.getByText("Seu melhor e-mail")).toBeOnTheScreen();
    expect(screen.getByText("controle")).toBeOnTheScreen();
    expect(screen.getByText("Obrigatório")).toBeOnTheScreen();
  });

  it("não renderiza mensagem de erro quando não há erro", () => {
    render(
      <Field label="Nome">
        <Text>controle</Text>
      </Field>,
    );

    expect(screen.queryByText("Obrigatório")).not.toBeOnTheScreen();
  });
});
