/** Paper frame images and hold-driven snap sizing — viewBox 0 0 160 192 */

export const FRAME_IMAGES = [
  "/paper-frames/frame-0.png",
  "/paper-frames/frame-1.png",
  "/paper-frames/frame-2.png",
  "/paper-frames/frame-3.png",
  "/paper-frames/frame-4.png",
] as const;

export const HOLD_FULL_MS = 800;
export const HOLD_FRAME_MS = HOLD_FULL_MS / 5;
export const RELEASE_FULL_MS = 275;
export const RELEASE_FRAME_MS = 55;

/** Visual scale per frame — snaps to discrete sizes (% of full uncrumpled) */
export const FRAME_SCALES = [0.5, 0.6, 0.75, 0.9, 1] as const;

/** Subtle tilt per frame while holding */
export const FRAME_TILTS = [-8, -7, -6, -5, -4] as const;

export const CRUMPLED_SCALE = FRAME_SCALES[0];
export const FLAT_SCALE = FRAME_SCALES[4];

/** Map hold progress (0–1) to frame index 0–4 */
export function getFrameIndex(holdProgress: number): number {
  return Math.min(4, Math.floor(holdProgress * 5));
}

/** Snap scale to the current frame — no smooth interpolation */
export function getPaperScale(holdProgress: number): number {
  return FRAME_SCALES[getFrameIndex(holdProgress)];
}

export function getFrameTilt(frameIndex: number): number {
  return FRAME_TILTS[frameIndex] ?? FRAME_TILTS[0];
}

export function isPaperUnfolded(holdProgress: number): boolean {
  return holdProgress > 0;
}
