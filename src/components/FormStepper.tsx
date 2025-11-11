// import { Check } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { StepProgressBar } from "@/components/StepProgressBar";

// interface Step {
//   id: number;
//   title: string;
//   description: string;
// }

// interface FormStepperProps {
//   steps: Step[];
//   currentStep: number;
//   onStepClick?: (step: number) => void;
//   stepProgress: Record<number, number>; // Progress percentage for each step
// }

// export const FormStepper = ({ steps, currentStep, onStepClick, stepProgress }: FormStepperProps) => {
//   return (
//     <nav aria-label="Progress">
//       <ol className="space-y-4 md:flex md:space-y-0 md:space-x-8">
//         {steps.map((step, index) => {
//           const isCompleted = currentStep > step.id;
//           const isCurrent = currentStep === step.id;
//           const progress = stepProgress[step.id] || 0; // Get progress for this step

//           return (
//             <li key={step.id} className="md:flex-1">
//               <button
//                 onClick={() => onStepClick?.(step.id)}
//                 disabled={!onStepClick}
//                 className={cn(
//                   "group flex flex-col py-2 pl-4 md:pl-0 md:pt-4 w-full text-left",
//                   onStepClick && "hover:opacity-80 cursor-pointer"
//                 )}
//               >
//                 <div className="mb-2">
//                   <StepProgressBar
//                     progress={progress}
//                     isCurrent={isCurrent}
//                     isCompleted={isCompleted}
//                   />
//                 </div>
//                 <span className="flex items-center text-sm font-medium">
//                   <span
//                     className={cn(
//                       "flex h-8 w-8 shrink-0 items-center justify-center rounded-full mr-3",
//                       isCompleted
//                         ? "bg-primary text-primary-foreground"
//                         : isCurrent
//                         ? "border-2 border-primary bg-background text-primary"
//                         : "border-2 border-muted bg-background text-muted-foreground"
//                     )}
//                   >
//                     {isCompleted ? (
//                       <Check className="h-5 w-5" />
//                     ) : (
//                       <span>{step.id}</span>
//                     )}
//                   </span>
//                   <span className={cn(isCurrent ? "text-primary" : "text-muted-foreground")}>
//                     {step.title}
//                   </span>
//                 </span>
//                 <span className="ml-11 mt-1 text-sm text-muted-foreground md:ml-0">
//                   {step.description}
//                 </span>
//               </button>
//             </li>
//           );
//         })}
//       </ol>
//     </nav>
//   );
// };

// import { Check } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { StepProgressBar } from "@/components/StepProgressBar";

// interface Step {
//   id: number;
//   title: string;
//   description: string;
// }

// interface FormStepperProps {
//   steps: Step[];
//   currentStep: number;
//   onStepClick?: (step: number) => void;
//   stepProgress: Record<number, number>; // Progress percentage for each step
// }

// export const FormStepper = ({ steps, currentStep, onStepClick, stepProgress }: FormStepperProps) => {
//   return (
//     <nav aria-label="Progress">
//       <ol className="space-y-4 md:flex md:space-y-0 md:space-x-8">
//         {steps.map((step, index) => {
//           const isCompleted = currentStep > step.id;
//           const isCurrent = currentStep === step.id;
//           const progress = stepProgress[step.id] || 0; // Get progress for this step
//           const isFullyCompleted = progress === 100; // Check if form is 100% complete

