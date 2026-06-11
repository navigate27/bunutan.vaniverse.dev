"use client";

import { motion } from "motion/react";

interface PaperBoxProps {
  shaking?: boolean;
  bump?: boolean;
  className?: string;
  children?: React.ReactNode;
  onTap?: () => void;
  showPrompt?: boolean;
  disabled?: boolean;
}

export function PaperBox({
  shaking = false,
  bump = false,
  className = "",
  children,
  onTap,
  showPrompt = false,
  disabled = false,
}: PaperBoxProps) {
  const interactive = !!onTap && !disabled;

  const boxContent = (
    <>
      <div className="absolute inset-2 rounded-2xl border-2 border-dashed border-white/40" />
      {showPrompt && (
        <motion.span
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="relative z-10 text-sm font-bold text-white drop-shadow-sm"
        >
          Tap to draw
        </motion.span>
      )}
      {children}
      <span className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-coral px-3 py-0.5 text-xs font-bold text-white shadow">
        Bunutan Box
      </span>
    </>
  );

  const motionProps = {
    animate: shaking
      ? {
          x: [0, -8, 8, -6, 6, -4, 4, 0],
          rotate: [0, -2, 2, -1.5, 1.5, -1, 1, 0],
          scale: 1,
        }
      : bump
        ? { x: 0, rotate: 0, scale: [1, 1.05, 1] }
        : { x: 0, rotate: 0, scale: 1 },
    transition: shaking
      ? { duration: 0.6, repeat: 2, ease: "easeInOut" as const }
      : bump
        ? { duration: 0.35, ease: "easeOut" as const }
        : { duration: 0.3 },
  };

  const classNames = [
    "relative flex h-40 w-full max-w-xs items-center justify-center rounded-3xl",
    "bg-gradient-to-br from-yellow to-peach shadow-lg",
    "border-4 border-yellow-dark/30",
    interactive ? "cursor-pointer active:scale-[0.98] transition-transform" : "",
    disabled ? "opacity-90" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (interactive) {
    return (
      <motion.button
        type="button"
        onClick={onTap}
        aria-label="Tap to draw"
        {...motionProps}
        className={classNames}
      >
        {boxContent}
      </motion.button>
    );
  }

  return (
    <motion.div {...motionProps} className={classNames}>
      {boxContent}
    </motion.div>
  );
}
