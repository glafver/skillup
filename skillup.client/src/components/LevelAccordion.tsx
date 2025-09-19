import { useState } from "react";

type Props = {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  variant?: "level" | "topic";
};

export default function LevelAccordion({ title, defaultOpen, children, variant = "level" }: Props) {
  const [open, setOpen] = useState(!!defaultOpen);

  return (
    <div
      className={`group border rounded-lg mb-3 transition-all duration-200 
            ${open ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white hover:bg-blue-50"} 
            hover:shadow-lg hover:shadow-blue-100 hover:border-2`}
      >
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left 
                   transition duration-200"
        onClick={() => setOpen((o) => !o)}
      >
        <span
          className={`${variant === "level" ? "font-bold text-lg" : "font-medium"} text-black`}
        >
          {title}
        </span>
        <span
          className={`transform transition-transform duration-300 
            ${open ? "rotate-180" : "rotate-0"} text-black`}
        >
          ▼
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out`}
        style={{
          maxHeight: open ? "1000px" : "0px",
          opacity: open ? 1 : 0,
        }}
      >
<div className="px-4 pb-4">{children}</div>

</div>
    </div>
  );
}
