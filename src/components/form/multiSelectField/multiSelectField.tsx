import { type ReactElement } from "react";
import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Field } from "../field";
import { MultiSelect, type IMultiSelectProps } from "../multiSelect";

type MultiSelectConfig = Omit<
  IMultiSelectProps,
  "value" | "onValueChange" | "hasError"
>;

type MultiSelectFieldProps<TForm extends FieldValues> = {
  label?: string;
  description?: string;
} & MultiSelectConfig &
  (
    | { control: Control<TForm>; name: FieldPath<TForm> }
    | {
        value?: string[];
        onChange?: (values: string[]) => void;
        error?: string;
      }
  );

export function MultiSelectField<TForm extends FieldValues>(
  props: MultiSelectFieldProps<TForm>,
) {
  const renderField = (
    value: string[],
    onChange: (values: string[]) => void,
    error: string | undefined,
    config: MultiSelectConfig,
    label?: string,
    description?: string,
  ): ReactElement => (
    <Field label={label} description={description} error={error}>
      <MultiSelect
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
          renderField(
            (field.value as string[] | undefined) ?? [],
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
  return renderField(
    value ?? [],
    onChange ?? (() => {}),
    error,
    config,
    label,
    description,
  );
}
