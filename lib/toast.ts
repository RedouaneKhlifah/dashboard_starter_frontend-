import toast from "react-hot-toast";

const baseStyle = {
  padding: "12px 20px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 500,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  border: "1.5px solid #2B8A3E",
};

export const toastError = (message: string) => {
  return toast.error(message, {
    style: {
      ...baseStyle,
      background: "#FFF0F0",
      color: "#D93025",
    },
    iconTheme: {
      primary: "#D93025",
      secondary: "#FFF0F0",
    },
    duration: 4000,
    ariaProps: {
      role: "alert",
      "aria-live": "polite",
    },
  });
};

export const toastSuccess = (message: string) => {
  return toast.success(message, {
    style: {
      ...baseStyle,
      // background: "#F0FFF4",
      background: "#52ad551f",
      color: "#2B8A3E",
    },
    iconTheme: {
      primary: "#2B8A3E",
      secondary: "#F0FFF4",
    },
    duration: 4000,
    ariaProps: {
      role: "status",
      "aria-live": "polite",
    },
  });
};
