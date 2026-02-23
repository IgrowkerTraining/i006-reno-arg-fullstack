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
    <div className={`rounded-xl shadow-md border p-4 ${className}`}>
      {children}
    </div>
  );
};