import React from "react";
import { Link } from "react-router-dom";

interface PlaceholderActionLinkProps {
  to: string;
  label: string;
  variant?: "primary" | "secondary";
}

const PlaceholderActionLink: React.FC<PlaceholderActionLinkProps> = ({
  to,
  label,
  variant = "primary",
}) => {
  const className =
    variant === "primary"
      ? "inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
      : "inline-flex rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:border-slate-500";

  return (
    <Link to={to} className={className}>
      {label}
    </Link>
  );
};

export default PlaceholderActionLink;

