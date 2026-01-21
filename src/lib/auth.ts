import { registerUser as apiRegisterUser, loginUser as apiLoginUser, type UserResponse } from "./api/users";

// Updated User type to match backend response
export type User = {
  id: number;
  name: string;
  designation: string;
  collegeName: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  isActive: boolean;
};

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export function isAuthenticated() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

export function getUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

export function isAdmin(): boolean {
  const user = getUser();
  return user?.role === 'admin';
}

export async function register(
  name: string,
  designation: string,
  collegeName: string,
  email: string,
  phone: string,
  password: string
): Promise<User> {
  try {
    const userData = await apiRegisterUser({
      name,
      designation,
      collegeName,
      email,
      phone,
      password,
    });

    // Store user data and token
    const user: User = {
      id: userData.id,
      name: userData.name,
      designation: userData.designation,
      collegeName: userData.collegeName,
      email: userData.email,
      phone: userData.phone,
      role: userData.role || 'user',
      isActive: userData.isActive,
    };

    localStorage.setItem(TOKEN_KEY, "user-token-" + userData.id);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return user;
  } catch (error) {
    throw error;
  }
}

export async function login(email: string, password: string): Promise<User> {
  try {
    const userData = await apiLoginUser({ email, password });

    // Store user data and token
    const user: User = {
      id: userData.id,
      name: userData.name,
      designation: userData.designation,
      collegeName: userData.collegeName,
      email: userData.email,
      phone: userData.phone,
      role: userData.role || 'user',
      isActive: userData.isActive,
    };

    localStorage.setItem(TOKEN_KEY, "user-token-" + userData.id);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return user;
  } catch (error) {
    throw error;
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
