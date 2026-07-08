import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Field } from "../field";
import { Input, type IInputProps } from "../input";

type InputOnly = Omit<
  IInputProps,
  "value" | "onChangeText" | "onBlur" | "hasError"
>;

type TextFieldProps<TForm extends FieldValues> = {
  label?: string;
  description?: string;
} & InputOnly &
  (
    | { control: Control<TForm>; name: FieldPath<TForm> }
    | { value?: string; onChangeText?: (text: string) => void; error?: string }
  );

export function TextField<TForm extends FieldValues>(
  props: TextFieldProps<TForm>,
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
            <Input
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
      <Input
        value={value}
        onChangeText={onChangeText}
        hasError={Boolean(error)}
        accessibilityLabel={label}
        {...inputProps}
      />
    </Field>
  );
}
