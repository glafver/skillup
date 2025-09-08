import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export const Button = ({ children, className = "", ...props }: Props) => {
  return (
    <button
      {...props}
      className={`
        flex-none self-center
        my-2
        px-4 py-2 text-sm font-medium
        rounded bg-cyan-700 text-white
        hover:bg-cyan-800 transition-colors duration-200
        ${className}
      `}
    >
      {children}
    </button>
  );
};
