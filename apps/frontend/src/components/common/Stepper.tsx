import React from "react";

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="flex items-center gap-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-medium
            ${
              index === currentStep
                ? "bg-primary text-white"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            {index + 1}
          </div>
          <span
            className={`text-sm ${
              index === currentStep
                ? "text-primary font-semibold"
                : "text-slate-500"
            }`}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  );
};