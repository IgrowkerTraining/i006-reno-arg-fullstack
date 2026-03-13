interface StatusBadgeProps {
  label: string;
  status: "vigente" | "cumple" | "warning" | "error" | "observaciones" | "sin datos";
}

export const StatusBadge = ({ label, status }: StatusBadgeProps) => {
  const statusStyles = {
    vigente: "text-green-600",
     cumple: "text-green-600",
    warning: "text-orange-500",
    error: "text-red-600",
    observaciones:"text-accent-2"
  };

  return (
    <div className="flex flex-col items-center bg-neutro-3 rounded-lg p-2 w-full gap-2 py-4">
      <span className="text-md ">{label}</span>
      <span className={`text-lg font-medium ${statusStyles[status]}`}>
        {status.toUpperCase()}
      </span>
    </div>
  );
};