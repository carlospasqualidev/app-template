import { type ReactElement } from "react";
import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Pressable, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Text } from "@/components/text";

import { Checkbox } from "../checkbox";

type CheckboxFieldProps<TForm extends FieldValues> = {
  label: string;
  description?: string;
} & (
  | { control: Control<TForm>; name: FieldPath<TForm> }
  | { value?: boolean; onChange?: (checked: boolean) => void; error?: string }
);

export function CheckboxField<TForm extends FieldValues>(
  props: CheckboxFieldProps<TForm>,
) {
  const { label, description } = props;

  const renderRow = (
    checked: boolean,
    onChange: (checked: boolean) => void,
    error?: string,
  ): ReactElement => (
    <View style={styles.container}>
      <View style={styles.row}>
        <Checkbox checked={checked} onCheckedChange={onChange} />
        <Pressable
          accessible={false}
          onPress={() => onChange(!checked)}
          style={styles.texts}
        >
          <Text variant="p2">{label}</Text>
          {description ? (
            <Text variant="p3" color="muted">
              {description}
            </Text>
          ) : null}
        </Pressable>
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
    gap: theme.gap(1.5),
  },
  texts: {
    flex: 1,
    gap: theme.gap(0.25),
  },
  error: {
    color: theme.colors.destructive,
  },
}));
