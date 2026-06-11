"use client";

import { useCallback, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { MixAnimation } from "@/components/draw/MixAnimation";
import { DrawScreen } from "@/components/draw/DrawScreen";
import { HostSummary } from "@/components/summary/HostSummary";
import { Wizard } from "@/components/wizard/Wizard";
import { useBunutan } from "@/context/BunutanProvider";
import { loadState, clearState } from "@/lib/storage";
import type { AppState } from "@/lib/types";

function getPendingSession(): AppState | null {
  const saved = loadState();
  return saved && saved.phase !== "landing" ? saved : null;
}

function subscribeToStorage() {
  const handler = () => {};
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

function Landing() {
  const { dispatch } = useBunutan();
  const pending = useSyncExternalStore(
    subscribeToStorage,
    getPendingSession,
    () => null
  );

  const handleStart = () => {
    clearState();
    dispatch({ type: "START_WIZARD" });
  };

  const handleResume = () => {
    if (pending) dispatch({ type: "RESTORE", state: pending });
  };

  const handleFresh = () => {
    clearState();
    dispatch({ type: "START_WIZARD" });
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex max-w-sm flex-col items-center gap-6"
      >
        <motion.div
          animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="text-7xl"
        >
          🎁
        </motion.div>

        <div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground">
            Bunutan
          </h1>
          <p className="mt-2 text-base text-foreground/60">
            Draw names, reveal the magic. No sign-up, no email — just fun.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          {pending ? (
            <>
              <p className="text-sm font-semibold text-coral">
                You have an unfinished bunutan!
              </p>
              <Button fullWidth onClick={handleResume}>
                Resume
              </Button>
              <Button variant="ghost" fullWidth onClick={handleFresh}>
                Start fresh
              </Button>
            </>
          ) : (
            <Button fullWidth onClick={handleStart}>
              Start bunutan
            </Button>
          )}
        </div>

        <p className="text-xs text-foreground/40">
          Best when everyone&apos;s together 📱
        </p>
      </motion.div>
    </div>
  );
}

export function BunutanApp() {
  const { state, dispatch } = useBunutan();

  const handleMixComplete = useCallback(() => {
    dispatch({ type: "FINISH_MIX" });
  }, [dispatch]);

  switch (state.phase) {
    case "landing":
      return <Landing />;
    case "wizard":
      return <Wizard />;
    case "mixing":
      return (
        <MixAnimation
          names={state.event.names}
          onComplete={handleMixComplete}
        />
      );
    case "drawing":
      return <DrawScreen />;
    case "summary":
      return <HostSummary />;
    default:
      return <Landing />;
  }
}
