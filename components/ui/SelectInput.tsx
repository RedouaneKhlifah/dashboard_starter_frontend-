import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { X, Check } from "lucide-react";
import clsx from "clsx";
import Image, { StaticImageData } from "next/image";

export interface SelectOption {
  id?: number;
  value: string;
  label?: string;
  image?: string | StaticImageData;
}

export interface SelectInputRef {
  focus: () => void;
}

interface SelectInputProps {
  id: string;
  label: string;
  options: SelectOption[];
  value: string;
  onSelect: (value: SelectOption | null) => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  icon?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  dropdownPosition?: "above" | "below";
}

const SelectInput = forwardRef<SelectInputRef, SelectInputProps>(
  (
    {
      id,
      label,
      options,
      value,
      onSelect,
      onChange,
      placeholder = "Select...",
      className = "",
      error,
      required = false,
      disabled = false,
      searchable = false,
      clearable = false,
      icon,
      prefix,
      suffix,
      dropdownPosition = "below",
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [isRTL, setIsRTL] = useState<boolean>(false);

    useEffect(() => {
      setIsRTL(document.documentElement.dir === "rtl");
    }, []);

    // Expose the focus method via ref
    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }));

    const selectedOption = options.find((option) => option.value === value);

    const filteredOptions = searchable
      ? options.filter((option) =>
          (option.label || option.value)
            .toLowerCase()
            .includes(value.toLowerCase())
        )
      : options;

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          isOpen &&
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    const handleSelect = (option: SelectOption) => {
      onSelect(option);
      setIsOpen(false);
      onChange({ target: { value: option.value } } as any);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(null);
      setIsOpen(false);
      onChange({ target: { value: "" } } as any);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      onChange(e);
    };

    const displayValue = searchable
      ? value
      : selectedOption?.label || selectedOption?.value || "";

    return (
      <div className={clsx("w-full relative", className)} ref={containerRef}>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-foreground mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div>
          <div className="relative flex items-center">
            {(icon || prefix) && (
              <div
                className={clsx(
                  "absolute top-0 bottom-0 flex items-center",
                  isRTL ? "right-3" : "left-3"
                )}
              >
                {icon && <span className="text-muted-foreground">{icon}</span>}
                {prefix && (
                  <span className="text-sm text-muted-foreground">
                    {prefix}
                  </span>
                )}
              </div>
            )}
            <input
              ref={inputRef}
              type="text"
              id={id}
              onFocus={() => !disabled && setIsOpen(true)}
              value={displayValue}
              onChange={handleInputChange}
              className={clsx(
                disabled ? "cursor-not-allowed opacity-75" : "cursor-text",
                "w-full px-4 py-2 border-2 rounded-md",
                "focus:outline-none focus:ring-2 focus:ring-primary/30",
                "transition-colors duration-200",
                error
                  ? "border-red-500"
                  : "border-input hover:border-primary/50",
                icon || prefix ? (isRTL ? "pr-11" : "pl-11") : "",
                clearable && value ? "pr-10" : ""
              )}
              placeholder={placeholder}
              readOnly={!searchable}
              disabled={disabled}
            />
            {clearable && value && (
              <div
                className={clsx(
                  isRTL ? "left-2" : "right-2",
                  "absolute top-1/2 transform -translate-y-1/2"
                )}
              >
                <X
                  className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={handleClear}
                />
              </div>
            )}
          </div>

          {isOpen && (
            <div
              className={clsx(
                "absolute z-50 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto",
                dropdownPosition === "above"
                  ? "bottom-full mb-[-18.5px]"
                  : "top-full mt-2"
              )}
            >
              {filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-2 cursor-pointer",
                    "hover:bg-accent transition-colors",
                    option.value === value && "bg-accent"
                  )}
                  onClick={() => handleSelect(option)}
                >
                  {option.image && (
                    <Image
                      src={option.image}
                      alt={option.label || option.value}
                      width={24}
                      height={24}
                      className="rounded-full object-cover"
                    />
                  )}
                  <span className="flex-1 truncate">
                    {option.label || option.value}
                  </span>
                  {option.value === value && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </div>
              ))}

              {filteredOptions.length === 0 && (
                <div className="px-4 py-2 text-muted-foreground">
                  No options found
                </div>
              )}
            </div>
          )}

          {error && (
            <p className="mt-1 text-xs text-red-500" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
);

SelectInput.displayName = "SelectInput";

export default SelectInput;
