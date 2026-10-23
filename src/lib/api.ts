import { getApiBaseUrl } from "@/lib/api-url";

export async function fetchApi<T>(path: string): Promise<T | null> {
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      console.error(`[api] ${response.status} ${url}`);
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`[api] failed ${url}`, error);
    return null;
  }
}
