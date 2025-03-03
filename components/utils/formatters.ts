export const formatDate = (
  date: Date | string | null | undefined,
  locale: string
) => {
  if (!date) return "N/A"; // Handle null/undefined values

  try {
    // If it's a string, convert it to a Date first
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    return parsedDate.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

export const formatCurrency = (amount: number, locale: string) => {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `€${amount.toFixed(2)}`;
  }
};
