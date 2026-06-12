"use client";

import { useMemo, useState } from "react";
import { formatDate } from "@/lib/format";
import {
  formatMonthYear,
  getMonthMatrix,
  getTodayIso,
  isSameIso,
  isToday,
  parseIsoDate,
} from "@/lib/date-utils";

interface DatePickerProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (iso: string) => void;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"] as const;

export function DatePicker({ id, label, value, onChange }: DatePickerProps) {
  const parsedValue = parseIsoDate(value);
  const today = useMemo(() => new Date(), []);
  const [viewMonth, setViewMonth] = useState(() => {
    if (parsedValue) {
      return { year: parsedValue.year, month: parsedValue.month };
    }
    return { year: today.getFullYear(), month: today.getMonth() };
  });

  const cells = getMonthMatrix(viewMonth.year, viewMonth.month);
  const monthLabel = formatMonthYear(viewMonth.year, viewMonth.month);

  const goToPrevMonth = () => {
    setViewMonth((current) => {
      if (current.month === 0) {
        return { year: current.year - 1, month: 11 };
      }
      return { year: current.year, month: current.month - 1 };
    });
  };

  const goToNextMonth = () => {
    setViewMonth((current) => {
      if (current.month === 11) {
        return { year: current.year + 1, month: 0 };
      }
      return { year: current.year, month: current.month + 1 };
    });
  };

  const selectToday = () => {
    const iso = getTodayIso();
    const now = new Date();
    setViewMonth({ year: now.getFullYear(), month: now.getMonth() });
    onChange(iso);
  };

  return (
    <div className="flex flex-col gap-3" id={id}>
      {label && (
        <span className="text-sm font-semibold text-foreground/80">{label}</span>
      )}

      {value && (
        <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
          <p className="font-display text-base font-bold text-coral">
            {formatDate(value)}
          </p>
        </div>
      )}

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={goToPrevMonth}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-lg font-bold text-foreground/70 transition-colors hover:bg-coral/10 hover:text-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/40"
            aria-label="Previous month"
          >
            ←
          </button>
          <p className="font-display text-base font-bold">{monthLabel}</p>
          <button
            type="button"
            onClick={goToNextMonth}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-lg font-bold text-foreground/70 transition-colors hover:bg-coral/10 hover:text-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/40"
            aria-label="Next month"
          >
            →
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1">
          {WEEKDAYS.map((day, index) => (
            <div
              key={`${day}-${index}`}
              className="flex min-h-8 items-center justify-center text-xs font-bold text-foreground/45"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1" role="grid" aria-label={monthLabel}>
          {cells.map((cell, index) => {
            if (!cell.iso) {
              return <div key={`empty-${index}`} role="gridcell" aria-hidden />;
            }

            const selected = isSameIso(cell.iso, value);
            const todayCell = isToday(cell.iso);

            return (
              <button
                key={cell.iso}
                type="button"
                role="gridcell"
                aria-selected={selected}
                aria-label={formatDate(cell.iso)}
                onClick={() => onChange(cell.iso!)}
                className={[
                  "flex min-h-11 items-center justify-center rounded-xl text-sm font-semibold transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/40",
                  selected
                    ? "bg-coral text-white shadow-sm"
                    : todayCell
                      ? "bg-coral/10 text-coral ring-2 ring-coral/30"
                      : "text-foreground/80 hover:bg-cream",
                ].join(" ")}
              >
                {cell.date!.getDate()}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={selectToday}
          className="mt-4 w-full rounded-full bg-coral/15 px-4 py-2.5 text-sm font-semibold text-coral transition-colors hover:bg-coral/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/40"
        >
          Today
        </button>
      </div>
    </div>
  );
}
