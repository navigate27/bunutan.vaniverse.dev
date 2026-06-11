"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  HOLD_FULL_MS,
  RELEASE_FULL_MS,
} from "@/components/draw/paper-paths";

const SWIPE_THRESHOLD = 80;
const DRAG_CLAMP = 120;

interface UsePaperGestureOptions {
  enabled: boolean;
  canSwipeLeft: boolean;
  canSwipeRight: boolean;
  onHoldChange: (holding: boolean) => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export function usePaperGesture({
  enabled,
  canSwipeLeft,
  canSwipeRight,
  onHoldChange,
  onSwipeLeft,
  onSwipeRight,
}: UsePaperGestureOptions) {
  const startX = useRef(0);
  const startY = useRef(0);
  const swipedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const holdProgressRef = useRef(0);
  const keyHoldingRef = useRef(false);
  const [dragX, setDragX] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0);

  const setProgress = useCallback((value: number) => {
    holdProgressRef.current = value;
    setHoldProgress(value);
  }, []);

  const stopAnimation = useCallback(
    (resetProgress: boolean) => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (resetProgress) {
        setProgress(0);
      }
    },
    [setProgress]
  );

  const startHoldLoop = useCallback(() => {
    stopAnimation(false);
    setProgress(0);
    const start = performance.now();
    const tick = () => {
      const elapsed = performance.now() - start;
      const progress = Math.min(elapsed / HOLD_FULL_MS, 1);
      setProgress(progress);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [setProgress, stopAnimation]);

  const startCrumpleLoop = useCallback(
    (fromProgress: number) => {
      stopAnimation(false);
      const duration = RELEASE_FULL_MS * fromProgress;
      const start = performance.now();
      const tick = () => {
        const elapsed = performance.now() - start;
        const t = Math.min(elapsed / duration, 1);
        const progress = fromProgress * (1 - t);
        setProgress(progress);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setProgress(0);
          rafRef.current = null;
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [setProgress, stopAnimation]
  );

  useEffect(() => () => stopAnimation(true), [stopAnimation]);

  const resetTracking = useCallback(() => {
    swipedRef.current = false;
    setDragX(0);
    stopAnimation(true);
  }, [stopAnimation]);

  const endHoldInstant = useCallback(() => {
    keyHoldingRef.current = false;
    stopAnimation(true);
    onHoldChange(false);
    setDragX(0);
  }, [onHoldChange, stopAnimation]);

  const endHold = useCallback(() => {
    keyHoldingRef.current = false;
    stopAnimation(false);
    onHoldChange(false);
    setDragX(0);
    const fromProgress = holdProgressRef.current;
    if (fromProgress > 0) {
      startCrumpleLoop(fromProgress);
    }
  }, [onHoldChange, startCrumpleLoop, stopAnimation]);

  const trySwipe = useCallback(
    (dx: number, dy: number) => {
      if (swipedRef.current) return false;
      if (Math.abs(dx) < SWIPE_THRESHOLD) return false;
      if (Math.abs(dy) > Math.abs(dx)) return false;

      if (dx < 0 && canSwipeLeft) {
        swipedRef.current = true;
        endHoldInstant();
        onSwipeLeft();
        return true;
      }
      if (dx > 0 && canSwipeRight) {
        swipedRef.current = true;
        endHoldInstant();
        onSwipeRight();
        return true;
      }
      return false;
    },
    [canSwipeLeft, canSwipeRight, endHoldInstant, onSwipeLeft, onSwipeRight]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      startX.current = e.clientX;
      startY.current = e.clientY;
      swipedRef.current = false;
      setDragX(0);
      stopAnimation(true);
      onHoldChange(true);
      startHoldLoop();
    },
    [enabled, onHoldChange, startHoldLoop, stopAnimation]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled || swipedRef.current) return;
      const dx = e.clientX - startX.current;
      const dy = e.clientY - startY.current;

      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        const clamped = Math.max(-DRAG_CLAMP, Math.min(DRAG_CLAMP, dx));
        setDragX(clamped);
      }
    },
    [enabled]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled) return;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }

      if (!swipedRef.current) {
        const dx = e.clientX - startX.current;
        const dy = e.clientY - startY.current;
        trySwipe(dx, dy);
      }

      if (!swipedRef.current) {
        endHold();
      }
    },
    [enabled, endHold, trySwipe]
  );

  const onPointerCancel = useCallback(() => {
    if (!swipedRef.current) {
      endHold();
    } else {
      resetTracking();
    }
  }, [endHold, resetTracking]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!enabled) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        keyHoldingRef.current = true;
        stopAnimation(true);
        onHoldChange(true);
        startHoldLoop();
      }
      if (e.key === "ArrowLeft" && canSwipeLeft && !keyHoldingRef.current) {
        e.preventDefault();
        endHoldInstant();
        onSwipeLeft();
      }
      if (e.key === "ArrowRight" && canSwipeRight && !keyHoldingRef.current) {
        e.preventDefault();
        endHoldInstant();
        onSwipeRight();
      }
    },
    [
      enabled,
      canSwipeLeft,
      canSwipeRight,
      endHoldInstant,
      onHoldChange,
      onSwipeLeft,
      onSwipeRight,
      startHoldLoop,
      stopAnimation,
    ]
  );

  const onKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        endHold();
      }
    },
    [endHold]
  );

  return {
    dragX,
    holdProgress,
    resetTracking,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onKeyDown,
      onKeyUp,
    },
  };
}
