import { useEffect, useState } from "react";
import { CourseCard } from "../components/CourseCard";

export default function Courses() {
    type Course = {
    title: string;
    description: string;
    imageUrl: string;
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

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl mb-4 text-center">Courses Page</h1>

            <div className="max-w-3xl mx-auto space-y-4">
                <ul className="flex flex-col gap-4">
                {courses.map((course, idx) => (
                    <li key={idx}>
                    <CourseCard
                        title={course.title}
                        description={course.description}
                        imageUrl={course.imageUrl}
                    />
                    </li>
                ))}
                </ul>
            </div>
        </div>
    );
}
