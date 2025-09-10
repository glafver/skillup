import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export const CourseCard = ({title, description, image, slug}: {title: string, description: string, image: string, slug: string}) => {
  const navigate = useNavigate();

  const startCourse = () => {
    if (!authService.isLoggedIn()) {
      alert("Please log in to start the course.");
      navigate("/account");
      return;
    }

    navigate(`/courses/${slug}`);
  };

  return (

    <div className="flex rounded overflow-hidden bg-gray-100">
      <div className=" flex-shrink-0">
        <img
          src={`/${image}`}
          alt={title}
          className="w-[150px] h-[150px] p-1 object-cover"
        />
      </div>
      <div className="flex-grow p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      <button onClick={startCourse} className="flex-none self-center my-2 mx-4 px-4 py-2 text-sm font-medium rounded bg-cyan-700 text-white hover:bg-teal-700 transition transform hover:scale-105">
        Start Course
      </button>
    </div>
  );
};