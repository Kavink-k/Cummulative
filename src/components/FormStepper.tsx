import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { StepProgressBar } from "@/components/StepProgressBar";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface FormStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  stepProgress: Record<number, number>; // Progress percentage for each step
}

export const FormStepper = ({ steps, currentStep, onStepClick, stepProgress }: FormStepperProps) => {
  return (
    <nav aria-label="Progress">
      <ol className="space-y-4 md:flex md:space-y-0 md:space-x-8">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const progress = stepProgress[step.id] || 0; // Get progress for this step

          return (
            <li key={step.id} className="md:flex-1">
              <button
                onClick={() => onStepClick?.(step.id)}
                disabled={!onStepClick}
                className={cn(
                  "group flex flex-col py-2 pl-4 md:pl-0 md:pt-4 w-full text-left",
                  onStepClick && "hover:opacity-80 cursor-pointer"
                )}
              >
                <div className="mb-2">
                  <StepProgressBar
                    progress={progress}
                    isCurrent={isCurrent}
                    isCompleted={isCompleted}
                  />
                </div>
                <span className="flex items-center text-sm font-medium">
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full mr-3",
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : isCurrent
                        ? "border-2 border-primary bg-background text-primary"
                        : "border-2 border-muted bg-background text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </span>
                  <span className={cn(isCurrent ? "text-primary" : "text-muted-foreground")}>
                    {step.title}
                  </span>
                </span>
                <span className="ml-11 mt-1 text-sm text-muted-foreground md:ml-0">
                  {step.description}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};