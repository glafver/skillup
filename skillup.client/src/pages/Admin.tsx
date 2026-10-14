import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import {
  adminService,
  type AdminUser,
  type Course,
  type Quiz,
  type QuizQuestion,
} from "../services/adminService";
import {
  getCourseContent,
  type CourseContent,
  type CourseLevel,
  type CourseTopic,
} from "../services/courseContentService";
import { exampleImageGroups, exampleImagePath, courseImageOptions } from "../data/exampleImages";

const LEVELS = ["Beginner", "Advanced", "Expert"];

const inputClass = "w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white";
const primaryClass = "px-4 py-2 rounded bg-cyan-700 text-white text-sm hover:bg-cyan-800 disabled:opacity-50";
const secondaryClass = "px-4 py-2 rounded bg-gray-700 text-white text-sm hover:bg-gray-800 disabled:opacity-50";
const ghostClass = "px-3 py-1 rounded border border-gray-300 text-xs hover:bg-gray-100";
const dangerClass = "px-3 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700";

const emptyCourse = (): Course => ({
  title: "",
  description: "",
  image: "/python.png",
  slug: "",
  category: "Programming",
  levelCount: 3,
});

const emptyQuestion = (): QuizQuestion => ({ questionText: "", options: ["", ""], answer: "" });

const emptyQuiz = (slug: string, level: string): Quiz => ({
  slug,
  level,
  questions: [emptyQuestion()],
});

type Tab = "courses" | "content" | "quizzes" | "users";

const TABS: { id: Tab; label: string }[] = [
  { id: "courses", label: "Courses" },
  { id: "content", label: "Content" },
  { id: "quizzes", label: "Quizzes" },
  { id: "users", label: "Users" },
];

type TabProps = {
  courses: Course[];
  onNotice: (message: string) => void;
  onError: (message: string) => void;
};

export default function Admin() {
  const navigate = useNavigate();
  const allowed = authService.isAdmin();
  const [tab, setTab] = useState<Tab>("courses");
  const [courses, setCourses] = useState<Course[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reloadCourses = useCallback(() => {
    adminService
      .listCourses()
      .then(setCourses)
      .catch((e) => setError((e as Error).message));
  }, []);

  useEffect(() => {
    if (allowed) {
      reloadCourses();
    } else {
      navigate("/");
    }
  }, [allowed, navigate, reloadCourses]);

  if (!allowed) return null;

  return (
    <div className="container mx-auto p-6 max-w-5xl text-left">
      <h1 className="text-3xl font-bold mb-1">Admin</h1>
      <p className="text-gray-600 mb-6">Manage courses, learning content and quizzes.</p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setTab(item.id);
              setNotice(null);
              setError(null);
            }}
            className={
              tab === item.id
                ? "px-4 py-2 rounded bg-cyan-700 text-white text-sm"
                : "px-4 py-2 rounded border border-gray-300 text-sm hover:bg-gray-100"
            }
          >
            {item.label}
          </button>
        ))}
      </div>

      {notice && (
        <div className="mb-4 rounded border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-800">
          {notice}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-800">
          {error}
        </div>
      )}

      {tab === "courses" && (
        <CoursesTab courses={courses} reload={reloadCourses} onNotice={setNotice} onError={setError} />
      )}
      {tab === "content" && <ContentTab courses={courses} onNotice={setNotice} onError={setError} />}
      {tab === "quizzes" && <QuizzesTab courses={courses} onNotice={setNotice} onError={setError} />}
      {tab === "users" && <UsersTab onError={setError} />}
    </div>
  );
}

