import { render } from "@testing-library/react-native";

import { Skeleton } from "@/components/skeleton";

describe("Skeleton", () => {
  it("monta sem quebrar (respeitando redução de movimento)", () => {
    expect(render(<Skeleton />).toJSON()).toBeTruthy();
  });
});
