import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Field } from "../field";
import { PasswordInput, type IPasswordInputProps } from "../passwordInput";

type PasswordOnly = Omit<
  IPasswordInputProps,
  "value" | "onChangeText" | "onBlur" | "hasError"
>;

type PasswordFieldProps<TForm extends FieldValues> = {
  label?: string;
  description?: string;
} & PasswordOnly &
  (
    | { control: Control<TForm>; name: FieldPath<TForm> }
    | { value?: string; onChangeText?: (text: string) => void; error?: string }
  );

export function PasswordField<TForm extends FieldValues>(
  props: PasswordFieldProps<TForm>,
) {
  if ("control" in props) {
    const { control, name, label, description, ...inputProps } = props;

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
            <PasswordInput
              value={(field.value as string | undefined) ?? ""}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              hasError={Boolean(fieldState.error)}
              accessibilityLabel={label}
              {...inputProps}
            />
          </Field>
        )}
      />
    );
  }

  const { value, onChangeText, error, label, description, ...inputProps } =
    props;

  return (
    <Field label={label} description={description} error={error}>
      <PasswordInput
        value={value}
        onChangeText={onChangeText}
        hasError={Boolean(error)}
        accessibilityLabel={label}
        {...inputProps}
      />
    </Field>
  );
}
