"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/Button";
import { CrumpledPaper } from "./CrumpledPaper";
import { PaperBox } from "./PaperBox";
import { useBunutan } from "@/context/BunutanProvider";
import { usePaperGesture } from "@/hooks/usePaperGesture";

export function DrawScreen() {
  const { state, dispatch } = useBunutan();
  const { drawSequence, currentIndex, event } = state;
  const total = drawSequence.length;
  const isLast = currentIndex >= total - 1;
  const isComplete = currentIndex >= total;

  const [paperVisible, setPaperVisible] = useState(false);
  const [holding, setHolding] = useState(false);
  const [hasHeldCurrent, setHasHeldCurrent] = useState(false);
  const hasHeldRef = useRef(false);
  const resetTrackingRef = useRef<() => void>(() => {});
  const [boxBump, setBoxBump] = useState(false);
  const [slideDirection, setSlideDirection] = useState<
    "left" | "right" | "none"
  >("none");

  const currentDrawnName = drawSequence[currentIndex] ?? "";
  const currentParticipant = event.names[currentIndex] ?? "";

  const resetPaper = useCallback(() => {
    setPaperVisible(false);
    setHolding(false);
    setHasHeldCurrent(false);
    hasHeldRef.current = false;
    setSlideDirection("none");
    resetTrackingRef.current();
  }, []);

  const handleHoldChange = useCallback(
    (isHolding: boolean) => {
      if (!paperVisible) return;
      setHolding(isHolding);
      if (isHolding) {
        hasHeldRef.current = true;
        setHasHeldCurrent(true);
      }
    },
    [paperVisible]
  );

  const handleSwipeLeft = useCallback(() => {
    if (!paperVisible || !hasHeldRef.current || isComplete) return;
    setSlideDirection("left");
    setTimeout(() => {
      dispatch({ type: "SWIPE_LEFT" });
      resetPaper();
    }, 200);
  }, [paperVisible, isComplete, dispatch, resetPaper]);

  const handleSwipeRight = useCallback(() => {
    if (currentIndex <= 0 || !paperVisible) return;
    setSlideDirection("right");
    setTimeout(() => {
      dispatch({ type: "SWIPE_RIGHT" });
      resetPaper();
    }, 200);
  }, [currentIndex, paperVisible, dispatch, resetPaper]);

  const gesture = usePaperGesture({
    enabled: paperVisible,
    canSwipeLeft: paperVisible && !isComplete,
    canSwipeRight: paperVisible && currentIndex > 0,
    onHoldChange: handleHoldChange,
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
  });

  useEffect(() => {
    resetTrackingRef.current = gesture.resetTracking;
  }, [gesture.resetTracking]);

  const handleTap = () => {
    if (isComplete || paperVisible) return;
    setBoxBump(true);
    setTimeout(() => setBoxBump(false), 400);
    setPaperVisible(true);
  };

  const handleEnd = () => {
    dispatch({ type: "GO_TO_SUMMARY" });
  };

  if (isComplete) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-5">
        <p className="font-display text-2xl font-bold">All draws complete!</p>
        <Button onClick={handleEnd} fullWidth className="max-w-xs">
          View summary
        </Button>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-dvh flex-col items-center px-5 pt-10"
      style={{ touchAction: "manipulation", userSelect: "none" }}
    >
      <div className="mb-2 text-center">
        <p className="text-sm font-semibold text-foreground/50">Bunutan</p>
        <h2 className="font-display text-2xl font-bold">
          Draw {currentIndex + 1} of {total}
        </h2>
        {currentParticipant && (
          <p className="mt-1 font-display text-lg font-semibold text-coral">
            {currentParticipant}&apos;s turn
          </p>
        )}
      </div>

      <div className="relative flex flex-1 w-full max-w-sm flex-col items-center justify-center">
        <div className="relative flex min-h-96 w-full flex-col items-center justify-end pb-4">
          <div
            className="absolute bottom-52 left-1/2 z-10 -translate-x-1/2"
            {...(paperVisible ? gesture.handlers : {})}
            tabIndex={paperVisible ? 0 : -1}
            role={paperVisible ? "button" : undefined}
            aria-label={
              paperVisible
                ? "Hold to reveal, release and swipe to navigate"
                : undefined
            }
          >
            <AnimatePresence mode="wait">
              {paperVisible && (
                <CrumpledPaper
                  key={currentIndex}
                  name={currentDrawnName}
                  visible={paperVisible}
                  holding={holding}
                  holdProgress={gesture.holdProgress}
                  dragX={gesture.dragX}
                  slideDirection={slideDirection}
                />
              )}
            </AnimatePresence>
          </div>

          <PaperBox
            bump={boxBump}
            showPrompt={!paperVisible}
            onTap={handleTap}
            disabled={paperVisible}
          />
        </div>

        {paperVisible && (
          <div className="mt-4 flex flex-col items-center gap-2 text-center">
            <p className="text-xs text-foreground/40">
              Hold to reveal · release and swipe to continue
            </p>
            {currentIndex > 0 && (
              <p className="text-xs font-semibold text-purple">
                Swipe right to go back
              </p>
            )}
          </div>
        )}
      </div>

      {paperVisible && isLast && hasHeldCurrent && (
        <div className="pb-8 w-full max-w-xs">
          <Button variant="secondary" fullWidth onClick={handleEnd}>
            End & view summary
          </Button>
        </div>
      )}
    </div>
  );
}
