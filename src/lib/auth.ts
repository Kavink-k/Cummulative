// Simple client-side auth helper (replace with real API later)
export type User = { id: string; name: string; email: string };

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export function isAuthenticated() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

export function getUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

export async function login(email: string, password: string) {
  // TODO: call your real API here.
  // Demo success if non-empty:
  if (!email || !password) {
    throw new Error("Please enter both email and password.");
  }
  // Simulate a "token" + user
  const fakeUser: User = {
    id: "u_" + Math.random().toString(36).slice(2),
    name: email.split("@")[0],
    email,
  };
  localStorage.setItem(TOKEN_KEY, "demo-token");
  localStorage.setItem(USER_KEY, JSON.stringify(fakeUser));
  return fakeUser;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
