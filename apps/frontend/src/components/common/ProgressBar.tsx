import React from "react";

interface ProgressBarProps {
  value: number; // 0 a 100,  
  color?: string; // opcional, para personalizar el color de la barra
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, color }) => {
  return (
    <div className="w-full bg-neutro-3 rounded-full h-3">
      <div
        className={`h-3 rounded-full transition-all duration-300 ${color || "bg-secondary"}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};