import { type ReactElement } from "react";
import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { DatePicker, type IDatePickerProps } from "../datePicker";
import { Field } from "../field";

type DateConfig = Omit<IDatePickerProps, "value" | "onChange" | "hasError">;

type DateFieldProps<TForm extends FieldValues> = {
  label?: string;
  description?: string;
} & DateConfig &
  (
    | { control: Control<TForm>; name: FieldPath<TForm> }
    | { value?: Date | null; onChange?: (value: Date) => void; error?: string }
  );

export function DateField<TForm extends FieldValues>(
  props: DateFieldProps<TForm>,
) {
  const renderPicker = (
    value: Date | null,
    onChange: (value: Date) => void,
    error: string | undefined,
    config: DateConfig,
    label?: string,
    description?: string,
  ): ReactElement => (
    <Field label={label} description={description} error={error}>
      <DatePicker
        value={value}
        onChange={onChange}
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
          renderPicker(
            (field.value as Date | null | undefined) ?? null,
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
  return renderPicker(
    value ?? null,
    onChange ?? (() => {}),
    error,
    config,
    label,
    description,
  );
}
