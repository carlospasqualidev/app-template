import { type ReactElement } from "react";
import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Field } from "../field";
import { RadioGroup, RadioGroupItem } from "../radioGroup";

interface RadioOption {
  label: string;
  value: string;
}

type RadioGroupFieldProps<TForm extends FieldValues> = {
  label?: string;
  description?: string;
  options: RadioOption[];
  disabled?: boolean;
} & (
  | { control: Control<TForm>; name: FieldPath<TForm> }
  | { value?: string; onChange?: (value: string) => void; error?: string }
);

export function RadioGroupField<TForm extends FieldValues>(
  props: RadioGroupFieldProps<TForm>,
) {
  const { label, description, options, disabled } = props;

  const renderGroup = (
    value: string | undefined,
    onChange: (value: string) => void,
    error?: string,
  ): ReactElement => (
    <Field label={label} description={description} error={error}>
      <RadioGroup value={value} onValueChange={onChange} disabled={disabled}>
        {options.map((option) => (
          <RadioGroupItem
            key={option.value}
            value={option.value}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </Field>
  );

  if ("control" in props) {
    const { control, name } = props;
    return (
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) =>
          renderGroup(
            field.value as string | undefined,
            field.onChange,
            fieldState.error?.message,
          )
        }
      />
    );
  }

  const { value, onChange, error } = props;
  return renderGroup(value, onChange ?? (() => {}), error);
}
