import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-foreground/80">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={[
          "min-h-12 w-full rounded-2xl border-2 border-transparent bg-white px-4 text-base shadow-sm",
          "placeholder:text-foreground/40 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30",
          error ? "border-red-400" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
);

Input.displayName = "Input";
