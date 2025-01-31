type CustomFetchOptions = RequestInit & {
  headers?: HeadersInit;
};

export default async function http(
  url: string,
  options: CustomFetchOptions = {}
): Promise<Response> {
  const defaultHeaders: Record<string, string> = {
    "X-API-READ-KEY": process.env.X_API_READ_KEY || "",
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
  };

  return fetch(url, customOptions);
}
