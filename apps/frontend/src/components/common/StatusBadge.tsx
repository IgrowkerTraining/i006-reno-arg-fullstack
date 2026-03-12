interface StatusBadgeProps {
  label: string;
  status: "vigente" | "warning" | "error" | "revisar";
}

export const StatusBadge = ({ label, status }: StatusBadgeProps) => {
  const statusStyles = {
    vigente: "text-green-600",
    warning: "text-orange-500",
    error: "text-red-600",
    revisar:"text-yellow-500"
  };

  return (
    <div className="flex flex-col items-center bg-neutro-3 rounded-lg p-2 w-full gap-2 py-4">
      <span className="text-md ">{label}</span>
      <span className={`text-lg font-semibold ${statusStyles[status]}`}>
        {status.toUpperCase()}
      </span>
    </div>
  );
};