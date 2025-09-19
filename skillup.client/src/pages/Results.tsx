import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "../services/authService";

interface QuizQuestion {
    id: number;
    questionText: string;
    options: string[];
    answer: string;
}

interface Quiz {
    id: { timestamp: number; creationTime: string; };
    level: string;
    slug: string;
    questions: QuizQuestion[];
}

interface UserAnswer {
    questionId: number;
    answer: string;
}

export default function Results() {
    const { slug } = useParams<{ slug: string; }>();
    const [searchParams] = useSearchParams();
    const level = searchParams.get("level") || "";
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5178";

    const navigate = useNavigate();

    const [results, setResults] = useState<
        { question: string; userAnswer: string; correctAnswer: string; }[]
    >([]);
    const [showModal, setShowModal] = useState(false);

    const updateUserLevel = async (slug: string, level: string) => {
        // Here we should call endpoint to update users level

        // try {
        //     const res = await fetch(`${BASE_URL}/api/users/update-level`, {  <------ Something like this
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({ slug, level }),
        //     });
        //     if (!res.ok) throw new Error("Failed to update user progress");
        // } catch (err) {
        //     console.error("Error updating user level:", err);
        // }
    };

    useEffect(() => {
        if (!slug || !level) return;

        if (!authService.isLoggedIn()) {
            navigate("/account");
            return;
        }

        const loadResults = async () => {
            const stored = localStorage.getItem("quizAnswers");
            if (!stored) return;

            const userAnswers: UserAnswer[] = JSON.parse(stored);

            const res = await fetch(`${BASE_URL}/api/quiz/${slug}?level=${level}`);
            const quizzes: Quiz[] = await res.json();

            if (quizzes.length === 0) return;

            const combined = quizzes[0].questions.map((quiz, index) => {
                const userAnswer = userAnswers.find((ua) => ua.questionId === index);
                return {
                    question: quiz.questionText,
                    userAnswer: userAnswer ? userAnswer.answer : "—",
                    correctAnswer: quiz.answer,
                };
            });
            setResults(combined);
        };

        loadResults();
    }, [slug, level, BASE_URL]);

    const correctCount = results.filter(
        (r) => r.userAnswer === r.correctAnswer
    ).length;

    const percentage = results.length
        ? Math.round((correctCount / results.length) * 100)
        : 0;

    const unlocked = percentage >= 80;

    useEffect(() => {
        if (unlocked && slug && level) {
            setShowModal(true);
            updateUserLevel(slug, level);
        }
    }, [unlocked, slug, level]);

    const handleButtonClick = () => {
        if (unlocked) {
            // Here we should have the logic to get a name of a new level and navigate to it

            // const nextLevel = "Advanced"; ----> need to get next level somehow
            // navigate(`/quiz/${slug}?level=${nextLevel}`);
        } else {
            navigate(`/quiz/${slug}?level=${level}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6">

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-xl p-8 max-w-md text-center shadow-lg z-10"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-2xl font-bold mb-4 text-center ">
                                🎉 Congratulations, you did it! 🎉
                            </h2>
                            <p className="mb-4 text-center text-lg">
                                New level unlocked — one step closer to your certificate! 🏆
                            </p>
                            <button className="bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-800 transition transform hover:scale-105 mx-auto block"
                                onClick={() => setShowModal(false)}>
                                View Your Results
                            </button>

                        </motion.div>
                        <Confetti
                            recycle={showModal}
                            numberOfPieces={300}
                            className="-z-10"
                            colors={["#F87171", "#34D399", "#60A5FA", "#FBBF24", "#A78BFA"]} />
                    </motion.div>
                )}
            </AnimatePresence>

            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                Quiz Results</h1>

            {results.length > 0 && (
                <p className="text-center mb-4 text-lg font-semibold">
                    You got {correctCount}/{results.length} correct{" "}
                </p>
            )}

            {results.length > 0 ? (
                <>
                    <table className="w-full mb-6 rounded-xl">
                        <thead>
                            <tr className="bg-gray-200 rounded-xl">
                                <th className="border-4 border-white p-3 text-left rounded-l-xl">Question</th>
                                <th className="border-4 border-white p-3 text-left">Your Answer</th>
                                <th className="border-4 border-white p-3 text-left rounded-r-xl">Correct Answer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((res, idx) => {
                                const isCorrect = res.userAnswer === res.correctAnswer;
                                return (
                                    <tr
                                        key={idx}
                                        className={isCorrect ? "bg-green-100" : "bg-red-100"}
                                    >
                                        <td className="border-4 border-white p-3 rounded-l-xl">{res.question}</td>
                                        <td className="border-4 border-white p-3">{res.userAnswer}</td>
                                        <td className="border-4 border-white p-3 rounded-r-xl">{res.correctAnswer}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="text-center mt-4 mb-8">
                        <button
                            onClick={handleButtonClick}
                            className={`px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105 bg-cyan-700 text-white hover:bg-cyan-800`}
                        >
                            {unlocked ? "Next Level" : "Retry Quiz"}
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-center text-lg">No results found.</p>
            )}
        </div>
    );
}
