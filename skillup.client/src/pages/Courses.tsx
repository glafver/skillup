import { useEffect, useState } from "react";
import { CourseCard } from "../components/CourseCard";
import { motion } from "framer-motion";

export default function Courses() {
    type Course = {
        title: string;
        description: string;
        image: string;
        slug: string; // lägg till slug här så du slipper felet
    };

    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetch(`${API_URL}/api/courses`)
            .then((res) => res.json())
            .then((data) => {
                setCourses(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching courses:", err);
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
        <motion.div className="container mx-auto px-12 xl:px-12 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Courses Page</h1>

            <div className="max-w-8xl mx-auto space-y-4">
                <ul className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {courses.map((course, idx) => (
                        <li key={idx}>
                            <CourseCard
                                title={course.title}
                                description={course.description}
                                image={course.image}
                                slug={course.slug}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}
