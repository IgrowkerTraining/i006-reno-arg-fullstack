import { SearchCheck } from "lucide-react";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Search: React.FC<InputProps> = ({
  className = "",
  ...props
}) => {
  return (
    <div className={`relative group w-full ${className}`}>   
        <div className="absolute left-3 top-1/2 -translate-y-2 text-neutro-1 group-focus-within:text-secondary transition-colors">
      <SearchCheck size={20} />
        </div>
         <input
        className="
            w-full bg-neutro-3 rounded-full px-3 py-2.5 
           pl-10 text-neutro-1 placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary
            transition-all duration-200"
  
        {...props}
      />
    </div>

  );
};
