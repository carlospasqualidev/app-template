import { type ReactElement } from "react";
import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Text } from "@/components/text";

import { Switch } from "../switch";

type SwitchFieldProps<TForm extends FieldValues> = {
  label: string;
  description?: string;
} & (
  | { control: Control<TForm>; name: FieldPath<TForm> }
  | { value?: boolean; onChange?: (value: boolean) => void; error?: string }
);

export function SwitchField<TForm extends FieldValues>(
  props: SwitchFieldProps<TForm>,
) {
  const { label, description } = props;

  const renderRow = (
    value: boolean,
    onChange: (value: boolean) => void,
    error?: string,
  ): ReactElement => (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.texts}>
          <Text variant="p2">{label}</Text>
          {description ? (
            <Text variant="p3" color="muted">
              {description}
            </Text>
          ) : null}
        </View>
        <Switch value={value} onValueChange={onChange} />
      </View>
      {error ? (
        <Text variant="p3" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );

  if ("control" in props) {
    const { control, name } = props;
    return (
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) =>
          renderRow(
            Boolean(field.value),
            field.onChange,
            fieldState.error?.message,
          )
        }
      />
    );
  }

  const { value, onChange, error } = props;
  return renderRow(Boolean(value), onChange ?? (() => {}), error);
}

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.gap(0.75),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.gap(2),
  },
  texts: {
    flex: 1,
    gap: theme.gap(0.25),
  },
  error: {
    color: theme.colors.destructive,
  },
}));
