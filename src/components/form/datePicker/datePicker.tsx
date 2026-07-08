import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { CalendarDays } from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { Text } from "@/components/text";

import { Input } from "../input";
import { Calendar } from "./calendar";
import {
  type DateMode,
  formatValue,
  isDateDisabled,
  maskDateDraft,
  mergeTime,
  parseDateInput,
  toDateInput,
} from "./utils";

export type { DateMode };

export interface IDatePickerProps {
  value: Date | null;
  onChange: (value: Date) => void;
  mode?: DateMode;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
}

export function DatePicker({ mode = "date", ...props }: IDatePickerProps) {
  if (mode === "date") {
    return <DateInput {...props} />;
  }
  return <NativeDateTimeInput mode={mode} {...props} />;
}

type DateInputProps = Omit<IDatePickerProps, "mode">;

function DateInput({
  value,
  onChange,
  placeholder = "DD/MM/AAAA",
  disabled = false,
  hasError = false,
  minimumDate,
  maximumDate,
}: DateInputProps) {
  const { theme } = useUnistyles();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(() => toDateInput(value));

  // Sincroniza o texto quando o valor muda por fora (ex.: calendário, reset do
  // form) ajustando o estado no render — padrão do React em vez de useEffect.
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    setDraft(toDateInput(value));
  }

  function handleChangeText(raw: string) {
    const masked = maskDateDraft(raw);
    setDraft(masked);

    const parsed = parseDateInput(masked, value);
    if (parsed && !isDateDisabled(parsed, minimumDate, maximumDate)) {
      onChange(parsed);
    }
  }

  function handleSelectFromCalendar(date: Date) {
    onChange(date);
    setIsOpen(false);
  }

  return (
    <View style={styles.wrapper}>
      <Input
        value={draft}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        keyboardType="number-pad"
        maxLength={10}
        editable={!disabled}
        hasError={hasError}
        style={styles.input}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Abrir calendário"
        disabled={disabled}
        hitSlop={8}
        onPress={() => setIsOpen(true)}
        style={styles.iconButton}
      >
        <CalendarDays size={18} color={theme.colors.textMuted} />
      </Pressable>

      <Modal
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        title="Selecionar data"
      >
        <Calendar
          value={value}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onSelect={handleSelectFromCalendar}
        />
      </Modal>
    </View>
  );
}

type NativeDateTimeInputProps = Omit<IDatePickerProps, "mode"> & {
  mode: DateMode;
};

function NativeDateTimeInput({
  value,
  onChange,
  mode,
  placeholder = "Selecionar",
  disabled = false,
  hasError = false,
  minimumDate,
  maximumDate,
}: NativeDateTimeInputProps) {
  const { theme } = useUnistyles();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<Date>(value ?? new Date());
  styles.useVariants({ error: hasError, disabled });

  function openAndroid() {
    DateTimePickerAndroid.open({
      value: value ?? new Date(),
      mode: mode === "datetime" ? "date" : mode,
      is24Hour: true,
      minimumDate,
      maximumDate,
      onValueChange: (_event, selected) => {
        if (mode !== "datetime") {
          onChange(selected);
          return;
        }
        DateTimePickerAndroid.open({
          value: selected,
          mode: "time",
          is24Hour: true,
          onValueChange: (_timeEvent, selectedTime) => {
            onChange(mergeTime(selected, selectedTime));
          },
        });
      },
    });
  }

  function handleOpen() {
    if (disabled) return;
    if (Platform.OS === "android") {
      openAndroid();
      return;
    }
    setDraft(value ?? new Date());
    setIsOpen(true);
  }

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={handleOpen}
        style={styles.trigger}
      >
        <Text
          variant="p2"
          color={value ? "default" : "muted"}
          style={styles.triggerText}
        >
          {value ? formatValue(value, mode) : placeholder}
        </Text>
        <CalendarDays size={18} color={theme.colors.textMuted} />
      </Pressable>

      {Platform.OS === "ios" ? (
        <Modal
          visible={isOpen}
          onClose={() => setIsOpen(false)}
          title={placeholder}
        >
          <View style={styles.iosPicker}>
            <DateTimePicker
              value={draft}
              mode={mode}
              display="spinner"
              is24Hour
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              onValueChange={(_event, selected) => setDraft(selected)}
            />
          </View>
          <Button
            onPress={() => {
              onChange(draft);
              setIsOpen(false);
            }}
          >
            Confirmar
          </Button>
        </Modal>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  wrapper: {
    justifyContent: "center",
  },
  input: {
    paddingRight: theme.gap(5.5),
  },
  iconButton: {
    position: "absolute",
    right: theme.gap(1.5),
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  trigger: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.gap(1),
    borderRadius: theme.gap(1.25),
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.gap(1.5),
    variants: {
      error: {
        true: { borderColor: theme.colors.destructive },
      },
      disabled: {
        true: { opacity: 0.5 },
      },
    },
  },
  triggerText: {
    flex: 1,
  },
  iosPicker: {
    alignItems: "center",
  },
}));
