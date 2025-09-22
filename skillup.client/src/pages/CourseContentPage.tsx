import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseContent, type CourseContent } from "../services/courseContentService";
import LevelAccordion from "../components/LevelAccordion";
import type { ActiveCourse } from "../services/profileService";
import { authService } from "../services/authService";

export default function CourseContentPage() {
  const { slug } = useParams<{ slug: string; }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<CourseContent | null>(null);
  const [activeCourses, setActiveCourses] = useState<ActiveCourse[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!slug) return;

    localStorage.removeItem("quizAnswers");

    setLoading(true);
    setError(null);

    const fetchContent = async () => {
      try {
        const courseContent = await getCourseContent(slug);
        setContent(courseContent);
      } catch (e: any) {
        setError(e.message);
      }
    };

    const fetchActiveCourses = async () => {
      try {
        const res = await fetch(`${API}/api/course/active`, {
          headers: { Authorization: `Bearer ${authService.getToken()}` },
        });
        if (!res.ok) throw new Error(await res.text());
        const json: ActiveCourse[] = await res.json();
        setActiveCourses(json);
      } catch (e: any) {
        setError(e.message);
      }
    };

    Promise.all([fetchContent(), fetchActiveCourses()]).finally(() => setLoading(false));
  }, [slug, API]);

  const activeCourse = activeCourses?.find((ac) => ac.courseSlug === slug);
  const currentLevel = content?.levels?.find((level) => level.name === activeCourse?.currentLevel);

  useEffect(() => {
    if (!loading) {
      if (!authService.isLoggedIn() || !activeCourse || !currentLevel) {
        navigate("/course");
      }
    }
  }, [loading, activeCourse, currentLevel, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center mx-auto">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-red-600">{error}</p>
        <button
          className="px-5 py-2 rounded bg-cyan-700 text-white hover:bg-cyan-800 transform transition duration-300 hover:scale-105"
          onClick={() => navigate("/course")}
        >
          Back to courses
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-12  text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">{content?.courseTitle} - {currentLevel?.name}</h1>

      <div className="text-left">
        {currentLevel?.topics ? (
          currentLevel.topics.map((topic, i) => (
            <LevelAccordion key={i} title={topic.title} defaultOpen={i === 0} variant="topic">
              <div className="whitespace-pre-wrap leading-relaxed">{topic.content}</div>
              {topic.imageUrl && (
                <img
                  src={topic.imageUrl}
                  alt={topic.title + " example"}
                  className="mt-3 rounded-lg shadow-md max-w-xs mx-left"
                />
              )}
            </LevelAccordion>
          ))
        ) : (
          <div className="bg-gray-50 border rounded p-4 whitespace-pre-wrap leading-relaxed">
            {currentLevel?.theoryText}
          </div>
        )}
        <div className="mt-4 flex items-center justify-center">
          <button
            className="px-5 py-2 rounded bg-cyan-700 text-white hover:bg-cyan-800 transform transition duration-300 hover:scale-105"
            onClick={() => navigate(`/quiz/${content?.slug}?level=${currentLevel?.name}`)}
          >
            Start quiz
          </button>
        </div>
      </div>
    </div>
  );
}
