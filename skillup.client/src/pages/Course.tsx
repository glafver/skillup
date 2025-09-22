import { useEffect, useState } from "react";
import { CourseCard } from "../components/CourseCard";
import { motion, AnimatePresence } from "framer-motion";

export default function Course() {
    type Course = {
        title: string;
        description: string;
        image: string;
        slug: string;
    };

    const [course, setCourse] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalContent, setModalContent] = useState<{
        title: string;
        message: string;
        onClose?: () => void;
    } | null>(null);

    const openModal = (title: string, message: string, onClose?: () => void) => {
        setModalContent({ title, message, onClose });
    };

    const closeModal = () => {
        if (modalContent?.onClose) {
            modalContent.onClose();
        }
        setModalContent(null);
    };

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetch(`${API_URL}/api/course`)
            .then((res) => res.json())
            .then((data) => {
                setCourse(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching course:", err);
                setLoading(false);
            });
    }, []);

    if (loading)
        return (
            <div className="flex items-center justify-center mx-auto">
                <p className="text-xl ">Loading...</p>
            </div>
        );

    return (
        <>
            <motion.div className="container mx-auto px-8 lg:px-0 2xl:px-12 py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}>
                <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Courses Page</h1>

                <div className="max-w-8xl mx-auto space-y-4">
                    <ul className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {course.map((course, idx) => (
                            <li key={idx}>
                                <CourseCard
                                    title={course.title}
                                    description={course.description}
                                    image={course.image}
                                    slug={course.slug}
                                    openModal={openModal}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.div>
            <AnimatePresence>
                {modalContent && (
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
                            <h2 className="text-2xl font-bold mb-4">{modalContent.title}</h2>
                            <p className="mb-4 text-lg">{modalContent.message}</p>

                            <button
                                className="bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-800 transition transform hover:scale-105 mx-auto block"
                                onClick={closeModal}
                            >
                                OK
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}