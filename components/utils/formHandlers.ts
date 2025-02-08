const handleChange = <T extends Record<string, any>>(
  e: React.ChangeEvent<HTMLInputElement>,
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  setErrors?: React.Dispatch<
    React.SetStateAction<Partial<Record<keyof T, string>>>
  >
) => {
  const { id, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [id]: value,
  }));

  if (setErrors) {
    setErrors((prev) => {
      const newErrors = { ...prev };

      if (newErrors[id as keyof T]) {
        delete newErrors[id as keyof T];
      }

      if (newErrors.general as keyof T) {
        delete newErrors.general;
      }

      return newErrors;
    });
  }
};

// Update hasNoErrors to match the error type
const hasNoErrors = <T extends Record<string, any>>(
  errorObj: Partial<Record<keyof T, string>>
): boolean => {
  return Object.keys(errorObj).length === 0;
};

enum FormTypeEnum {
  CREATE = "create",
  UPDATE = "update",
}

export { handleChange, hasNoErrors, FormTypeEnum };
