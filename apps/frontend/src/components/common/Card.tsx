import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md border border-slate-200 p-4 ${className}`}
    >
      {children}
    </div>
  );
};