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

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <label htmlFor={id} className="block text-sm text-foreground mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={showPasswordToggle && showPassword ? "text" : type}
          id={id}
          value={value}
          onChange={onChange}
          className={`w-full px-3 lg:py-2 py-3 bg-defaultground border ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-800 focus:ring-yellow-500"
          } rounded-sm text-foreground focus:outline-none focus:ring-1 ${className}`}
          placeholder={placeholder}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={handlePasswordToggle}
            className="absolute top-1/2 transform -translate-y-1/2 text-foreground hover:text-muted-foreground"
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
        <p
          id={`${id}-error`}
          className="mt-1 text-sm text-red-500"
          role="alert"
        >
          {error}
        </p>
      )}
    </>
  );
};

export default InputField;
