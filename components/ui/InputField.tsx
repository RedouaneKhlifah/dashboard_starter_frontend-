// InputField.tsx
import { Eye, EyeOff } from "lucide-react";
import React, { useEffect, useState } from "react";

interface InputFieldProps {
   id: string;
   label: string;
   type?: string;
   value: string;
   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   placeholder?: string;
   className?: string;
   showPasswordToggle?: boolean;
   error?: string;
   required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
   id,
   label,
   type = "text",
   value,
   onChange,
   placeholder,
   className = "",
   showPasswordToggle = false,
   error,
   required = false,
}) => {
   const [showPassword, setShowPassword] = useState(false);
   const [isRTL, setIsRTL] = useState<boolean>(false);

   useEffect(() => {
       setIsRTL(document.documentElement.dir === "rtl");
   }, []);

   return (
       <div className="w-full">
           <label htmlFor={id} className="block text-sm font-medium text-foreground mb-2 mt-3.5">
               {label}
               {required && <span className="text-red-500 ml-1">*</span>}
           </label>
           <div className="relative">
               <input
                   type={showPasswordToggle && showPassword ? "text" : type}
                   id={id}
                   value={value}
                   onChange={onChange}
                   className={`w-full px-4 py-2.5 bg-background border-2 rounded-md
                       ${error ? "border-red-500" : "border-input"}
                       focus:outline-none focus:ring-2 focus:ring-primary/30 border-gray-800
                       ${className}`}
                   placeholder={placeholder}
                   aria-invalid={error ? "true" : "false"}
                   aria-describedby={error ? `${id}-error` : undefined}
               />
               {showPasswordToggle && (
                   <button
                       type="button"
                       onClick={() => setShowPassword(!showPassword)}
                       className="absolute top-1/2 -translate-y-1/2 text-foreground hover:text-muted-foreground"
                       style={{
                           right: isRTL ? "auto" : "0.75rem",
                           left: isRTL ? "0.75rem" : "auto",
                       }}
                   >
                       {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                   </button>
               )}
           </div>
           {error && (
               <p id={`${id}-error`} className="mt-1 text-xs text-red-500" role="alert">
                   {error}
               </p>
           )}
       </div>
   );
};

export default InputField;
