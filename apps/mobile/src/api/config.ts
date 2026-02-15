const envObject = (globalThis as { process?: { env?: Record<string, string | undefined> } })
  .process?.env;

export const API_BASE_URL = envObject?.EXPO_PUBLIC_API_URL?.trim() || "http://localhost:3001";
