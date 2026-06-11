interface ChipProps {
  label: string;
  index?: number;
  onRemove?: () => void;
  color?: "coral" | "yellow" | "mint" | "purple";
}

const colors = {
  coral: "bg-coral/20 text-coral border-coral/30",
  yellow: "bg-yellow/30 text-yellow-dark border-yellow/50",
  mint: "bg-mint/30 text-mint-dark border-mint/50",
  purple: "bg-purple/20 text-purple border-purple/30",
};

export function Chip({ label, index, onRemove, color = "coral" }: ChipProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold",
        colors[color],
      ].join(" ")}
    >
      {index !== undefined && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/60 text-xs font-bold">
          {index}
        </span>
      )}
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-xs hover:bg-black/20"
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
