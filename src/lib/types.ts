export type BunutanEvent = {
  names: string[];
  eventName?: string;
  theme?: string;
  date?: string;
  budget?: number | null;
};

export type DrawResult = {
  order: number;
  drawn: string;
};

export type AppPhase =
  | "landing"
  | "wizard"
  | "mixing"
  | "drawing"
  | "summary";

export type AppState = {
  phase: AppPhase;
  wizardStep: number;
  event: BunutanEvent;
  drawSequence: string[];
  currentIndex: number;
  revealed: DrawResult[];
};

export const INITIAL_EVENT: BunutanEvent = {
  names: [],
  eventName: "",
  theme: "",
  date: "",
  budget: null,
};

export const INITIAL_STATE: AppState = {
  phase: "landing",
  wizardStep: 0,
  event: INITIAL_EVENT,
  drawSequence: [],
  currentIndex: 0,
  revealed: [],
};

export const WIZARD_STEPS = 5;
