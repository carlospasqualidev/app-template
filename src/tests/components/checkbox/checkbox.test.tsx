import { render, screen, userEvent } from "@testing-library/react-native";

import { Checkbox } from "@/components/form/checkbox";

describe("Checkbox", () => {
  it("dispara onCheckedChange ao pressionar", async () => {
    const onCheckedChange = jest.fn();
    const user = userEvent.setup();
    render(<Checkbox checked={false} onCheckedChange={onCheckedChange} />);

    await user.press(screen.getByRole("checkbox"));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("desmarca ao pressionar quando já marcado", async () => {
    const onCheckedChange = jest.fn();
    const user = userEvent.setup();
    render(<Checkbox checked onCheckedChange={onCheckedChange} />);

    await user.press(screen.getByRole("checkbox"));

    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });
});
