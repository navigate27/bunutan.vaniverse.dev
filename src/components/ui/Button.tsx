import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-coral to-peach text-white shadow-md hover:shadow-lg active:scale-[0.98]",
  secondary:
    "bg-mint text-foreground shadow-sm hover:bg-mint/80 active:scale-[0.98]",
  ghost:
    "bg-transparent text-foreground hover:bg-black/5 active:scale-[0.98]",
  danger:
    "bg-red-400 text-white hover:bg-red-500 active:scale-[0.98]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      fullWidth = false,
      className = "",
      disabled,
      children,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled}
      className={[
        "inline-flex min-h-12 items-center justify-center rounded-2xl px-6 py-3 text-base font-semibold transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-40",
        variants[variant],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";
