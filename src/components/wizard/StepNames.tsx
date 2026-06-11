"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { WizardShell } from "./WizardShell";
import { useBunutan } from "@/context/BunutanProvider";

interface StepNamesProps {
  step: number;
  onNext: () => void;
}

const CHIP_COLORS = ["coral", "yellow", "mint", "purple"] as const;

export function StepNames({ step, onNext }: StepNamesProps) {
  const { state, dispatch } = useBunutan();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const addName = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError("Enter a name");
      return;
    }
    if (
      state.event.names.some((n) => n.toLowerCase() === trimmed.toLowerCase())
    ) {
      setError("Name already added");
      return;
    }
    dispatch({ type: "ADD_NAME", name: trimmed });
    setInput("");
    setError("");
  };

  const canNext = state.event.names.length >= 2;

  return (
    <WizardShell
      step={step}
      title="Who's joining?"
      subtitle="Add all the names that go into the hat"
      footer={
        <Button fullWidth disabled={!canNext} onClick={onNext}>
          Next
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Input
            id="name-input"
            placeholder="Enter a name"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && addName()}
            error={error}
            className="flex-1"
          />
          <Button onClick={addName} variant="secondary" className="shrink-0 px-5">
            Add
          </Button>
        </div>

        {state.event.names.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {state.event.names.map((name, i) => (
              <Chip
                key={`${name}-${i}`}
                label={name}
                index={i + 1}
                color={CHIP_COLORS[i % CHIP_COLORS.length]}
                onRemove={() => dispatch({ type: "REMOVE_NAME", index: i })}
              />
            ))}
          </div>
        )}

        <p className="text-sm text-foreground/50">
          {state.event.names.length} name
          {state.event.names.length !== 1 ? "s" : ""} added
          {state.event.names.length < 2 && " (minimum 2)"}
        </p>
      </div>
    </WizardShell>
  );
}