//           return (
//             <li key={step.id} className="md:flex-1">
//               <button
//                 onClick={() => onStepClick?.(step.id)}
//                 disabled={!onStepClick}
//                 className={cn(
//                   "group flex flex-col py-2 pl-4 md:pl-0 md:pt-4 w-full text-left",
//                   onStepClick && "hover:opacity-80 cursor-pointer"
//                 )}
//               >
//                 <div className="mb-2">
//                   <StepProgressBar
//                     progress={progress}
//                     isCurrent={isCurrent}
//                     isCompleted={isFullyCompleted} // Pass the fully completed status
//                   />
//                 </div>
//                 <span className="flex items-center text-sm font-medium">
//                   <span
//                     className={cn(
//                       "flex h-8 w-8 shrink-0 items-center justify-center rounded-full mr-3 transition-all duration-300",
//                       isFullyCompleted
//                         ? "bg-green-500 text-white shadow-md" // Green for fully completed
//                         : isCompleted
//                         ? "bg-primary text-primary-foreground"
//                         : isCurrent
//                         ? "border-2 border-primary bg-background text-primary shadow-sm"
//                         : "border-2 border-muted bg-background text-muted-foreground"
//                     )}
//                   >
//                     {isFullyCompleted ? (
//                       <Check className="h-5 w-5" />
//                     ) : isCompleted ? (
//                       <Check className="h-5 w-5" />
//                     ) : (
//                       <span>{step.id}</span>
//                     )}
//                   </span>
//                   <span className={cn(
//                     isCurrent ? "text-primary font-semibold" : 
//                     isFullyCompleted ? "text-green-600 font-medium" : 
//                     "text-muted-foreground"
//                   )}>
//                     {step.title}
//                   </span>
//                 </span>
//                 <span className="ml-11 mt-1 text-sm text-muted-foreground md:ml-0">
//                   {step.description}
//                 </span>
//               </button>
//             </li>
//           );
//         })}
//       </ol>
//     </nav>
//   );
// };

// import { Check } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { StepProgressBar } from "@/components/StepProgressBar";

// interface Step {
//   id: number;
//   title: string;
//   description?: string;
// }

// interface FormStepperProps {
//   steps: Step[];
//   /** currentStep is the step.id of the active step */
//   currentStep: number;
//   /** Called when a step is clicked (enables navigation) */
//   onStepClick?: (stepId: number) => void;
//   /** Progress percentage per step id */
//   stepProgress: Record<number, number>;
//   /** Vertical layout when true */
//   vertical?: boolean;
//   /** Show percentage labels on bars */
//   showProgressLabels?: boolean;
// }

// export const FormStepper = ({
//   steps,
//   currentStep,
//   onStepClick,
//   stepProgress,
//   vertical = false,
//   showProgressLabels = false,
// }: FormStepperProps) => {
//   // Resolve indices from ids so ids need not be sequential (fixes brittle comparisons)
//   const currentIndex = Math.max(
//     0,
//     steps.findIndex((s) => s.id === currentStep)
//   );

//   return (
//     <nav aria-label="Progress">
//       <ol
//         className={cn(
//           "w-full",
//           vertical
//             ? "space-y-4"
//             : "md:flex md:items-start md:space-x-8 space-y-4 md:space-y-0"
//         )}
//       >
//         {steps.map((step, index) => {
//           const progress = Math.max(0, Math.min(100, stepProgress[step.id] ?? 0));
//           const isCurrent = index === currentIndex;
//           // Consider a step completed if it’s before current OR its progress hit 100%
//           const isFullyCompleted = progress >= 100;
//           const isVisitedCompleted = index < currentIndex;
//           const isCompleted = isFullyCompleted || isVisitedCompleted;

//           const clickable = !!onStepClick && !isCurrent;

//           const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
//             if (!clickable) return;
//             if (e.key === "Enter" || e.key === " ") {
//               e.preventDefault();
//               onStepClick?.(step.id);
//             }
//           };

//           return (
//             <li key={step.id} className={cn("md:flex-1")}>
//               <button
//                 type="button"
//                 onClick={clickable ? () => onStepClick?.(step.id) : undefined}
//                 onKeyDown={handleKeyDown}
//                 disabled={!clickable}
//                 aria-current={isCurrent ? "step" : undefined}
//                 aria-label={`${step.title}${isCompleted ? " (completed)" : isCurrent ? " (current step)" : ""}`}
//                 className={cn(
//                   "group flex w-full flex-col text-left py-2 pl-4 md:pl-0 md:pt-4 focus:outline-none",
//                   clickable
//                     ? "cursor-pointer hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 rounded-xl"
//                     : "cursor-default"
//                 )}
//               >
//                 <div className="mb-2">
//                   <StepProgressBar
//                     progress={progress}
//                     isCurrent={isCurrent}
//                     isCompleted={isCompleted}
//                     showLabel={showProgressLabels}
//                     ariaLabel={`${step.title} progress`}
//                   />
//                 </div>

