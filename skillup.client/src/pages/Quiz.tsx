import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link } from "react-router-dom";

interface QuizQuestion {
    questionText: string;
    options: string[];
    answer: string;
}

interface Quiz {
    id?: string;
    level: string;
    questions: QuizQuestion[];
}
// Test with:
// http://localhost:5173/quiz/js_beginner

const Quiz: React.FC<{}> = () => {
    const { level } = useParams<{ level?: string; }>();
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [questionImages, setQuestionImages] = useState<string[]>([]);
    const [quizDone, setQuizDone] = useState(false);

    if (!level) {
        return <p>Level not specified</p>;
    }

    const robotImages = Array.from({ length: 20 }, (_, i) => `/quiz/robo-${i + 1}.png`);
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5178";

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/quiz?level=${level}`);
                if (!res.ok) throw new Error("Failed to fetch quiz");
                const data: Quiz[] = await res.json();
                if (data.length > 0) {
                    setQuestions(data[0].questions);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchQuiz();
    }, [level]);

    useEffect(() => {
        const shuffled = [...robotImages].sort(() => Math.random() - 0.5);
        setQuestionImages(shuffled.slice(0, questions.length));
    }, [questions]);

    const handleAnswer = (answer: string) => {
        const storedAnswers = JSON.parse(localStorage.getItem("quizAnswers") || "{}");
        storedAnswers[questions[currentIndex].questionText] = answer;
        localStorage.setItem("quizAnswers", JSON.stringify(storedAnswers));

        if (currentIndex === questions.length - 1) {
            setQuizDone(true);
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };

    if (questions.length === 0) return <p>Loading quiz...</p>;

    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="container mx-auto max-w-2xl px-4 mb-8">
            <div className="flex justify-center mb-6">
                <AnimatePresence mode="wait">
                    {questionImages.length > 0 && (
                        <motion.img
                            key={questionImages[currentIndex]}
                            src={questionImages[currentIndex]}
                            alt="Robot Illustration"
                            className="h-50 md:h-80 object-contain"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    )}
                </AnimatePresence>
            </div>

            <p className="mb-2 font-semibold text-cyan-700">
                Question {currentIndex + 1} of {questions.length}
            </p>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-12">
                <motion.div
                    className="bg-cyan-700 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>

            <h2 className="text-2xl h-20 font-semibold mb-6 text-center">
                {questions[currentIndex].questionText}
            </h2>

            <div className="grid grid-cols-2 gap-8">
                {questions[currentIndex].options.map((option, i) => (
                    <button
                        key={i}
                        onClick={() => handleAnswer(option)}
                        className="bg-gray-200 px-6 py-4 rounded-lg text-center hover:scale-105 hover:shadow-md transition-transform duration-300 ease-out"
                    >
                        {option}
                    </button>
                ))}
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
                            <p className="mb-6">
                                You have finished the quiz. Let's go to your results!
                            </p>
                            <Link to="/results">
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
