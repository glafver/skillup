import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const FAQItem = ({ question, answer }: { question: string; answer: string; }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="bg-gray-100 rounded-xl shadow">
            <button
                onClick={() => setOpen(!open)}
                className="flex justify-between items-center w-full px-6 py-4 text-left"
            >
                <span className="font-semibold text-lg">{question}</span>
                <FaChevronDown
                    className={`transition-transform duration-300 ${open ? "rotate-180" : ""
                        }`}
                />
            </button>
            {open && (
                <div className="px-6 pb-4 text-gray-700">
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
};

const FAQ = () => {
    const faqData = [
        {
            question: "🤔 What is SKILLUP?",
            answer:
                "SKILLUP is an interactive platform where you learn programming step by step. With theory, practice questions, and levels – learning feels more like a game than a boring course.",
        },
        {
            question: "📱 How do I use the app?",
            answer:
                "Create an account, pick a course, and start at level one. Complete lessons, answer questions, and unlock new levels as you progress. Certificates are awarded along the way.",
        },
        {
            question: "🎯 Do I need prior knowledge?",
            answer:
                "Not at all! SKILLUP is built for beginners and guides you step by step. If you already have some knowledge, you can jump into more advanced levels anytime.",
        },
        {
            question: "🏆 What makes SKILLUP different?",
            answer:
                "Unlike traditional courses, SKILLUP has an intuitive interface, clear questions, and a reward system that motivates you daily. Every completed level gives you a certificate you can proudly show off.",
        },
        {
            question: "📝 Do I need to be registered?",
            answer:
                "Yes, you need an account to save progress and earn certificates.",
        },
        {
            question: "📄 Where do I get my certificate after finishing a course?",
            answer:
                "All your certificates will appear in your profile once you complete a course.",
        },
        {
            question: "💰 Do I need to pay?",
            answer: "No, SKILLUP is completely free to use.",
        },
    ];

    return (
        <section className="container mx-auto px-6 py-12">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h1>
                <p className="text-md">
                    Here are some of the most common questions about SKILLUP and how to use the app.
                </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
                {faqData.map((item, index) => (
                    <FAQItem key={index} question={item.question} answer={item.answer} />
                ))}
            </div>
        </section>
    );
};

export default FAQ;
