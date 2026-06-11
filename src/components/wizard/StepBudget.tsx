"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPHP } from "@/lib/format";
import { WizardShell } from "./WizardShell";
import { useBunutan } from "@/context/BunutanProvider";

interface StepBudgetProps {
  step: number;
  onNext: () => void;
  onBack: () => void;
}

export function StepBudget({ step, onNext, onBack }: StepBudgetProps) {
  const { state, dispatch } = useBunutan();
  const noLimit = state.event.budget === null;

  return (
    <WizardShell
      step={step}
      title="Gift budget"
      subtitle="Set a budget in Philippine Peso (optional)"
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
      <div className="flex flex-col gap-4">
        <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-white/80 px-4 py-3">
          <input
            type="checkbox"
            checked={noLimit}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_EVENT",
                patch: { budget: e.target.checked ? null : 500 },
              })
            }
            className="h-5 w-5 accent-coral"
          />
          <span className="font-semibold">No budget limit</span>
        </label>

        {!noLimit && (
          <div className="flex flex-col gap-2">
            <Input
              id="budget"
              label="Budget amount"
              type="number"
              min={0}
              placeholder="500"
              value={state.event.budget ?? ""}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_EVENT",
                  patch: { budget: Number(e.target.value) || 0 },
                })
              }
            />
            {typeof state.event.budget === "number" && state.event.budget > 0 && (
              <p className="text-sm font-semibold text-coral">
                {formatPHP(state.event.budget)}
              </p>
            )}
          </div>
        )}
      </div>
    </WizardShell>
  );
}
