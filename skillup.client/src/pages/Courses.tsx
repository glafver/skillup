import { useEffect, useState } from "react";

export default function Courses() {
    const [courses, setCourses] = useState<string[]>([]);
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
        <div className="container mx-auto ">
            <h1 className="text-2xl mb-4 text-center">Courses Page</h1>

            <ul className="list-disc pl-6">
                {courses.map((course, idx) => (
                    <li key={idx}>{course}</li>
                ))}
            </ul>
        </div>
    );
}
