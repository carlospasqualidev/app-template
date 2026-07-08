import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Field } from "../field";
import { Textarea, type ITextareaProps } from "../textarea";

type TextareaOnly = Omit<
  ITextareaProps,
  "value" | "onChangeText" | "onBlur" | "hasError"
>;

type TextareaFieldProps<TForm extends FieldValues> = {
  label?: string;
  description?: string;
} & TextareaOnly &
  (
    | { control: Control<TForm>; name: FieldPath<TForm> }
    | { value?: string; onChangeText?: (text: string) => void; error?: string }
  );

export function TextareaField<TForm extends FieldValues>(
  props: TextareaFieldProps<TForm>,
) {
  if ("control" in props) {
    const { control, name, label, description, ...textareaProps } = props;

    return (
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <Field
            label={label}
            description={description}
            error={fieldState.error?.message}
          >
            <Textarea
              value={(field.value as string | undefined) ?? ""}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              hasError={Boolean(fieldState.error)}
              accessibilityLabel={label}
              {...textareaProps}
            />
          </Field>
        )}
      />
    );
  }

  const { value, onChangeText, error, label, description, ...textareaProps } =
    props;

  return (
    <Field label={label} description={description} error={error}>
      <Textarea
        value={value}
        onChangeText={onChangeText}
        hasError={Boolean(error)}
        accessibilityLabel={label}
        {...textareaProps}
      />
    </Field>
  );
}
