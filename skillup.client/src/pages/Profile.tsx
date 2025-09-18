import { useEffect, useState } from "react";
import type { Profile, UpdateProfileRequest } from "../services/profileService";
import profileService from "../services/profileService";

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<UpdateProfileRequest>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [onError, setOnError] = useState(false);

  useEffect(() => {
    profileService.getProfile().then((data) => {
      setProfile(data);
      setForm({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: "",
        confirmPassword: "",
      });
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await profileService.updateProfile(form);
      setMessage("Profile updated successfully");
      setOnError(false);
    } catch {
      setMessage("Failed to update profile");
      setOnError(true);
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gray-200 shadow rounded-lg p-6 flex flex-col items-center">
        <img
          src="https://cdn-icons-png.freepik.com/512/6997/6997484.png"
          alt="UserAvatar"
          className="w-24 h-24 rounded-full mb-4"
        />
        <h3 className="text-lg font-semibold">
          {profile.firstname} {profile.lastname}
        </h3>
        <p className="text-gray-600">{profile.email}</p>
        <button className="mt-4 px-4 py-2 bg-cyan-700 hover:bg-teal-700 text-white p-2 rounded-md">
          Upload Photo
        </button>
      </div>

      <div className="bg-gray-200 shadow rounded-lg p-6 md:col-span-2">
        <h2 className="text-xl font-bold mb-6 text-gray-700">
          Personal Details
        </h2>

        {message && (
          <p className={`mb-4 ${onError ? "text-red-600" : "text-green-600"}`}>
            {message}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              name="password"
              value={form.password ?? ""}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword ?? ""}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-cyan-700 hover:bg-teal-700 text-white p-2 rounded-md"
          >
            Save Changes
          </button>
        </div>
      </div>
      <div className="bg-gray-200 shadow rounded-lg p-6 mb-5 md:col-span-3">
        <h2 className="text-xl font-bold mb-4">Active Courses</h2>
        <ul>
          <li className="mb-2 p-4 bg-gray-200">
            Course 1: Introduction to React
          </li>
        </ul>
      </div>
    </div>
  );
}
