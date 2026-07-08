export type DateMode = "date" | "time" | "datetime";

export interface ICalendarDay {
  date: Date;
  isCurrentMonth: boolean;
}

export function formatValue(value: Date, mode: DateMode): string {
  const dateParts: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  const timeParts: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };
  const options =
    mode === "time"
      ? timeParts
      : mode === "datetime"
        ? { ...dateParts, ...timeParts }
        : dateParts;

  return new Intl.DateTimeFormat("pt-BR", options).format(value);
}

/** Date → "DD/MM/AAAA" para o input digitável. */
export function toDateInput(value: Date | null): string {
  if (!value) return "";
  const day = `${value.getDate()}`.padStart(2, "0");
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  return `${day}/${month}/${value.getFullYear()}`;
}

/** Aplica a máscara DD/MM/AAAA enquanto o usuário digita. */
export function maskDateDraft(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/** "DD/MM/AAAA" → Date válida, ou null se incompleta/inválida. */
export function parseDateInput(raw: string, current: Date | null): Date | null {
  const match = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const [, dayText, monthText, yearText] = match;
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);
  if (month < 1 || month > 12) return null;

  const next = current ? new Date(current) : new Date();
  next.setFullYear(year, month - 1, day);
  next.setSeconds(0, 0);

  // Rejeita datas que "estouram" (ex.: 31/02 vira 03/03).
  if (
    next.getFullYear() !== year ||
    next.getMonth() !== month - 1 ||
    next.getDate() !== day
  ) {
    return null;
  }

  return next;
}

export function mergeTime(base: Date, time: Date): Date {
  const next = new Date(base);
  next.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return next;
}

export function startOfDay(value: Date): Date {
  const next = new Date(value);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function startOfMonth(value: Date): Date {
  const next = new Date(value);
  next.setDate(1);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function addMonths(value: Date, amount: number): Date {
  const next = new Date(value);
  next.setMonth(next.getMonth() + amount, 1);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function isSameDay(left: Date | null, right: Date | null): boolean {
  if (!left || !right) return false;
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function isDateDisabled(
  value: Date,
  minimumDate?: Date,
  maximumDate?: Date,
): boolean {
  const time = startOfDay(value).getTime();
  if (minimumDate && time < startOfDay(minimumDate).getTime()) return true;
  if (maximumDate && time > startOfDay(maximumDate).getTime()) return true;
  return false;
}

export function clampDate(
  value: Date,
  minimumDate?: Date,
  maximumDate?: Date,
): Date {
  if (minimumDate && startOfDay(value) < startOfDay(minimumDate)) {
    return startOfDay(minimumDate);
  }
  if (maximumDate && startOfDay(value) > startOfDay(maximumDate)) {
    return startOfDay(maximumDate);
  }
  return value;
}

export function buildCalendarDays(month: Date): ICalendarDay[] {
  const currentMonth = startOfMonth(month);
  const startWeekday = currentMonth.getDay();
  const gridStart = new Date(currentMonth);
  gridStart.setDate(currentMonth.getDate() - startWeekday);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return {
      date,
      isCurrentMonth: date.getMonth() === currentMonth.getMonth(),
    };
  });
}
