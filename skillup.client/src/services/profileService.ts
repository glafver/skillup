export interface Profile {
  firstname: string;
  lastname: string;
  email: string;
  avatar?: string;
}

export interface UpdateProfileRequest {
  firstname: string;
  lastname: string;
  email: string;
  password?: string | null;
  confirmPassword?: string | null;
  avatar?: string;
}

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5178";
const API_URL = `${BASE_URL}/api/profile`;

const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User is not logged in");
  return token;
};

const getProfile = async (): Promise<Profile> => {
  const res = await fetch(`${API_URL}/current`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
};

const updateProfile = async (data: UpdateProfileRequest) => {
  const res = await fetch(`${API_URL}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
};

export default { getProfile, updateProfile };
