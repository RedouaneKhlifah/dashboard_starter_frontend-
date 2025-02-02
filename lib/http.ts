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
    "Content-Type": "application/json",
    "Accept-Language": options.lang || "en",
  };

  const combinedHeaders: HeadersInit = new Headers({
    ...defaultHeaders,
    ...(options.headers instanceof Headers
      ? Object.fromEntries(options.headers.entries())
      : options.headers),
  });

  const customOptions: CustomFetchOptions = {
    ...options,
    headers: combinedHeaders,
    credentials: "include", // This is crucial for handling cookies
  };

  return fetch(url, customOptions);
}
