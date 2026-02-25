import React from "react";

interface ProgressBarProps {
  value: number; // 0 a 100
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  return (
    <div className="w-full bg-neutro-3 rounded-full h-3">
      <div
        className="bg-secondary h-3 rounded-full transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};