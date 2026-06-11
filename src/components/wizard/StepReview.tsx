"use client";

import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { formatDate, formatPHP } from "@/lib/format";
import { WizardShell } from "./WizardShell";
import { useBunutan } from "@/context/BunutanProvider";

interface StepReviewProps {
  step: number;
  onBack: () => void;
  onStartDraw: () => void;
}

export function StepReview({ step, onBack, onStartDraw }: StepReviewProps) {
  const { state, dispatch } = useBunutan();
  const { event } = state;

  const moveUp = (index: number) => {
    if (index > 0) dispatch({ type: "MOVE_NAME", from: index, to: index - 1 });
  };

  const moveDown = (index: number) => {
    if (index < event.names.length - 1)
      dispatch({ type: "MOVE_NAME", from: index, to: index + 1 });
  };

  return (
    <WizardShell
      step={step}
      title="Review & start"
      subtitle="Double-check everything before the draw"
      footer={
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button onClick={onStartDraw} className="flex-1">
            Start draw 🎲
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
          <h3 className="mb-3 font-display text-lg font-bold">Event info</h3>
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

        <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
          <h3 className="mb-3 font-display text-lg font-bold">
            Names in order ({event.names.length})
          </h3>
          <ul className="space-y-2">
            {event.names.map((name, i) => (
              <li
                key={`${name}-${i}`}
                className="flex items-center justify-between gap-2"
              >
                <Chip label={name} index={i + 1} color="coral" />
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/5 text-sm disabled:opacity-30"
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(i)}
                    disabled={i === event.names.length - 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/5 text-sm disabled:opacity-30"
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </WizardShell>
  );
}
