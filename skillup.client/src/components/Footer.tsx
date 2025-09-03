import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-slate-700 text-gray-200 p-3 mt-12">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} SkillUp. All rights reserved.
        </p>

        <div className="flex space-x-4 mt-2 md:mt-0">
          <Link to="/about" className="hover:text-teal-700 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-teal-700 transition">
            Contact
          </Link>
          <Link to="/privacy" className="hover:text-teal-700 transition">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
