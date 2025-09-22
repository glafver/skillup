import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import CertificateButton from "./CertificateButton";

type Props = { title: string; description: string; image: string; slug: string; openModal: (title: string, message: string, onClose?: () => void) => void; };

export const CourseCard = ({ title, description, image, slug, openModal }: Props) => {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [completed, setCompleted] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchStatus = async () => {
      if (!authService.isLoggedIn()) return;
      const res = await fetch(`${API}/api/course/${slug}/status`, {
        headers: { Authorization: `Bearer ${authService.getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setCompleted(data?.isCompleted);
        }
        setActive(Boolean(data.active));
      }
    };
    fetchStatus();

  }, [slug, API]);

  const handleClick = async () => {
    if (!authService.isLoggedIn()) {
      openModal("Login Required", "Please log in to start the course.", () => navigate("/account"));
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
      openModal(
        "Course Started",
        `You have started the ${slug.charAt(0).toUpperCase() + slug.slice(1)} course!`,
        () => navigate(`/course/${slug}`)
      );
    } else {
      const msg = await res.text();
      openModal("Error", msg || "Failed to start course.", () => navigate(`/course`));
    }
  };

  return (
    <div className="flex flex-col md:flex-row rounded-lg text-center md:text-left p-4 overflow-hidden bg-gray-100 h-full">
      <div className="flex-shrink-0 self-center">
        <img src={`/${image}`} alt={title} className="w-[150px] h-[150px] p-1 object-cover" />
      </div>

      <div className="flex-grow p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>

      {completed ? (
        <CertificateButton courseSlug={slug} />
      ) : (
        <button
          onClick={handleClick}
          className="flex-none self-center my-2 mx-4 px-4 py-2 rounded bg-cyan-700 text-white hover:bg-cyan-800 transition transform hover:scale-105"
        >
          {active ? "Resume" : "Start Course"}
        </button>
      )}
    </div>
  );
};
