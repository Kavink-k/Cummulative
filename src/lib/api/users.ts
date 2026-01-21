// API utilities for user authentication
const API_BASE_URL = "https://cummulative-backend-production.up.railway.app/api";
export interface RegisterUserData {
    name: string;
    designation: string;
    collegeName: string;
    email: string;
    phone: string;
    password: string;
}

export interface LoginUserData {
    email: string;
    password: string;
}

export interface UserResponse {
    id: number;
    name: string;
    designation: string;
    collegeName: string;
    email: string;
    phone: string;
    role: 'user' | 'admin';
    isActive: boolean;
    createdAt: string;
    lastLogin?: string;
}

export interface ApiResponse<T> {
    message: string;
    data: T;
}

export async function registerUser(userData: RegisterUserData): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
    }

    const result: ApiResponse<UserResponse> = await response.json();
    return result.data;
}

export async function loginUser(loginData: LoginUserData): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
    }

    const result: ApiResponse<UserResponse> = await response.json();
    return result.data;
}
