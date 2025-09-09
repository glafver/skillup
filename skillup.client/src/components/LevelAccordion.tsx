import { useState } from "react";

type Props = {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export default function LevelAccordion({ title, defaultOpen, children }: Props) {
  const [open, setOpen] = useState(!!defaultOpen);

  return (
    <div className="border rounded-lg mb-3">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={() => setOpen(o => !o)}
      >
        <span className="font-semibold">{title}</span>
        <span>{open ? "−" : "+"}</span>
      </button>

      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}
