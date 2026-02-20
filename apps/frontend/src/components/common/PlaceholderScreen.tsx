import React from "react";

interface PlaceholderScreenProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({
  title,
  description = "Pantalla pendiente de implementacion por UX.",
  children,
}) => {
  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/40 p-8">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <p className="mt-2 text-sm text-slate-400">{description}</p>
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </div>
  );
};

export default PlaceholderScreen;

