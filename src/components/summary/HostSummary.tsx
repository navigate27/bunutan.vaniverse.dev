"use client";

import { Button } from "@/components/ui/Button";
import { PrintLayout } from "./PrintLayout";
import { formatDate, formatPHP } from "@/lib/format";
import { useBunutan } from "@/context/BunutanProvider";

export function HostSummary() {
  const { state, startOver } = useBunutan();
  const { event, drawSequence } = state;

  const rows = event.names.map((name, i) => ({
    num: i + 1,
    name,
    revealed: drawSequence[i] ?? "—",
  }));

  const handlePrint = () => window.print();

  return (
    <div className="min-h-dvh px-5 py-8">
      <div className="mx-auto max-w-lg">
        <h2 className="mb-1 font-display text-2xl font-bold">Summary 🎉</h2>
        <p className="mb-6 text-sm text-foreground/60">
          Full host view — matched by number
        </p>

        <div className="mb-6 rounded-2xl bg-white/80 p-4 shadow-sm">
          <dl className="space-y-2 text-sm">
            {event.eventName && (
              <div className="flex justify-between">
                <dt className="text-foreground/60">Event</dt>
                <dd className="font-semibold">{event.eventName}</dd>
              </div>
            )}
            {event.theme && (
              <div className="flex justify-between">
                <dt className="text-foreground/60">Theme</dt>
                <dd className="font-semibold">{event.theme}</dd>
              </div>
            )}
            {event.date && (
              <div className="flex justify-between">
                <dt className="text-foreground/60">Date</dt>
                <dd className="font-semibold">{formatDate(event.date)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-foreground/60">Budget</dt>
              <dd className="font-semibold">
                {event.budget === null
                  ? "No limit"
                  : formatPHP(event.budget ?? 0)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white/80 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-foreground/10 bg-coral/10">
                <th className="px-4 py-3 text-left font-bold">#</th>
                <th className="px-4 py-3 text-left font-bold">
                  Names (in order)
                </th>
                <th className="px-4 py-3 text-left font-bold">
                  Revealed (in order)
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.num}
                  className="border-b border-foreground/5 last:border-0"
                >
                  <td className="px-4 py-3 font-bold text-coral">{row.num}</td>
                  <td className="px-4 py-3">{row.name}</td>
                  <td className="px-4 py-3 font-semibold text-purple">
                    {row.revealed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Button fullWidth onClick={handlePrint}>
            Print summary
          </Button>
          <Button variant="ghost" fullWidth onClick={startOver}>
            Start over
          </Button>
        </div>
      </div>

      <PrintLayout event={event} drawSequence={drawSequence} />
    </div>
  );
}
