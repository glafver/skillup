import { authService } from "./authService";
import type { CourseContent } from "./courseContentService";

const API = import.meta.env.VITE_API_URL ?? "";
const BASE = `${API}/api/admin`;

export type Course = {
  id?: string;
  title: string;
  description: string;
  image: string;
  slug: string;
  category?: string;
  levelCount: number;
};

export type QuizQuestion = {
  questionText: string;
  options: string[];
  answer: string;
};

export type Quiz = {
  id?: string;
  slug: string;
  level: string;
  questions: QuizQuestion[];
};

export type AdminUser = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  avatar?: string;
  role: string;
};

function authHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authService.getToken()}`,
  };
}

async function parse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      /* response had no JSON body */
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}

export const adminService = {
  listCourses: () => fetch(`${API}/api/course`).then(parse<Course[]>),

  listUsers: () => fetch(`${BASE}/users`, { headers: authHeaders() }).then(parse<AdminUser[]>),

  createCourse: (course: Course) =>
    fetch(`${BASE}/courses`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(course),
    }).then(parse<Course>),

  updateCourse: (id: string, course: Course) =>
    fetch(`${BASE}/courses/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(course),
    }).then(parse<Course>),

  deleteCourse: (id: string) =>
    fetch(`${BASE}/courses/${id}`, { method: "DELETE", headers: authHeaders() }).then(
      parse<{ message: string }>
    ),

  saveContent: (slug: string, content: CourseContent) =>
    fetch(`${BASE}/courses/${slug}/content`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(content),
    }).then(parse<CourseContent>),

  listQuizzes: (slug: string, level: string) =>
    fetch(`${API}/api/quiz/${encodeURIComponent(slug)}?level=${encodeURIComponent(level)}`).then(
      parse<Quiz[]>
    ),

  createQuiz: (quiz: Quiz) =>
    fetch(`${BASE}/quizzes`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(quiz),
    }).then(parse<Quiz>),

  updateQuiz: (id: string, quiz: Quiz) =>
    fetch(`${BASE}/quizzes/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(quiz),
    }).then(parse<Quiz>),

  deleteQuiz: (id: string) =>
    fetch(`${BASE}/quizzes/${id}`, { method: "DELETE", headers: authHeaders() }).then(
      parse<{ message: string }>
    ),

  seed: (force = false) =>
    fetch(`${BASE}/seed${force ? "?force=true" : ""}`, {
      method: "POST",
      headers: authHeaders(),
    }).then(parse<{ message: string }>),
};
