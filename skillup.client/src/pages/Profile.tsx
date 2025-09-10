import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profileService from "../services/profileService";
import type { Profile } from "../services/profileService";

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/account");
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile();
        setProfile(data);
      } catch {
        setMessage("Failed to load profile");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdateEmail = async () => {
    if (!newEmail) return;
    try {
      await profileService.updateEmail(newEmail);
      setProfile((prev) => (prev ? { ...prev, email: newEmail } : prev));
      setMessage("Email updated!");
      setNewEmail("");
    } catch (err) {
      setMessage("Failed to update email");
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) return;
    try {
      await profileService.updatePassword(newPassword);
      setMessage("Password updated!");
      setNewPassword("");
    } catch (err) {
      setMessage("Failed to update password");
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-slate-700 text-center">
        Hello {profile.firstname} {profile.lastname}!
      </h2>

      <p className="mb-4">{profile.email}</p>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <div className="flex gap-4">
        <div className="mb-4">
          <input
            type="email"
            placeholder="New email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <button
            onClick={handleUpdateEmail}
            className="w-full bg-cyan-700 hover:bg-teal-700 text-white p-2 rounded-md"
          >
            Update Email
          </button>
        </div>

        <div>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <button
            onClick={handleUpdatePassword}
            className="w-full bg-cyan-700 hover:bg-teal-700 text-white p-2 rounded-md"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
