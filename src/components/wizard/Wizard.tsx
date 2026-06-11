"use client";

import { useCallback } from "react";
import { StepNames } from "./StepNames";
import { StepEvent } from "./StepEvent";
import { StepDate } from "./StepDate";
import { StepBudget } from "./StepBudget";
import { StepReview } from "./StepReview";
import { useBunutan } from "@/context/BunutanProvider";

export function Wizard() {
  const { state, dispatch } = useBunutan();
  const { wizardStep } = state;

  const next = useCallback(
    () => dispatch({ type: "SET_WIZARD_STEP", step: wizardStep + 1 }),
    [dispatch, wizardStep]
  );

  const back = useCallback(
    () => dispatch({ type: "SET_WIZARD_STEP", step: wizardStep - 1 }),
    [dispatch, wizardStep]
  );

  const startDraw = useCallback(
    () => dispatch({ type: "START_DRAW" }),
    [dispatch]
  );

  switch (wizardStep) {
    case 0:
      return <StepNames step={0} onNext={next} />;
    case 1:
      return <StepEvent step={1} onNext={next} onBack={back} />;
    case 2:
      return <StepDate step={2} onNext={next} onBack={back} />;
    case 3:
      return <StepBudget step={3} onNext={next} onBack={back} />;
    case 4:
      return (
        <StepReview step={4} onBack={back} onStartDraw={startDraw} />
      );
    default:
      return null;
  }
}
