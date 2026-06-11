"use client";

import { useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FRAME_IMAGES,
  getFrameIndex,
  getFrameTilt,
  getPaperScale,
  HOLD_FRAME_MS,
  isPaperUnfolded,
  RELEASE_FRAME_MS,
} from "./paper-paths";

interface CrumpledPaperProps {
  name: string;
  visible: boolean;
  holding: boolean;
  holdProgress?: number;
  dragX?: number;
  slideDirection?: "left" | "right" | "none";
}

function PaperFrameImage({
  frameIndex,
  name,
  shadowId,
}: {
  frameIndex: number;
  name: string;
  shadowId: string;
}) {
  const showName = frameIndex === 4;

  return (
    <g filter={`url(#${shadowId})`}>
      <image
        href={FRAME_IMAGES[frameIndex]}
        x="0"
        y="0"
        width="160"
        height="192"
        preserveAspectRatio="xMidYMid meet"
      />
      {showName && (
        <text
          x="80"
          y="88"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#ff6b6b"
          style={{
            fontFamily: "var(--font-fredoka), sans-serif",
            fontSize: "22px",
            fontWeight: 700,
          }}
        >
          {name}
        </text>
      )}
    </g>
  );
}

export function CrumpledPaper({
  name,
  visible,
  holding,
  holdProgress = 0,
  dragX = 0,
  slideDirection = "none",
}: CrumpledPaperProps) {
  const shadowId = useId();

  if (!visible) return null;

  const slideX =
    slideDirection === "left" ? -360 : slideDirection === "right" ? 360 : dragX;

  const isSliding = slideDirection !== "none";
  const isUnfolded = isPaperUnfolded(holdProgress);
  const isActive = holding || isUnfolded;
  const frameIndex = getFrameIndex(holdProgress);
  const scale = getPaperScale(holdProgress);
  const tilt = getFrameTilt(frameIndex);
  const frameMs = holding ? HOLD_FRAME_MS : RELEASE_FRAME_MS;

  return (
    <motion.div
      initial={{ scale: 0.3, rotate: -20, opacity: 0, y: 60 }}
      animate={{
        scale,
        rotate: isActive ? tilt : -8,
        opacity: 1,
        y: 0,
        x: slideX,
      }}
      exit={{ scale: 0.3, opacity: 0, y: 40, x: slideX }}
      transition={
        isSliding
          ? { duration: 0.2, ease: "easeIn" }
          : isActive
            ? {
                scale: { duration: frameMs / 1000, ease: "linear" },
                rotate: { duration: frameMs / 1000, ease: "linear" },
              }
            : {
                scale: { duration: 0.2, ease: "easeOut" },
                rotate: { duration: 0.2, ease: "easeOut" },
              }
      }
      className={[
        "relative h-72 w-56 cursor-grab",
        holding ? "cursor-grabbing" : "",
      ].join(" ")}
      style={{ touchAction: "none", userSelect: "none" }}
    >
      <svg
        viewBox="0 0 160 192"
        className="h-full w-full overflow-visible"
        aria-hidden
      >
        <defs>
          <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="4"
              floodColor="#2d1f1a"
              floodOpacity="0.15"
            />
          </filter>
        </defs>

        <AnimatePresence mode="popLayout" initial={false}>
          <motion.g
            key={frameIndex}
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.05 }}
            style={{ transformOrigin: "80px 96px" }}
          >
            <PaperFrameImage
              frameIndex={frameIndex}
              name={name}
              shadowId={shadowId}
            />
          </motion.g>
        </AnimatePresence>
      </svg>

      {!isUnfolded && slideDirection === "none" && (
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute -bottom-10 left-1/2 w-max -translate-x-1/2 text-xs font-semibold text-foreground/50"
        ></motion.p>
      )}
    </motion.div>
  );
}
