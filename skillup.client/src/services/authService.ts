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

export interface DemoAccount {
  email: string;
  password: string;
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

  /** Credentials of the shared demo account, or null when none is configured. */
  async getDemoAccount(): Promise<DemoAccount | null> {
    try {
      const res = await fetch(`${API_URL}/demo`);
      if (!res.ok) return null;

      const data = await res.json();
      if (!data?.email || !data?.password) return null;

      return { email: data.email, password: data.password };
    } catch {
      return null;
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

  /** Reads the role out of the JWT payload. */
  getRole(): string {
    const token = this.getToken();
    if (!token) return "User";

    try {
      const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
      const json = new TextDecoder().decode(
        Uint8Array.from(atob(padded), (c) => c.charCodeAt(0))
      );
      const payload = JSON.parse(json);
      return (
        payload.role ??
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
        "User"
      );
    } catch {
      return "User";
    }
  },

  isAdmin(): boolean {
    return this.isLoggedIn() && this.getRole() === "Admin";
  },
};
