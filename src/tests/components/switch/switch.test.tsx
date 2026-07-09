import { fireEvent, render, screen } from "@testing-library/react-native";

import { Switch } from "@/components/form/switch";

describe("Switch", () => {
  it("dispara onValueChange ao alternar", () => {
    const onValueChange = jest.fn();
    render(<Switch value={false} onValueChange={onValueChange} />);

    fireEvent(screen.getByRole("switch"), "valueChange", true);

    expect(onValueChange).toHaveBeenCalledWith(true);
  });
});
