"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PaperBox } from "./PaperBox";
import { Chip } from "@/components/ui/Chip";

interface MixAnimationProps {
  names: string[];
  onComplete: () => void;
}

const CHIP_COLORS = ["coral", "yellow", "mint", "purple"] as const;

export function MixAnimation({ names, onComplete }: MixAnimationProps) {
  const [phase, setPhase] = useState<"fly" | "shake" | "done">("fly");
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (phase === "fly") {
      const t = setTimeout(() => setPhase("shake"), names.length * 80 + 800);
      return () => clearTimeout(t);
    }
    if (phase === "shake") {
      const t = setTimeout(() => {
        setPhase("done");
        onComplete();
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [phase, names.length, onComplete]);

  const handleSkip = () => {
    if (skipped) return;
    setSkipped(true);
    setPhase("done");
    onComplete();
  };

  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center px-5"
      onClick={handleSkip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleSkip()}
      aria-label="Tap to skip animation"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 font-display text-2xl font-bold text-foreground"
      >
        {phase === "fly" ? "Gathering names…" : "Mixing it up! 🎲"}
      </motion.h2>

      <div className="relative mb-12 flex h-52 w-full max-w-sm items-end justify-center">
        <AnimatePresence>
          {phase === "fly" &&
            names.map((name, i) => (
              <motion.div
                key={name + i}
                initial={{
                  x: (i % 2 === 0 ? -1 : 1) * (60 + i * 15),
                  y: -120 - i * 10,
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: i * 0.08,
                  type: "spring",
                  stiffness: 120,
                  damping: 14,
                }}
                className="absolute"
                style={{ zIndex: i }}
              >
                <Chip
                  label={name}
                  color={CHIP_COLORS[i % CHIP_COLORS.length]}
                />
              </motion.div>
            ))}
        </AnimatePresence>

        {(phase === "shake" || phase === "done") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <PaperBox shaking={phase === "shake"} />
          </motion.div>
        )}
      </div>

      <motion.p
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-sm text-foreground/50"
      >
        Tap anywhere to skip
      </motion.p>
    </div>
  );
}
