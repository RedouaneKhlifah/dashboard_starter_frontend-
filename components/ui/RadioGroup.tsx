import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { Check, LucideIcon } from "lucide-react";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
}

interface RadioGroupProps {
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  name: string;
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  selectedValue,
  onChange,
  name,
  label,
  error,
  required = false,
  className = "",
  orientation = "vertical",
  disabled = false,
}) => {
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    setIsRTL(document.documentElement.dir === "rtl");
  }, []);

  return (
    <div className={className}>
      {label && (
        <legend className="block text-sm font-medium text-foreground mb-3">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </legend>
      )}

      <div
        className={clsx("flex gap-3", {
          "flex-col": orientation === "vertical",
          "flex-row": orientation === "horizontal",
        })}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={clsx("flex items-start gap-3 p-4 border-2 rounded-md ", {
              "border-primary bg-primary/10": selectedValue === option.value,
              "border-input": selectedValue !== option.value,
              "border-red-500": error,
              "opacity-50 !cursor-not-allowed": disabled, // Disable styling
              "cursor-pointer hover:border-primary/50 transition-colors duration-200":
                !disabled, // Enable pointer cursor
            })}
          >
            <div className="flex items-center h-5">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selectedValue === option.value}
                onChange={() => !disabled && onChange(option.value)}
                disabled={disabled}
                className="sr-only"
                aria-describedby={error ? `${name}-error` : undefined}
              />
              <div
                className={clsx(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  {
                    "border-primary bg-primary": selectedValue === option.value,
                    "border-muted-foreground": selectedValue !== option.value,
                    "opacity-50": disabled, // Dimmed when disabled
                  }
                )}
              >
                {selectedValue === option.value && (
                  <Check className="w-3.5 h-3.5 text-white" />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                {option.icon && (
                  <option.icon className="w-5 h-5 text-muted-foreground" />
                )}
                <span
                  className={clsx("text-sm font-medium text-foreground", {
                    "opacity-50": disabled, // Text dimmed when disabled
                  })}
                >
                  {option.label}
                </span>
              </div>
              {option.description && (
                <p
                  className={clsx("text-sm text-muted-foreground", {
                    "opacity-50": disabled, // Description dimmed when disabled
                  })}
                >
                  {option.description}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>

      {error && (
        <p
          id={`${name}-error`}
          className="mt-2 text-sm text-red-500"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default RadioGroup;
