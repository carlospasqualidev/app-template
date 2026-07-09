import { render, screen, userEvent } from "@testing-library/react-native";
import { useForm } from "react-hook-form";

import { TextField } from "@/components/form/textField";

describe("TextField", () => {
  it("standalone: associa label ao input e chama onChangeText", async () => {
    const onChangeText = jest.fn();
    const user = userEvent.setup();
    render(<TextField label="E-mail" value="" onChangeText={onChangeText} />);

    await user.type(screen.getByLabelText("E-mail"), "a");

    expect(onChangeText).toHaveBeenCalled();
  });

  it("standalone: exibe a mensagem de erro", () => {
    render(<TextField label="E-mail" value="" error="E-mail inválido." />);
    expect(screen.getByText("E-mail inválido.")).toBeOnTheScreen();
  });

  it("controlled: liga ao React Hook Form via control/name", () => {
    function Harness() {
      const { control } = useForm({ defaultValues: { email: "" } });
      return <TextField control={control} name="email" label="E-mail" />;
    }
    render(<Harness />);

    expect(screen.getByLabelText("E-mail")).toBeOnTheScreen();
  });
});
