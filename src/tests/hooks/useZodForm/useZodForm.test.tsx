import { act, renderHook } from "@testing-library/react-native";
import { z } from "zod";

import { useZodForm } from "@/components/form/useZodForm";

const schema = z.object({
  email: z.string().email("E-mail inválido."),
});

describe("useZodForm", () => {
  it("chama onInvalid com erro em pt-BR quando o valor é inválido", async () => {
    const { result } = renderHook(() =>
      useZodForm(schema, { defaultValues: { email: "" } }),
    );
    const onValid = jest.fn();
    const onInvalid = jest.fn();

    await act(async () => {
      await result.current.handleSubmit(onValid, onInvalid)();
    });

    expect(onValid).not.toHaveBeenCalled();
    expect(onInvalid).toHaveBeenCalledTimes(1);
    const errors = onInvalid.mock.calls[0]?.[0] as {
      email?: { message?: string };
    };
    expect(errors.email?.message).toBe("E-mail inválido.");
  });

  it("chama onValid com os dados quando válido", async () => {
    const { result } = renderHook(() =>
      useZodForm(schema, { defaultValues: { email: "maria@exemplo.com" } }),
    );
    const onValid = jest.fn();

    await act(async () => {
      await result.current.handleSubmit(onValid)();
    });

    expect(onValid).toHaveBeenCalledTimes(1);
    expect(onValid.mock.calls[0]?.[0]).toEqual({ email: "maria@exemplo.com" });
  });
});
