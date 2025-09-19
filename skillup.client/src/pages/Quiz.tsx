import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";

interface QuizQuestion {
    id: number;
    questionText: string;
    options: string[];
    answer: string;
}

interface Quiz {
    id?: string;
    level: string;
    questions: QuizQuestion[];
}

interface ActiveCourse {
    courseSlug: string;
    currentLevel: string;
}

interface UserAnswer {
    questionId: number;
    answer: string;
}

const Quiz: React.FC = () => {
    const { slug } = useParams<{ slug: string; }>();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const level = searchParams.get("level");

    const navigate = useNavigate();

    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [questionImages, setQuestionImages] = useState<string[]>([]);
    const [quizDone, setQuizDone] = useState(false);
    const [activeCourses, setActiveCourses] = useState<ActiveCourse[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showHint, setShowHint] = useState(false);
    const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5178";
    const robotImages = Array.from({ length: 20 }, (_, i) => `/quiz/robo-${i + 1}.png`);

    useEffect(() => {
        if (!slug || !level) return;

        setLoading(true);
        setError(null);

        const fetchActiveCourses = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/courses/active`, {
                    headers: { Authorization: `Bearer ${authService.getToken()}` },
                });
                if (!res.ok) throw new Error(await res.text());
                const data: ActiveCourse[] = await res.json();
                setActiveCourses(data);
            } catch (e: any) {
                setError(e.message);
            }
        };

        const fetchQuiz = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/quiz/${slug}?level=${level}`);
                if (!res.ok) throw new Error("Failed to fetch quiz");
                const data: Quiz[] = await res.json();
                if (data.length > 0) setQuestions(data[0].questions);
            } catch (e: any) {
                setError(e.message);
            }
        };

        Promise.all([fetchActiveCourses(), fetchQuiz()]).finally(() => setLoading(false));

        return localStorage.removeItem("quizAnswers");

    }, [slug, level, BASE_URL]);

    useEffect(() => {
        if (!loading) {
            const activeCourse = activeCourses?.find(c => c.courseSlug === slug);
            if (!authService.isLoggedIn() || !activeCourse || activeCourse.currentLevel !== level) {
                navigate("/courses");
            }
        }
    }, [loading, activeCourses, level, slug, navigate]);

    useEffect(() => {
        if (questions.length > 0) {
            const shuffled = [...robotImages].sort(() => Math.random() - 0.5);
            setQuestionImages(shuffled.slice(0, questions.length));
        }
    }, [questions]);

    useEffect(() => {
        if (questions.length > 0) {
            const options = [...questions[currentIndex].options].sort(() => Math.random() - 0.5);
            setShuffledOptions(options);
        }
    }, [currentIndex, questions]);

    const handleAnswer = (answer: string) => {
        const storedAnswers: UserAnswer[] = JSON.parse(localStorage.getItem("quizAnswers") || "[]");
        storedAnswers.push({ questionId: currentIndex, answer });
        localStorage.setItem("quizAnswers", JSON.stringify(storedAnswers));

        setShowHint(false);

        if (currentIndex === questions.length - 1) {
            setQuizDone(true);
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center mx-auto">
                <p className="text-xl ">Loading quiz...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <p className="text-red-600">{error}</p>
                <button
                    className="px-5 py-2 rounded bg-cyan-700 text-white hover:bg-cyan-800 transform transition duration-300 hover:scale-105"
                    onClick={() => navigate("/courses")}
                >
                    Back to courses
                </button>
            </div>
        );
    }

    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="container mx-auto max-w-2xl px-4 mb-8 text-center">
            <div className="flex justify-center mb-6">
                <AnimatePresence mode="wait">
                    {questionImages.length > 0 && (
                        <motion.img
                            key={questionImages[currentIndex]}
                            src={questionImages[currentIndex]}
                            alt="Robot Illustration"
                            className="h-50 md:h-[30vh] object-contain"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    )}
                </AnimatePresence>
            </div>

            <h1 className="mb-2 text-2xl font-semibold text-cyan-700">
                <span className="capitalize">{slug}</span> – {level}
            </h1>
            <p className="mb-2 font-semibold text-cyan-700">
                Question {currentIndex + 1} of {questions.length}
            </p>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
                <motion.div
                    className="bg-cyan-700 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>

            <h2 className="text-xl h-10 font-semibold mb-6 text-center">
                {questions[currentIndex].questionText}
            </h2>

            <div className="grid grid-cols-2 gap-8">
                {shuffledOptions
                    .map((option, i) => {
                        const correctAnswer = questions[currentIndex].answer;
                        const isCorrect = option === correctAnswer;

                        return (
                            <button
                                key={i}
                                onClick={() => handleAnswer(option)}
                                className={`bg-gray-200 px-6 py-4 rounded-lg text-center hover:scale-105 hover:shadow-md transition-transform duration-300 ease-out
                            ${showHint && isCorrect ? "text-green-700 font-bold" : "bg-gray-200"}`}
                            >
                                {option}
                            </button>
                        );
                    })}
            </div>

            <div className="mt-8">
                <button
                    onClick={() => setShowHint(true)}
                    className="text-gray-500 px-4 py-2 rounded-lg font-semibold transition transform hover:scale-105"
                >
                    Show Hint
                </button>
            </div>

            <AnimatePresence>
                {quizDone && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-xl p-8 max-w-md text-center shadow-lg"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-2xl font-bold mb-4">🎉 Quiz Completed!</h2>
                            <p className="mb-6">You have finished the quiz. Let's go to your results!</p>
                            <Link to={`/quiz/${slug}/results?level=${level}`}>
                                <button className="bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-800 transition transform hover:scale-105">
                                    Go to Results
                                </button>
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Quiz;
