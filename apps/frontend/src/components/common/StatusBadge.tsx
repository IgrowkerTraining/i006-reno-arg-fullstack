interface StatusBadgeProps {
  label: string;
  status: "ok" | "warning" | "error";
}

export const StatusBadge = ({ label, status }: StatusBadgeProps) => {
  const statusStyles = {
    ok: "text-green-600",
    warning: "text-orange-500",
    error: "text-red-600",
  };

  return (
    <div className="flex flex-col items-center bg-slate-100 rounded-lg p-2 min-w-[110px]">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`text-sm font-semibold ${statusStyles[status]}`}>
        {status.toUpperCase()}
      </span>
    </div>
  );
};