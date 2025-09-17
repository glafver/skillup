const API = import.meta.env.VITE_API_URL ?? "http://localhost:5178";

export type CourseTopic = {
  title: string;
  content: string;
  imageUrl?: string;
};


export type CourseLevel = {
  name: string;
  theoryText?: string;
  topics?: CourseTopic[];
}

export type CourseContent = {
  id?: string;
  slug: string;
  courseTitle: string;
  levels?: CourseLevel[];
  theoryText: string;
};


export async function getCourseContent(slug: string): Promise<CourseContent> {
  const res = await fetch(`${API}/api/course-content/${encodeURIComponent(slug)}`);

  if (!res.ok) throw new Error(`Kunde inte hitta kursen: ${slug}`);

  return res.json();
}