//                 <span className="flex items-center text-sm font-medium">
//                   <span
//                     className={cn(
//                       "mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300",
//                       isCompleted
//                         ? "bg-green-500 text-white shadow-md"
//                         : isCurrent
//                         ? "border-2 border-primary bg-background text-primary shadow-sm"
//                         : "border-2 border-muted bg-background text-muted-foreground"
//                     )}
//                   >
//                     {isCompleted ? (
//                       <Check className="h-5 w-5" aria-hidden="true" />
//                     ) : (
//                       <span className="font-semibold">{step.id}</span>
//                     )}
//                   </span>

//                   <span
//                     className={cn(
//                       "truncate",
//                       isCurrent
//                         ? "text-primary font-semibold"
//                         : isCompleted
//                         ? "text-green-600 font-medium"
//                         : "text-muted-foreground"
//                     )}
//                   >
//                     {step.title}
//                   </span>
//                 </span>

//                 {step.description && (
//                   <span className="mt-1 ml-11 text-sm text-muted-foreground md:ml-0">
//                     {step.description}
//                   </span>
//                 )}
//               </button>
//             </li>
//           );
//         })}
//       </ol>
//     </nav>
//   );
// };

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { StepProgressBar } from "@/components/StepProgressBar";

interface Step {
  id: number;
  title: string;
  description?: string;
}

interface FormStepperProps {
  steps: Step[];
  /** currentStep is the step.id of the active step */
  currentStep: number;
  /** Called when a step is clicked (enables navigation) */
  onStepClick?: (stepId: number) => void;
  /** Progress percentage per step id */
  stepProgress: Record<number, number>;
  /** Vertical layout when true */
  vertical?: boolean;
  /** Show percentage labels on bars */
  showProgressLabels?: boolean;
}

export const FormStepper = ({
  steps,
  currentStep,
  onStepClick,
  stepProgress,
  vertical = false,
  showProgressLabels = false,
}: FormStepperProps) => {
  // Resolve indices from ids so ids need not be sequential
  const currentIndex = Math.max(0, steps.findIndex((s) => s.id === currentStep));

  return (
    <nav aria-label="Progress">
      <ol
        className={cn(
          "w-full",
          vertical ? "space-y-4" : "md:flex md:items-start md:space-x-8 space-y-4 md:space-y-0"
        )}
      >
        {steps.map((step, index) => {
          const progress = Math.max(0, Math.min(100, stepProgress[step.id] ?? 0));
          const isCurrent = index === currentIndex;
          const isCompleted = progress >= 100;                // ✅ only 100% gets the tick
          const isInProgress = progress > 0 && progress < 100; // ✅ 1–99% = amber state

          const clickable = !!onStepClick && !isCurrent;

          const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
            if (!clickable) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onStepClick?.(step.id);
            }
          };

          return (
            <li key={step.id} className={cn("md:flex-1")}>
              <button
                type="button"
                onClick={clickable ? () => onStepClick?.(step.id) : undefined}
                onKeyDown={handleKeyDown}
                disabled={!clickable}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`${step.title}${
                  isCompleted ? " (completed)" : isCurrent ? " (current step)" : isInProgress ? " (in progress)" : ""
                }`}
                className={cn(
                  "group flex w-full flex-col text-left py-2 pl-4 md:pl-0 md:pt-4 focus:outline-none",
                  clickable
                    ? "cursor-pointer hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 rounded-xl"
                    : "cursor-default"
                )}
              >
                <div className="mb-2">
                  <StepProgressBar
                    progress={progress}
                    isCurrent={isCurrent}
                    isCompleted={isCompleted}
                    isInProgress={isInProgress}
                    showLabel={showProgressLabels}
                    ariaLabel={`${step.title} progress`}
                  />
                </div>

                <span className="flex items-center text-sm font-medium">
                  <span
                    className={cn(
                      "mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                      isCompleted
                        ? "bg-green-500 text-white shadow-md"
                        : isCurrent
                        ? "border-2 border-primary bg-background text-primary shadow-sm"
                        : isInProgress
                        ? "border-2 border-amber-500 bg-background text-amber-600"
                        : "border-2 border-muted bg-background text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <span className="font-semibold">{step.id}</span>
                    )}
                  </span>

                  <span
                    className={cn(
                      "truncate",
                      isCompleted
                        ? "text-green-600 font-medium"
                        : isCurrent
                        ? "text-primary font-semibold"
                        : isInProgress
                        ? "text-amber-600"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </span>

                {step.description && (
                  <span className="mt-1 ml-11 text-sm text-muted-foreground md:ml-0">
                    {step.description}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