function CoursesTab({ courses, reload, onNotice, onError }: TabProps & { reload: () => void }) {
  const [draft, setDraft] = useState<Course | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!draft) return;
    setBusy(true);
    try {
      if (draft.id) {
        await adminService.updateCourse(draft.id, draft);
        onNotice(`Course "${draft.title}" updated.`);
      } else {
        await adminService.createCourse(draft);
        onNotice(`Course "${draft.title}" created.`);
      }
      setDraft(null);
      reload();
    } catch (e) {
      onError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (course: Course) => {
    if (!course.id) return;
    if (!window.confirm(`Delete "${course.title}" together with its content and quizzes?`)) return;
    try {
      await adminService.deleteCourse(course.id);
      onNotice(`Course "${course.title}" deleted.`);
      reload();
    } catch (e) {
      onError((e as Error).message);
    }
  };

  const runSeed = async (force: boolean) => {
    if (
      force &&
      !window.confirm(
        "Overwrite the starter courses and their quizzes with the sample data? Your changes to those items will be lost."
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      const result = await adminService.seed(force);
      onNotice(result.message);
      reload();
    } catch (e) {
      onError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        <button className={primaryClass} onClick={() => setDraft(emptyCourse())}>
          New course
        </button>
        <button className={secondaryClass} onClick={() => runSeed(false)} disabled={busy}>
          Load starter courses
        </button>
        <button className={secondaryClass} onClick={() => runSeed(true)} disabled={busy}>
          Reset starter content
        </button>
      </div>

      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-3 py-2">Title</th>
            <th className="text-left px-3 py-2">Slug</th>
            <th className="text-left px-3 py-2">Category</th>
            <th className="text-left px-3 py-2">Levels</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.slug} className="border-t">
              <td className="px-3 py-2">{course.title}</td>
              <td className="px-3 py-2 font-mono text-xs">{course.slug}</td>
              <td className="px-3 py-2">{course.category}</td>
              <td className="px-3 py-2">{course.levelCount}</td>
              <td className="px-3 py-2 text-right whitespace-nowrap">
                <button className={ghostClass} onClick={() => setDraft({ ...course })}>
                  Edit
                </button>
                <button className={`${dangerClass} ml-2`} onClick={() => remove(course)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {courses.length === 0 && (
            <tr>
              <td className="px-3 py-4 text-gray-500" colSpan={5}>
                No courses yet. Create one, or click "Load starter courses".
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {draft && (
        <div className="mt-6 border rounded p-4 bg-gray-50">
          <h2 className="font-semibold mb-3">{draft.id ? "Edit course" : "New course"}</h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              Title
              <input
                className={inputClass}
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Slug (optional)
              <input
                className={inputClass}
                placeholder="generated from the title"
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Card image (file name from the public folder)
              <input
                className={inputClass}
                list="course-images"
                placeholder="html.png"
                value={draft.image}
                onChange={(e) => setDraft({ ...draft, image: e.target.value })}
              />
              <datalist id="course-images">
                {courseImageOptions.map((file) => (
                  <option key={file} value={file} />
                ))}
              </datalist>
            </label>
            <label className="text-sm">
              Category
              <input
                className={inputClass}
                value={draft.category ?? ""}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Number of levels
              <input
                type="number"
                min={1}
                max={5}
                className={inputClass}
                value={draft.levelCount}
                onChange={(e) => setDraft({ ...draft, levelCount: Number(e.target.value) })}
              />
            </label>
          </div>

          <label className="text-sm block mt-3">
            Description
            <textarea
              className={inputClass}
              rows={3}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </label>

          <div className="mt-4 flex gap-2">
            <button className={primaryClass} onClick={save} disabled={busy || !draft.title}>
              Save
            </button>
            <button className={ghostClass} onClick={() => setDraft(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ContentTab({ courses, onNotice, onError }: TabProps) {
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState<CourseContent | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!slug) {
      setContent(null);
      return;
    }

    const course = courses.find((c) => c.slug === slug);
    getCourseContent(slug)
      .then(setContent)
      .catch(() =>
        setContent({
          slug,
          courseTitle: course?.title ?? slug,
          theoryText: "",
          levels: [],
        })
      );
  }, [slug, courses]);

  const levels = content?.levels ?? [];

  const setLevels = (next: CourseLevel[]) => {
    if (content) setContent({ ...content, levels: next });
  };

  const patchLevel = (index: number, patch: Partial<CourseLevel>) =>
    setLevels(levels.map((level, i) => (i === index ? { ...level, ...patch } : level)));

  const addLevel = () => {
    if (!content) return;
    const name = LEVELS[Math.min(levels.length, LEVELS.length - 1)];
    setLevels([...levels, { name, theoryText: "", topics: [] }]);
  };

  const addTopic = (levelIndex: number) => {
    const topics = [
      ...(levels[levelIndex].topics ?? []),
      { title: "", content: "", imageUrl: exampleImagePath("basichtml") },
    ];
    patchLevel(levelIndex, { topics });
  };

  const patchTopic = (levelIndex: number, topicIndex: number, patch: Partial<CourseTopic>) => {
    const topics = (levels[levelIndex].topics ?? []).map((topic, i) =>
      i === topicIndex ? { ...topic, ...patch } : topic
    );
    patchLevel(levelIndex, { topics });
  };

  const removeTopic = (levelIndex: number, topicIndex: number) => {
    const topics = (levels[levelIndex].topics ?? []).filter((_, i) => i !== topicIndex);
    patchLevel(levelIndex, { topics });
  };

  const removeLevel = (levelIndex: number) => setLevels(levels.filter((_, i) => i !== levelIndex));

  const save = async () => {
    if (!content) return;
    setBusy(true);
    try {
      await adminService.saveContent(content.slug, content);
      onNotice(`Content for "${content.slug}" saved.`);
    } catch (e) {
      onError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <label className="text-sm block mb-4 max-w-sm">
        Course
        <select className={inputClass} value={slug} onChange={(e) => setSlug(e.target.value)}>
          <option value="">Select a course…</option>
          {courses.map((course) => (
            <option key={course.slug} value={course.slug}>
              {course.title} ({course.slug})
            </option>
          ))}
        </select>
      </label>

      {!slug && <p className="text-gray-500 text-sm">Pick a course to edit its levels and topics.</p>}

      {content && (
        <div>
          <label className="text-sm block mb-4 max-w-lg">
            Course title shown on the lesson page
            <input
              className={inputClass}
              value={content.courseTitle}
              onChange={(e) => setContent({ ...content, courseTitle: e.target.value })}
            />
          </label>

          {levels.map((level, levelIndex) => (
            <div key={levelIndex} className="border rounded p-4 mb-4 bg-gray-50">
              <div className="flex gap-3 items-end flex-wrap">
                <label className="text-sm">
                  Level name
                  <select
                    className={inputClass}
                    value={level.name}
                    onChange={(e) => patchLevel(levelIndex, { name: e.target.value })}
                  >
                    {LEVELS.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm flex items-center gap-2 pb-2">
                  <input
                    type="checkbox"
                    checked={!!level.isLocked}
                    onChange={(e) => patchLevel(levelIndex, { isLocked: e.target.checked })}
                  />
                  Locked
                </label>
                <button className={`${dangerClass} mb-2`} onClick={() => removeLevel(levelIndex)}>
                  Remove level
                </button>
              </div>

              <label className="text-sm block mt-3">
                Theory text (used when the level has no topics)
                <textarea
                  className={inputClass}
                  rows={2}
                  value={level.theoryText ?? ""}
                  onChange={(e) => patchLevel(levelIndex, { theoryText: e.target.value })}
                />
              </label>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">Topics</h3>
                  <button className={ghostClass} onClick={() => addTopic(levelIndex)}>
                    Add topic
                  </button>
                </div>

                {(level.topics ?? []).map((topic, topicIndex) => (
                  <div key={topicIndex} className="border-t pt-3 mt-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="text-sm">
                        Title
                        <input
                          className={inputClass}
                          value={topic.title}
                          onChange={(e) => patchTopic(levelIndex, topicIndex, { title: e.target.value })}
                        />
                      </label>
                      <label className="text-sm">
                        Illustration
                        <select
                          className={inputClass}
                          value={topic.imageUrl ?? ""}
                          onChange={(e) => patchTopic(levelIndex, topicIndex, { imageUrl: e.target.value })}
                        >
                          <option value="">No image</option>
                          {exampleImageGroups.map((group) => (
                            <optgroup key={group.group} label={group.group}>
                              {group.files.map((file) => (
                                <option key={file} value={exampleImagePath(file)}>
                                  {file}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </label>
                    </div>
                    <label className="text-sm block mt-3">
                      Content
                      <textarea
                        className={inputClass}
                        rows={3}
                        value={topic.content}
                        onChange={(e) => patchTopic(levelIndex, topicIndex, { content: e.target.value })}
                      />
                    </label>
                    <button
                      className={`${dangerClass} mt-2`}
                      onClick={() => removeTopic(levelIndex, topicIndex)}
                    >
                      Remove topic
                    </button>
                  </div>
                ))}

                {(level.topics ?? []).length === 0 && (
                  <p className="text-xs text-gray-500">
                    No topics — the lesson page will show the theory text instead.
                  </p>
                )}
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            <button className={primaryClass} onClick={save} disabled={busy}>
              Save content
            </button>
            <button className={ghostClass} onClick={addLevel}>
              Add level
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function QuizzesTab({ courses, onNotice, onError }: TabProps) {
  const [slug, setSlug] = useState("");
  const [level, setLevel] = useState(LEVELS[0]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [draft, setDraft] = useState<Quiz | null>(null);
  const [busy, setBusy] = useState(false);

  const reload = useCallback(() => {
    if (!slug) {
      setQuizzes([]);
      return;
    }
    adminService
      .listQuizzes(slug, level)
      .then(setQuizzes)
      .catch((e) => onError((e as Error).message));
  }, [slug, level, onError]);

  useEffect(() => {
    reload();
  }, [reload]);

  const patchQuestion = (index: number, patch: Partial<QuizQuestion>) => {
    if (!draft) return;
    setDraft({
      ...draft,
      questions: draft.questions.map((question, i) => (i === index ? { ...question, ...patch } : question)),
    });
  };

  const save = async () => {
    if (!draft) return;
    setBusy(true);
    try {
      if (draft.id) {
        await adminService.updateQuiz(draft.id, draft);
        onNotice(`Quiz for ${draft.slug} (${draft.level}) updated.`);
      } else {
        await adminService.createQuiz(draft);
        onNotice(`Quiz for ${draft.slug} (${draft.level}) created.`);
      }
      setDraft(null);
      reload();
    } catch (e) {
      onError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (quiz: Quiz) => {
    if (!quiz.id) return;
    if (!window.confirm(`Delete the quiz for ${quiz.slug} (${quiz.level})?`)) return;
    try {
      await adminService.deleteQuiz(quiz.id);
      onNotice("Quiz deleted.");
      reload();
    } catch (e) {
      onError((e as Error).message);
    }
  };

  return (
    <div>
      <div className="flex gap-3 mb-4 flex-wrap">
        <label className="text-sm max-w-xs">
          Course
          <select className={inputClass} value={slug} onChange={(e) => setSlug(e.target.value)}>
            <option value="">Select a course…</option>
            {courses.map((course) => (
              <option key={course.slug} value={course.slug}>
                {course.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm max-w-xs">
          Level
          <select className={inputClass} value={level} onChange={(e) => setLevel(e.target.value)}>
            {LEVELS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <button
          className={`${primaryClass} self-end`}
          disabled={!slug}
          onClick={() => setDraft(emptyQuiz(slug, level))}
        >
          New quiz
        </button>
      </div>

      {slug && (
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-3 py-2">Level</th>
              <th className="text-left px-3 py-2">Questions</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr key={quiz.id} className="border-t">
                <td className="px-3 py-2">{quiz.level}</td>
                <td className="px-3 py-2">{quiz.questions.length}</td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  <button
                    className={ghostClass}
                    onClick={() =>
                      setDraft({
                        ...quiz,
                        questions: quiz.questions.map((q) => ({ ...q, options: [...q.options] })),
                      })
                    }
                  >
                    Edit
                  </button>
                  <button className={`${dangerClass} ml-2`} onClick={() => remove(quiz)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {quizzes.length === 0 && (
              <tr>
                <td className="px-3 py-4 text-gray-500" colSpan={3}>
                  No quiz for this course and level yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {draft && (
        <div className="mt-6 border rounded p-4 bg-gray-50">
          <h2 className="font-semibold mb-3">
            {draft.id ? "Edit quiz" : "New quiz"} — {draft.slug} / {draft.level}
          </h2>

          {draft.questions.map((question, index) => (
            <div key={index} className="border-t pt-3 mt-3">
              <label className="text-sm block">
                Question {index + 1}
                <input
                  className={inputClass}
                  value={question.questionText}
                  onChange={(e) => patchQuestion(index, { questionText: e.target.value })}
                />
              </label>

              <div className="mt-2">
                <span className="text-xs text-gray-600">Options</span>
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex gap-2 mt-1">
                    <input
                      className={inputClass}
                      value={option}
                      onChange={(e) =>
                        patchQuestion(index, {
                          options: question.options.map((o, i) => (i === optionIndex ? e.target.value : o)),
                        })
                      }
                    />
                    <button
                      className={ghostClass}
                      onClick={() =>
                        patchQuestion(index, {
                          options: question.options.filter((_, i) => i !== optionIndex),
                        })
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  className={`${ghostClass} mt-2`}
                  onClick={() => patchQuestion(index, { options: [...question.options, ""] })}
                >
                  Add option
                </button>
              </div>

              <label className="text-sm block mt-3">
                Correct answer
                <select
                  className={inputClass}
                  value={question.answer}
                  onChange={(e) => patchQuestion(index, { answer: e.target.value })}
                >
                  <option value="">Select the correct option…</option>
                  {question.options
                    .filter((option) => option.trim() !== "")
                    .map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              </label>

              <button
                className={`${dangerClass} mt-2`}
                onClick={() =>
                  setDraft({
                    ...draft,
                    questions: draft.questions.filter((_, i) => i !== index),
                  })
                }
              >
                Remove question
              </button>
            </div>
          ))}

          <div className="mt-4 flex gap-2">
            <button
              className={ghostClass}
              onClick={() => setDraft({ ...draft, questions: [...draft.questions, emptyQuestion()] })}
            >
              Add question
            </button>
            <button className={primaryClass} onClick={save} disabled={busy}>
              Save quiz
            </button>
            <button className={ghostClass} onClick={() => setDraft(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function UsersTab({ onError }: { onError: (message: string) => void }) {
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    adminService
      .listUsers()
      .then(setUsers)
      .catch((e) => onError((e as Error).message));
  }, [onError]);

  return (
    <table className="w-full text-sm border">
      <thead className="bg-gray-100">
        <tr>
          <th className="text-left px-3 py-2">Name</th>
          <th className="text-left px-3 py-2">Email</th>
          <th className="text-left px-3 py-2">Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-t">
            <td className="px-3 py-2">
              {user.firstname} {user.lastname}
            </td>
            <td className="px-3 py-2">{user.email}</td>
            <td className="px-3 py-2">
              <span
                className={
                  user.role === "Admin"
                    ? "px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 text-xs"
                    : "px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs"
                }
              >
                {user.role}
              </span>
            </td>
          </tr>
        ))}
        {users.length === 0 && (
          <tr>
            <td className="px-3 py-4 text-gray-500" colSpan={3}>
              No users yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
