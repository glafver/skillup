import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseContent, type CourseContent } from "../services/courseContentService";
import LevelAccordion from "../components/LevelAccordion";

export default function CourseContentPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const quizSlugMap: Record<string, string> = {
  javascript: "js",   
  csharp: "csharp",
  python: "python",
  html: "html",
  };
  const [content, setContent] = useState<CourseContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    getCourseContent(slug)
      .then(setContent)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="max-w-3xl mx-auto p-6">Loading…</div>;
  if (error || !content) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-red-600">Could not load course.</p>
        <button className="text-blue-600 underline" onClick={() => navigate("/")}>Back</button>
      </div>
    );
  } 

  return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">{content.courseTitle}</h1>

<div className="text-left">
  {content.levels?.map((level, idx) => (
    <LevelAccordion
      key={level.name}
      title={level.name}
      defaultOpen={idx === 0}
      variant="level"
    >
  
      {level.topics ? (
        level.topics.map((topic, i) => (
          <LevelAccordion key={i} title={topic.title} variant="topic">
            <div className="whitespace-pre-wrap leading-relaxed">
              {topic.content}
            </div>

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
          {level.theoryText}
        </div>
      )}


      <div className="mt-4 flex items-center justify-end">
        <button
          className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transform transition duration-300 hover:scale-105 shadow-md"
          onClick={() =>
          navigate(`/quiz/${quizSlugMap[content.slug]}_${level.name.toLowerCase()}`)
}


        >
          Start quiz
        </button>
      </div>
    </LevelAccordion>
  ))}
</div>

<div className="mt-6">
  <button
  className="text-blue-600 underline"
  onClick={() => navigate("/")}>Back</button>
</div>
    </div>
  );
}
