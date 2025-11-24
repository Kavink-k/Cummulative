
import { cn } from "@/lib/utils";

type StepProgressBarSize = "sm" | "md" | "lg";

interface StepProgressBarProps {
  /** Percentage between 0–100 */
  progress: number;
  /** Style the bar as “active/current” */
  isCurrent?: boolean;
  /** Style the bar as “completed” when == 100% */
  isCompleted?: boolean;
  /** Show a small percentage label to the right */
  showLabel?: boolean;
  /** Height preset */
  size?: StepProgressBarSize;
  /** Accessible label for screen readers */
  ariaLabel?: string;
}

const sizeClass: Record<StepProgressBarSize, string> = {
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
};

export const StepProgressBar = ({
  progress,
  isCurrent = false,
  isCompleted = false,
  showLabel = false,
  size = "md",
  ariaLabel = "Step progress",
}: StepProgressBarProps) => {
  const clamped = Math.max(0, Math.min(100, progress));
  const isInProgress = clamped > 0 && clamped < 100 && !isCurrent && !isCompleted;

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "w-full rounded-full overflow-hidden bg-muted shadow-inner",
          sizeClass[size]
        )}
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clamped)}
      >
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out rounded-full",
            isCompleted
              ? "bg-green-500"
              : isCurrent
              ? "bg-primary"
              : isInProgress
              ? "bg-amber-500"
              : "bg-muted-foreground/40"
          )}
          style={{ width: `${clamped}%`, opacity: clamped > 0 ? 1 : 0.3 }}
        />
      </div>

      {showLabel && (
        <span className="text-xs tabular-nums text-muted-foreground min-w-8 text-right">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
};
