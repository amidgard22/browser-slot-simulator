import { getToken } from "./auth.storage";

const API_URL = "http://localhost:8080";

function authHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function registerUser(email: string, password: string) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Registration failed");
  }

  return (await response.json()) as { message: string };
}

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Login failed");
  }

  return (await response.json()) as { token: string; email: string };
}

export async function getMe() {
  const response = await fetch(`${API_URL}/me`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Unauthorized");
  }

  return (await response.json()) as { id: number; email: string };
}
