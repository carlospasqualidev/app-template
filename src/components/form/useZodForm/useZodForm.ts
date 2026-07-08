import { zodResolver } from "@hookform/resolvers/zod";
import {
  type FieldValues,
  useForm,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";
import type { z, ZodType } from "zod";

/**
 * Único ponto de criação de formulário: React Hook Form já com o resolver do Zod
 * e `mode: "onChange"` por padrão. Os tipos derivam do schema (`z.input`/`z.output`).
 */
export function useZodForm<TSchema extends ZodType<FieldValues, FieldValues>>(
  schema: TSchema,
  options?: Omit<
    UseFormProps<z.input<TSchema>, unknown, z.output<TSchema>>,
    "resolver"
  >,
): UseFormReturn<z.input<TSchema>, unknown, z.output<TSchema>> {
  return useForm<z.input<TSchema>, unknown, z.output<TSchema>>({
    mode: "onChange",
    ...options,
    resolver: zodResolver(schema),
  });
}
