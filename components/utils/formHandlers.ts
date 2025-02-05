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

export { handleChange };

