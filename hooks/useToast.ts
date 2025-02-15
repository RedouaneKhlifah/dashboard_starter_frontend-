import { toastError, toastSuccess } from "@/lib/toast";

const useToast = () => {
  return {
    error: toastError,
    success: toastSuccess,
    // Add other toast types as needed
  };
};

export default useToast;