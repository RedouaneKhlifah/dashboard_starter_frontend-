import { SelectOption } from "../ui/SelectInput";

const handleChange = <T extends Record<string, any>>(
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  setErrors?: React.Dispatch<
    React.SetStateAction<Partial<Record<keyof T, any>>>
  >
) => {
  const { id, value } = e.target;
  const isNested = id?.includes(".");

  // Update form data
  setFormData((prev) => {
    if (isNested) {
      const keys = id.split(".");
      const newState = { ...prev };
      let current: any = newState;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        current[key] = current[key] ? { ...current[key] } : {};
        current = current[key];
      }

      current[keys[keys.length - 1]] = value;
      return newState;
    }

    return { ...prev, [id]: value };
  });

  // Clear errors
  if (setErrors) {
    setErrors((prev) => {
      const newErrors = { ...prev };

      if (isNested) {
        const errorKeys = id.split(".");
        let current: any = newErrors;

        for (let i = 0; i < errorKeys.length; i++) {
          const key = errorKeys[i];
          if (i === errorKeys.length - 1) {
            delete current[key];
            break;
          }
          if (!current[key] || typeof current[key] !== "object") break;
          current[key] = { ...current[key] };
          current = current[key];
        }
      } else {
        delete newErrors[id as keyof T];
      }

      delete newErrors.general;
      return newErrors;
    });
  }
};

// const handle Select
const handleSelect = <T extends Record<string, any>>(
  item: SelectOption | null,
  id: string,
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  setErrors?: React.Dispatch<
    React.SetStateAction<Partial<Record<keyof T, any>>>
  >
) => {
  const isNested = id?.includes(".");

  // Update form data
  setFormData((prev) => {
    if (isNested) {
      const keys = id.split(".");
      const newState = { ...prev };
      let current: any = newState;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        current[key] = current[key] ? { ...current[key] } : {};
        current = current[key];
      }

      current[keys[keys.length - 1]] = item?.value || "";
      return newState;
    }

    return { ...prev, [id]: item?.value || "" };
  });

  // Clear errors
  if (setErrors) {
    setErrors((prev) => {
      const newErrors = { ...prev };

      if (isNested) {
        const errorKeys = id.split(".");
        let current: any = newErrors;

        for (let i = 0; i < errorKeys.length; i++) {
          const key = errorKeys[i];
          if (i === errorKeys.length - 1) {
            delete current[key];
            break;
          }
          if (!current[key] || typeof current[key] !== "object") break;
          current[key] = { ...current[key] };
          current = current[key];
        }
      } else {
        delete newErrors[id as keyof T];
      }

      delete newErrors.general;
      return newErrors;
    });
  }
};

// Universal error checker that handles nested objects
const hasNoErrors = <T extends Record<string, any>>(
  errorObj: Partial<Record<keyof T, any>>
): boolean => {
  const checkErrors = (obj: any): boolean => {
    if (typeof obj !== "object" || obj === null) {
      return !obj; // Return true if null/undefined/falsy
    }

    return Object.values(obj).every((value) =>
      typeof value === "object" ? checkErrors(value) : !value
    );
  };

  return checkErrors(errorObj);
};

enum FormTypeEnum {
  CREATE = "create",
  UPDATE = "update",
}

export { handleChange, hasNoErrors, FormTypeEnum, handleSelect };
