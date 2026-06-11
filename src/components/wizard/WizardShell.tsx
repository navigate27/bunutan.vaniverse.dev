"use client";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { WIZARD_STEPS } from "@/lib/types";
import { type ReactNode } from "react";

interface WizardShellProps {
  step: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer: ReactNode;
}

export function WizardShell({
  step,
  title,
  subtitle,
  children,
  footer,
}: WizardShellProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex-1 px-5 pb-28 pt-8">
        <ProgressBar current={step} total={WIZARD_STEPS} />
        <div className="mt-6 mb-6">
          <h2 className="font-display text-2xl font-bold text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-foreground/60">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
      <div className="fixed bottom-0 left-0 right-0 border-t border-white/40 bg-cream/90 px-5 py-4 backdrop-blur-md">
        {footer}
      </div>
    </div>
  );
}
