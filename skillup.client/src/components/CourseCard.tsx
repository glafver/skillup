import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

type Props = { title: string; description: string; image: string; slug: string; };

export const CourseCard = ({ title, description, image, slug }: Props) => {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchStatus = async () => {
      if (!authService.isLoggedIn()) return;
      const res = await fetch(`${API}/api/course/${slug}/status`, {
        headers: { Authorization: `Bearer ${authService.getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setActive(Boolean(data.active));
      }
    };
    fetchStatus();
  }, [slug, API]);

  const handleClick = async () => {
    if (!authService.isLoggedIn()) {
      alert("Please log in to start the course.");
      navigate("/account");
      return;
    }

    if (active) {
      navigate(`/course/${slug}`);
      return;
    }
    const res = await fetch(`${API}/api/course/${slug}/started`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });

    if (res.ok) {
      setActive(true);
      alert("Course started!");
      navigate(`/course/${slug}`);
    } else {
      const msg = await res.text();
      alert(msg || "Failed to start course.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row rounded-lg text-center p-4 overflow-hidden bg-gray-100 h-full">
      <div className="flex-shrink-0 self-center">
        <img src={`/${image}`} alt={title} className="w-[150px] h-[150px] p-1 object-cover" />
      </div>

      <div className="flex-grow p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>

      <button
        onClick={handleClick}
        className="flex-none self-center my-2 mx-4 px-4 py-2 text-sm font-medium rounded bg-cyan-700 text-white hover:bg-cyan-800 transition transform hover:scale-105"
      >
        {active ? "Resume" : "Start Course"}
      </button>
    </div>
  );
};
