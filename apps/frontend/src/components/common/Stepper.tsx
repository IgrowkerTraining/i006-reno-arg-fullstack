import React from "react";

interface StepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  className = "",
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-y-3 ${className}`}>
      {steps.map((step, index) => {
        const isCurrent = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <React.Fragment key={`${step}-${index}`}>
            <div className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                  isCurrent || isCompleted
                    ? "bg-secondary text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`text-sm font-semibold uppercase ${
                  isCurrent || isCompleted
                    ? "text-primary"
                    : "text-slate-400"
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <span
                aria-hidden
                className={`mx-2 hidden h-px w-12 md:block ${
                  isCompleted ? "bg-secondary" : "bg-slate-200"
                }`}
              />
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};
