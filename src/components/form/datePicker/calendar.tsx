import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Button } from "@/components/button";
import { Text } from "@/components/text";

import {
  addMonths,
  buildCalendarDays,
  clampDate,
  isDateDisabled,
  isSameDay,
  startOfDay,
  startOfMonth,
} from "./utils";

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

interface ICalendarProps {
  value: Date | null;
  onSelect: (value: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

export function Calendar({
  value,
  onSelect,
  minimumDate,
  maximumDate,
}: ICalendarProps) {
  const { theme } = useUnistyles();
  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfMonth(clampDate(value ?? new Date(), minimumDate, maximumDate)),
  );

  const days = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth]);
  const monthLabel = useMemo(() => {
    const label = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(
      visibleMonth,
    );
    return `${label.charAt(0).toUpperCase()}${label.slice(1)} ${visibleMonth.getFullYear()}`;
  }, [visibleMonth]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.navGroup}>
          <Button
            variant="ghost"
            size="icon"
            onPress={() => setVisibleMonth((month) => addMonths(month, -12))}
          >
            <ChevronsLeft size={18} color={theme.colors.textForeground} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onPress={() => setVisibleMonth((month) => addMonths(month, -1))}
          >
            <ChevronLeft size={18} color={theme.colors.textForeground} />
          </Button>
        </View>

        <Text
          variant="p2"
          weight="semibold"
          align="center"
          style={styles.month}
        >
          {monthLabel}
        </Text>

        <View style={styles.navGroup}>
          <Button
            variant="ghost"
            size="icon"
            onPress={() => setVisibleMonth((month) => addMonths(month, 1))}
          >
            <ChevronRight size={18} color={theme.colors.textForeground} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onPress={() => setVisibleMonth((month) => addMonths(month, 12))}
          >
            <ChevronsRight size={18} color={theme.colors.textForeground} />
          </Button>
        </View>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAYS.map((label, index) => (
          <View key={`${label}-${index}`} style={styles.cell}>
            <Text variant="p3" color="muted">
              {label}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((day) => {
          const disabled = isDateDisabled(day.date, minimumDate, maximumDate);
          const selected = isSameDay(day.date, value);

          return (
            <View key={day.date.toISOString()} style={styles.cell}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected, disabled }}
                accessibilityLabel={`${day.date.getDate()}`}
                disabled={disabled}
                onPress={() => onSelect(startOfDay(day.date))}
                style={[
                  styles.day,
                  selected && styles.daySelected,
                  !day.isCurrentMonth && styles.dayOutside,
                  disabled && styles.dayDisabled,
                ]}
              >
                <Text
                  variant="p3"
                  style={selected ? styles.daySelectedText : undefined}
                >
                  {day.date.getDate()}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.gap(1),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.gap(1),
  },
  navGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  month: {
    flex: 1,
  },
  weekRow: {
    flexDirection: "row",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: "14.2857%",
    alignItems: "center",
    paddingVertical: theme.gap(0.25),
  },
  day: {
    width: theme.gap(4.5),
    height: theme.gap(4.5),
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  daySelected: {
    backgroundColor: theme.colors.brand,
  },
  daySelectedText: {
    color: theme.colors.brandForeground,
  },
  dayOutside: {
    opacity: 0.4,
  },
  dayDisabled: {
    opacity: 0.3,
  },
}));
