import { useEffect, useState } from "react";
import { authService } from "../services/authService";

type ActiveCourseDto = {
  id: string;
  courseSlug: string;
  startedAt: string;
  currentLevel: string;
  status: string;
  title: string;
  description: string;
  image: string;
};

export default function TestActiveCourses() {
  const [data, setData] = useState<ActiveCourseDto[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API = import.meta.env.VITE_API_URL;

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!authService.isLoggedIn()) {
        setError("Not authenticated. Log in first.");
        setLoading(false);
        return;
      }
      const res = await fetch(`${API}/api/course/active`, {
        headers: { Authorization: `Bearer ${authService.getToken()}` },
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }
      const json: ActiveCourseDto[] = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Test: Active Courses</h1>
        <button
          onClick={fetchData}
          className="px-3 py-2 rounded text-sm font-medium bg-slate-700 text-white hover:bg-cyan-700"
        >
          Reload
        </button>
      </div>

      {/* Status-rad */}
      {loading && <p className="text-gray-600">Loading…</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      {!loading && !error && data && data.length === 0 && (
        <p className="text-gray-600">No active courses.</p>
      )}

      {/* Raw JSON-debug */}
      <details className="border rounded p-3 bg-white">
        <summary className="cursor-pointer font-medium">Raw response (JSON)</summary>
        <pre className="mt-2 text-sm overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>

      {/* Renderad lista */}
      <ul className="space-y-3">
        {data?.map((c) => (
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
              <p className="text-sm text-gray-600 line-clamp-2">{c.description}</p>
              <div className="mt-2 text-xs text-gray-500 space-x-3">
                <span>Slug: {c.courseSlug}</span>
                <span>Level: {c.currentLevel}</span>
                <span>Status: {c.status}</span>
                <span>Started: {new Date(c.startedAt).toLocaleString("sv-SE")}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}