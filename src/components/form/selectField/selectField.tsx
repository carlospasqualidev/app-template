import { type ReactElement } from "react";
import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Field } from "../field";
import { Select, type ISelectProps } from "../select";

type SelectConfig = Omit<ISelectProps, "value" | "onValueChange" | "hasError">;

type SelectFieldProps<TForm extends FieldValues> = {
  label?: string;
  description?: string;
} & SelectConfig &
  (
    | { control: Control<TForm>; name: FieldPath<TForm> }
    | { value?: string; onChange?: (value: string) => void; error?: string }
  );

export function SelectField<TForm extends FieldValues>(
  props: SelectFieldProps<TForm>,
) {
  const renderSelect = (
    value: string | undefined,
    onChange: (value: string) => void,
    error: string | undefined,
    config: SelectConfig,
    label?: string,
    description?: string,
  ): ReactElement => (
    <Field label={label} description={description} error={error}>
      <Select
        value={value}
        onValueChange={onChange}
        hasError={Boolean(error)}
        {...config}
      />
    </Field>
  );

  if ("control" in props) {
    const { control, name, label, description, ...config } = props;
    return (
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) =>
          renderSelect(
            field.value as string | undefined,
            field.onChange,
            fieldState.error?.message,
            config,
            label,
            description,
          )
        }
      />
    );
  }

  const { value, onChange, error, label, description, ...config } = props;
  return renderSelect(
    value,
    onChange ?? (() => {}),
    error,
    config,
    label,
    description,
  );
}
