export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

const API_URL = "http://localhost:5178/api/auth";

export const registerUser = async (data: RegisterData) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Registration failed");
  return res.json();
};
