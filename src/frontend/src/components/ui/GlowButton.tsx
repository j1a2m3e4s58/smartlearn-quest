import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { forwardRef } from "react";

export type GlowButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface GlowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: GlowButtonVariant;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
}

const VARIANT_CLASSES: Record<GlowButtonVariant, string> = {
  primary:
    "bg-transparent border-2 border-[#00f5ff] text-[#00f5ff] hover:bg-[#00f5ff]/10 shadow-glow-cyan",
  secondary:
    "bg-transparent border-2 border-[#7c3aed] text-[#7c3aed] hover:bg-[#7c3aed]/10 shadow-glow-purple",
  danger:
    "bg-transparent border-2 border-destructive text-destructive hover:bg-destructive/10",
  ghost:
    "bg-transparent border border-border/40 text-muted-foreground hover:text-foreground hover:border-border",
};

const SIZE_CLASSES = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
  (
    {
      variant = "primary",
      loading = false,
      size = "md",
      className = "",
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        whileHover={isDisabled ? undefined : { scale: 1.02 }}
        whileTap={isDisabled ? undefined : { scale: 0.97 }}
        type="button"
        disabled={isDisabled}
        className={[
          "relative inline-flex items-center justify-center gap-2 rounded-lg font-bold tracking-wider uppercase transition-smooth",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          className,
        ].join(" ")}
        {...(props as Record<string, unknown>)}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  },
);

GlowButton.displayName = "GlowButton";
