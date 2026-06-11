"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import { reducer, type Action } from "@/lib/reducer";
import { clearState, saveState } from "@/lib/storage";
import { INITIAL_STATE, type AppState } from "@/lib/types";

type BunutanContextValue = {
  state: AppState;
  dispatch: (action: Action) => void;
  startOver: () => void;
};

const BunutanContext = createContext<BunutanContextValue | null>(null);

export function BunutanProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    if (state.phase !== "landing") {
      saveState(state);
    } else {
      clearState();
    }
  }, [state]);

  const startOver = useCallback(() => {
    if (
      state.phase !== "landing" &&
      !window.confirm("Start over? All progress will be lost.")
    ) {
      return;
    }
    clearState();
    dispatch({ type: "START_OVER" });
  }, [state.phase]);

  return (
    <BunutanContext.Provider value={{ state, dispatch, startOver }}>
      {children}
    </BunutanContext.Provider>
  );
}

export function useBunutan() {
  const ctx = useContext(BunutanContext);
  if (!ctx) throw new Error("useBunutan must be used within BunutanProvider");
  return ctx;
}
