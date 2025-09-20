export interface LoginResponse {
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  avatar: string;
}

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5178";
const API_URL = `${BASE_URL}/api/auth`;

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    const json = await res.json();
    localStorage.setItem("token", json.token); // spara JWT
    return json;
  },

  async register(data: RegisterRequest): Promise<void> {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Register failed");
    }
  },

  logout() {
    Object.keys(localStorage)
      .filter((key) => key.startsWith("course_"))
      .forEach((key) => localStorage.removeItem(key));
    localStorage.removeItem("quizAnswers");
    localStorage.removeItem("token");
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  isLoggedIn(): boolean {
    return !!localStorage.getItem("token");
  },
};
