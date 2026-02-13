import { requestJson } from "./http";

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    role: string;
    fullName: string;
    phone: string;
    email: string | null;
  };
}

export function register(input: {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
  role: "tenant" | "landlord";
}) {
  return requestJson<AuthResponse>({
    path: "/auth/register",
    method: "POST",
    body: input
  });
}

export function login(input: { phone: string; password: string }) {
  return requestJson<AuthResponse>({
    path: "/auth/login",
    method: "POST",
    body: input
  });
}
