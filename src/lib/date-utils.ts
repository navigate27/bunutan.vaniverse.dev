export type ParsedIsoDate = {
  year: number;
  month: number;
  day: number;
};

export type CalendarCell = {
  date: Date | null;
  iso: string | null;
};

export function toIsoDate(year: number, month: number, day: number): string {
  const y = String(year);
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseIsoDate(iso: string): ParsedIsoDate | null {
  if (!iso) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

export function isSameIso(a: string, b: string): boolean {
  return a !== "" && b !== "" && a === b;
}

export function isToday(iso: string): boolean {
  const parsed = parseIsoDate(iso);
  if (!parsed) return false;
  const today = new Date();
  return (
    parsed.year === today.getFullYear() &&
    parsed.month === today.getMonth() &&
    parsed.day === today.getDate()
  );
}

export function getTodayIso(): string {
  const today = new Date();
  return toIsoDate(today.getFullYear(), today.getMonth(), today.getDate());
}

export function getMonthMatrix(year: number, month: number): CalendarCell[] {
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: CalendarCell[] = [];

  for (let i = 0; i < startOffset; i++) {
    cells.push({ date: null, iso: null });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    cells.push({ date, iso: toIsoDate(year, month, day) });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ date: null, iso: null });
  }

  while (cells.length < 42) {
    cells.push({ date: null, iso: null });
  }

  return cells;
}

export function formatMonthYear(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric",
  });
}
