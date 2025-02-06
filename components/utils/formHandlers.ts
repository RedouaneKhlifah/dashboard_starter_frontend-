const handleChange = <T extends Record<string, any>>(
  e: React.ChangeEvent<HTMLInputElement>,
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  setErrors: React.Dispatch<React.SetStateAction<Partial<T>>>
) => {
  const { id, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [id]: value,
  }));

  setErrors((prev) => {
    const newErrors = { ...prev };

    if (newErrors[id as keyof T]) {
      delete newErrors[id as keyof T];
    }

    if (newErrors.general) {
      delete newErrors.general;
    }

    return newErrors;
  });
};

// Specific error check version (if you want explicit naming)
const hasNoErrors = <T extends Partial<Record<keyof T, string | undefined>>>(
  errorObj: T
): boolean => {
  return Object.keys(errorObj).length === 0;
};

enum FormTypeEnum {
  CREATE = "create",
  UPDATE = "update",
}

export { handleChange, hasNoErrors, FormTypeEnum };
