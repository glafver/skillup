export interface Profile {
  firstname: string;
  lastname: string;
  email: string;
}

const API_URL = "http://localhost:5178/api/profile";

const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User is not logged in");
  return token;
};

export const getProfile = async (): Promise<Profile> => {
  const res = await fetch(`${API_URL}/current`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
};

export const updateEmail = async (email: string) => {
  const res = await fetch(`${API_URL}/update-email`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error("Failed to update email");
  return res.json();
};

export const updatePassword = async (password: string) => {
  const res = await fetch(`${API_URL}/update-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error("Failed to update password");
  return res.json();
};

export default { getProfile, updateEmail, updatePassword };
