import { cookies } from "next/headers"; // For accessing cookies in Next.js App Router
import { redirect } from "next/navigation"; // For redirecting users in Next.js

type CustomFetchOptions = RequestInit & {
  headers?: HeadersInit;
  lang?: "en" | "ar" | "fr";
};

export default async function httpServer(
  url: string,
  options: CustomFetchOptions = {}
): Promise<Response> {
  // Get the auth token from cookies
  const authToken = cookies().get("auth_token")?.value;

  // Create default headers
  const defaultHeaders: Record<string, string> = {
    "X-API-READ-KEY": process.env.X_API_READ_KEY || "",
    "Content-Type": "application/json",
    accept: "application/json",
    "Accept-Language": options.lang || "en",
  };

  // Combine headers
  const combinedHeaders: HeadersInit = new Headers({
    ...defaultHeaders,
    ...(options.headers instanceof Headers
      ? Object.fromEntries(options.headers.entries())
      : options.headers),
  });

  // Add Authorization header if token exists
  if (authToken) {
    combinedHeaders.set("Authorization", `Bearer ${authToken}`);
  }

  const customOptions: CustomFetchOptions = {
    ...options,
    headers: combinedHeaders,
  };

  try {
    const response = await fetch(url, customOptions);

    // Intercept 401 Unauthorized responses
    if (response.status === 401) {
      // Delete auth cookie
      cookies().delete("auth_token");

      // Redirect to sign-in page
      redirect("/sign-in");
    }

    // Return the response for successful requests
    return response;
  } catch (error) {
    // Handle fetch errors (e.g., network issues)
    console.error("Fetch error:", error);
    throw error;
  }
}