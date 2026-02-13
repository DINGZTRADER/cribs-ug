import { useAuthStore } from "../stores/useAuthStore";
import { API_BASE_URL } from "./config";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function requestJson<T>(options: {
  path: string;
  method?: HttpMethod;
  body?: unknown;
  auth?: boolean;
}): Promise<T> {
  const state = useAuthStore.getState();
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  if (options.auth && state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${options.path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = (await response.json().catch(() => ({}))) as { message?: string } & T;
  const message =
    typeof data.message === "string" ? data.message : `Request failed (${response.status}).`;

  if (response.status === 401) {
    useAuthStore.getState().clearSession();
  }

  if (!response.ok) {
    throw new Error(message);
  }

  return data as T;
}
