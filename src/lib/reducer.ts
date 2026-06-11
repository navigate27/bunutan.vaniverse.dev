import { buildDrawSequence } from "./draw-engine";
import type { AppState, BunutanEvent } from "./types";
import { INITIAL_STATE, WIZARD_STEPS } from "./types";

export type Action =
  | { type: "START_WIZARD" }
  | { type: "SET_WIZARD_STEP"; step: number }
  | { type: "UPDATE_EVENT"; patch: Partial<BunutanEvent> }
  | { type: "ADD_NAME"; name: string }
  | { type: "REMOVE_NAME"; index: number }
  | { type: "MOVE_NAME"; from: number; to: number }
  | { type: "START_DRAW" }
  | { type: "FINISH_MIX" }
  | { type: "SWIPE_LEFT" }
  | { type: "SWIPE_RIGHT" }
  | { type: "GO_TO_SUMMARY" }
  | { type: "START_OVER" }
  | { type: "RESTORE"; state: AppState };

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "START_WIZARD":
      return { ...state, phase: "wizard", wizardStep: 0 };

    case "SET_WIZARD_STEP":
      return {
        ...state,
        wizardStep: Math.max(0, Math.min(WIZARD_STEPS - 1, action.step)),
      };

    case "UPDATE_EVENT":
      return { ...state, event: { ...state.event, ...action.patch } };

    case "ADD_NAME": {
      const trimmed = action.name.trim();
      if (!trimmed) return state;
      const exists = state.event.names.some(
        (n) => n.toLowerCase() === trimmed.toLowerCase()
      );
      if (exists || state.event.names.length >= 50) return state;
      return {
        ...state,
        event: {
          ...state.event,
          names: [...state.event.names, trimmed],
        },
      };
    }

    case "REMOVE_NAME":
      return {
        ...state,
        event: {
          ...state.event,
          names: state.event.names.filter((_, i) => i !== action.index),
        },
      };

    case "MOVE_NAME": {
      const names = [...state.event.names];
      const [item] = names.splice(action.from, 1);
      names.splice(action.to, 0, item);
      return { ...state, event: { ...state.event, names } };
    }

    case "START_DRAW":
      return {
        ...state,
        phase: "mixing",
        drawSequence: [],
        currentIndex: 0,
        revealed: [],
      };

    case "FINISH_MIX":
      return {
        ...state,
        phase: "drawing",
        drawSequence: buildDrawSequence(state.event.names),
        currentIndex: 0,
        revealed: [],
      };

    case "SWIPE_LEFT": {
      if (state.currentIndex >= state.drawSequence.length) return state;
      const drawn = state.drawSequence[state.currentIndex];
      const newRevealed = [
        ...state.revealed,
        { order: state.currentIndex + 1, drawn },
      ];
      return {
        ...state,
        revealed: newRevealed,
        currentIndex: state.currentIndex + 1,
      };
    }

    case "SWIPE_RIGHT": {
      if (state.currentIndex <= 0) return state;
      return {
        ...state,
        currentIndex: state.currentIndex - 1,
        revealed: state.revealed.slice(0, -1),
      };
    }

    case "GO_TO_SUMMARY":
      return { ...state, phase: "summary" };

    case "START_OVER":
      return { ...INITIAL_STATE };

    case "RESTORE":
      return action.state;

    default:
      return state;
  }
}
