import { formatDate, formatGeneratedDate, formatPHP } from "@/lib/format";
import type { BunutanEvent } from "@/lib/types";

interface PrintLayoutProps {
  event: BunutanEvent;
  drawSequence: string[];
}

export function PrintLayout({ event, drawSequence }: PrintLayoutProps) {
  const rows = event.names.map((name, i) => ({
    num: i + 1,
    name,
    revealed: drawSequence[i] ?? "—",
  }));

  return (
    <div className="print-area hidden">
      <div className="p-8 font-sans text-black">
        <h1 className="mb-2 text-2xl font-bold">Bunutan Summary</h1>
        <p className="mb-6 text-sm text-gray-600">
          Generated {formatGeneratedDate()}
        </p>

        <div className="mb-6 space-y-1 text-sm">
          {event.eventName && (
            <p>
              <strong>Event:</strong> {event.eventName}
            </p>
          )}
          {event.theme && (
            <p>
              <strong>Theme:</strong> {event.theme}
            </p>
          )}
          {event.date && (
            <p>
              <strong>Date:</strong> {formatDate(event.date)}
            </p>
          )}
          <p>
            <strong>Budget:</strong>{" "}
            {event.budget === null
              ? "No limit"
              : formatPHP(event.budget ?? 0)}
          </p>
        </div>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="py-2 pr-4 text-left">#</th>
              <th className="py-2 pr-4 text-left">Names (in order)</th>
              <th className="py-2 text-left">Revealed (in order)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.num} className="border-b border-gray-300">
                <td className="py-2 pr-4">{row.num}</td>
                <td className="py-2 pr-4">{row.name}</td>
                <td className="py-2">{row.revealed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
