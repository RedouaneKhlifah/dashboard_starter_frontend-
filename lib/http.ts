import Cookies from "js-cookie";

type CustomFetchOptions = RequestInit & {
  headers?: HeadersInit;
  lang?: "en" | "ar" | "fr";
};

export default async function http(
  url: string,
  options: CustomFetchOptions = {}
): Promise<Response> {
  // Create default headers
  const defaultHeaders: Record<string, string> = {
    "X-API-READ-KEY": process.env.X_API_READ_KEY || "",
    accept: "application/json",
    "Accept-Language": options.lang || "en",
  };

  // Only set JSON content type if body isn't FormData
  if (!(options.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }
  // Combine headers
  const combinedHeaders: HeadersInit = new Headers({
    ...defaultHeaders,
    ...(options.headers instanceof Headers
      ? Object.fromEntries(options.headers.entries())
      : options.headers),
  });

  // Add Authorization header if token exists
  const token = Cookies.get("auth_token");
  if (token) {
    combinedHeaders.set("Authorization", `Bearer ${token}`);
  }

  const customOptions: CustomFetchOptions = {
    ...options,
    headers: combinedHeaders,
  };

  try {
    const response = await fetch(url, customOptions);

    // Intercept 401 Unauthorized responses
    if (response.status === 401 && typeof window !== "undefined") {
      // Clear authentication data
      Cookies.remove("auth_token");

      // Redirect to sign-in page
      window.location.href = "/sign-in";
    }

    // Return the response for successful requests
    return response;
  } catch (error) {
    // Handle fetch errors (e.g., network issues)
    console.error("Fetch error:", error);
    throw error;
  }
}
