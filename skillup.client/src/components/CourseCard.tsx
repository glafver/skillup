import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

const imageMap = import.meta.glob("../images/*", { eager: true, as: "url" }) as Record<string, string>;



export const CourseCard = ({title, description, imageUrl}: {title: string, description: string, imageUrl: string}) => {
    const navigate = useNavigate();
  
    const src = useMemo(() => {
      
    return imageMap[`../images/${imageUrl}`];
  }, [imageUrl]);

    const titleToSlug: Record<string, string> = {
    "C#": "csharp",
    "Python": "python",
    "JavaScript": "javascript",
    "HTML": "html"
  }

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
      <button 
        onClick={() => {
          const slug = titleToSlug[title];
          if (slug) {
            navigate(`/courses/${slug}`);
          }
        }}
        className="flex-none self-center my-2 mx-4 px-4 py-2 text-sm font-medium rounded bg-cyan-700 text-white hover:bg-teal-700 transition transform hover:scale-105">
        Start Course
      </button>
    </div>
  );
};