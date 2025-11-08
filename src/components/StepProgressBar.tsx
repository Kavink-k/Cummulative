interface StepProgressBarProps {
  progress: number; // Percentage (0-100)
  isCurrent: boolean;
  isCompleted: boolean;
}

export const StepProgressBar = ({ progress, isCurrent, isCompleted }: StepProgressBarProps) => {
  return (
    <div className="w-full bg-muted rounded-full h-1 md:h-1.5 overflow-hidden">
      <div
        className={`
          h-full transition-all duration-300 ease-in-out
          ${isCompleted || isCurrent ? "bg-primary" : "bg-muted-foreground/30"}
        `}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};