import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

type Props = {
  title: string;
  description: string;
  image: string;
  slug: string;
};

export const CourseCard = ({ title, description, image, slug }: Props) => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const startCourse = async () => {
    if (!authService.isLoggedIn()) {
      alert("Please log in to start the course.");
      navigate("/account");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/courses/${slug}/started`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getToken()}`,
        },
      });

      if (res.ok) {
        alert("Course started!");
        navigate(`/course/${slug}`);
        return;
      }

      const text = await res.text();
      alert(text || "Failed to start course.");
    } catch (err) {
      console.error(err);
      alert("Network error.");
    }
  };


  return (
    // Cards vertikalt
    
    // <div className="flex flex-col border items-center">
    //   <div className="w-[300px] h-[300px] bg-white rounded overflow-hidden">
    //     <img
    //       src={src }alt={title} className="w-full h-full object-cover"
    //     />
    //   </div>
    //   <h3 className="text-lg font-semibold">{title}</h3>
    //   <p className="text-gray-600">{description}</p>
    // </div>

    //Cards horisontalt

    <div className="flex border rounded overflow-hidden">
      <div className=" flex-shrink-0">
        <img
          src={src}
          alt={title}
          className="w-[100px] h-[100px] object-cover"
        />
      </div>
      <div className="flex-grow p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      <button className="flex-none self-center my-2 mx-4 px-4 py-2 text-sm font-medium rounded bg-cyan-700 text-white hover:bg-teal-700 transition transform hover:scale-105">
        Start Course
      </button>
    </div>
  );
};