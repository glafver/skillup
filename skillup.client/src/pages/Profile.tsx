import { useEffect, useState } from "react";
import type {
  Profile,
  UpdateProfileRequest,
  ActiveCourse,
} from "../services/profileService";
import profileService from "../services/profileService";
import AvatarSection from "../components/AvatarSection";
import { authService } from "../services/authService";

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

  const handleUpdateAvatar = async (url: string) => {
    if (!profile) return;

    try {
      await profileService.updateProfile({
        firstname: profile.firstname,
        lastname: profile.lastname,
        email: profile.email,
        avatar: url,
      });

      setProfile({ ...profile, avatar: url });
    } catch {
      console.error("Failed to update avatar");
    }
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
  // Fetch active courses
  const [courses, setCourses] = useState<ActiveCourse[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/api/courses/active`, {
          headers: { Authorization: `Bearer ${authService.getToken()}` },
        });
        if (!res.ok) throw new Error(await res.text());
        const json: ActiveCourse[] = await res.json();
        setCourses(json);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [API]);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      <AvatarSection profile={profile} onUpdateAvatar={handleUpdateAvatar} />
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
        <h2 className="text-xl font-semibold mb-2">Active courses</h2>
        {loading && <p className="text-gray-500">Loading…</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        {!loading && !error && courses?.length === 0 && (
          <p className="text-gray-700">No active courses.</p>
        )}

        <ul className="space-y-3">
          {courses?.map((c) => (
            <li key={c.id} className="flex rounded overflow-hidden bg-gray-100">
              <div className="flex-shrink-0">
                <img
                  src={`/${c.image}`}
                  alt={c.title}
                  className="w-[96px] h-[96px] p-1 object-cover bg-white"
                />
              </div>
              <div className="flex-grow p-3">
                <h3 className="font-semibold">{c.title}</h3>

                <div className="mt-2 text-xs text-gray-600 flex items-center">
                  <div className="flex space-x-3">
                    <span>Level: {c.currentLevel}</span>
                    <span>
                      Started:{" "}
                      {new Date(c.startedAt).toISOString().split("T")[0]}
                    </span>
                  </div>
                  {c.currentLevel === "Beginner" && c.status === "Active" && (
                    <button className="ml-auto mr-1 px-6 py-2 bg-cyan-700 hover:bg-teal-700 text-white rounded-md">
                      Get Certificate
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
