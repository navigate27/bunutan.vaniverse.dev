"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { WizardShell } from "./WizardShell";
import { useBunutan } from "@/context/BunutanProvider";

interface StepEventProps {
  step: number;
  onNext: () => void;
  onBack: () => void;
}

const THEMES = ["Christmas", "Birthday", "Generic", "Office Party"];

export function StepEvent({ step, onNext, onBack }: StepEventProps) {
  const { state, dispatch } = useBunutan();

  return (
    <WizardShell
      step={step}
      title="Event details"
      subtitle="Optional — give your bunutan a name and theme"
      footer={
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button onClick={onNext} className="flex-1">
            Next
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <Input
          id="event-name"
          label="Event name"
          placeholder="e.g. Team Christmas Bunutan"
          value={state.event.eventName ?? ""}
          onChange={(e) =>
            dispatch({ type: "UPDATE_EVENT", patch: { eventName: e.target.value } })
          }
        />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-foreground/80">Theme</span>
          <div className="flex flex-wrap gap-2">
            {THEMES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() =>
                  dispatch({ type: "UPDATE_EVENT", patch: { theme: t } })
                }
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold transition-all",
                  state.event.theme === t
                    ? "bg-purple text-white shadow-md"
                    : "bg-white/80 text-foreground/70 hover:bg-white",
                ].join(" ")}
              >
                {t}
              </button>
            ))}
          </div>
          <Input
            id="theme-custom"
            placeholder="Or type a custom theme"
            value={state.event.theme ?? ""}
            onChange={(e) =>
              dispatch({ type: "UPDATE_EVENT", patch: { theme: e.target.value } })
            }
          />
        </div>
      </div>
    </WizardShell>
  );
}
