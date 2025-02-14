import { Eye, EyeOff, IconNode, LucideIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import clsx from "clsx";

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  min?: number;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  className?: string;
  showPasswordToggle?: boolean;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
  textarea?: boolean;
  rows?: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  disabled?: boolean; 
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
  icon,
  textarea = false,
  rows = 3,
  prefix,
  suffix,
  disabled,
  min,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isRTL, setIsRTL] = useState<boolean>(false);

  useEffect(() => {
    setIsRTL(document.documentElement.dir === "rtl");
  }, []);

  const InputComponent = textarea ? "textarea" : "input";

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-foreground mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative group">
        {(icon || prefix) && (
          <div className={clsx(
            "absolute top-0 bottom-0 flex items-center",
            isRTL ? "right-3" : "left-3"
          )}>
            {icon && <span className="text-muted-foreground">{icon}</span>}
            {prefix && (
              <span className="text-sm text-muted-foreground">{prefix}</span>
            )}
          </div>
        )}

        <InputComponent
          id={id}
          min={min}
          value={value}
          step="any"
          onChange={onChange}
          disabled={disabled}
          className={clsx(
            disabled ? "cursor-not-allowed opacity-75 bg-primary/10" : "bg-background",
            "w-full px-4 py-2.5 border-2 rounded-md",
            "focus:outline-none focus:ring-2 focus:ring-primary/30",
            "transition-colors duration-200",
            error ? "border-red-500" : "border-input hover:border-primary/50",
            icon || prefix ? (isRTL ? "pr-11" : "pl-11") : "",
            suffix ? (isRTL ? "pl-11" : "pr-11") : "",
            textarea ? "resize-y min-h-[100px]" : "h-11",
            className
          )}
          placeholder={placeholder}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          type={showPasswordToggle && showPassword ? "text" : type}
          rows={textarea ? rows : undefined}
        />

        {(suffix || showPasswordToggle) && (
          <div
            className={clsx(
              "absolute top-0 bottom-0 flex items-center gap-2",
              isRTL ? "left-3" : "right-3"
            )}
          >
            {suffix && (
              <span className="text-sm text-muted-foreground">{suffix}</span>
            )}

            {showPasswordToggle && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <p
          id={`${id}-error`}
          className="mt-1 text-xs text-red-500"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
