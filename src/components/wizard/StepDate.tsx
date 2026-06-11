"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { WizardShell } from "./WizardShell";
import { useBunutan } from "@/context/BunutanProvider";

interface StepDateProps {
  step: number;
  onNext: () => void;
  onBack: () => void;
}

export function StepDate({ step, onNext, onBack }: StepDateProps) {
  const { state, dispatch } = useBunutan();

  return (
    <WizardShell
      step={step}
      title="When is it?"
      subtitle="Pick the date for your bunutan event"
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
      <Input
        id="event-date"
        label="Event date"
        type="date"
        value={state.event.date ?? ""}
        onChange={(e) =>
          dispatch({ type: "UPDATE_EVENT", patch: { date: e.target.value } })
        }
      />
    </WizardShell>
  );
}
