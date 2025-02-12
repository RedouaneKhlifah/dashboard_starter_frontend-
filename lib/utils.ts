import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce(func: () => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func();
    }, wait);
  };
}

export async function urlToFile(url: string, filename: string): Promise<File> {
  try {
    // Fetch the image from the URL
    const response = await fetch(url);

    // Convert the response to a blob
    const blob = await response.blob();

    // Create a File object from the blob
    return new File([blob], filename, {
      type: blob.type || "application/octet-stream",
    });
  } catch (error) {
    console.error("Error converting URL to File:", error);
    throw error;
  }
}
