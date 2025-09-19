import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-slate-800 text-gray-200 py-6 p-2">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left items-center">
        <div>
          <img
            src="/logo-gray-name.png"
            alt="SkillUp Logo"
            className="h-8 mx-auto md:mx-0"
          />
        </div>

        <div className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} SKILLUP. All rights reserved.
        </div>

        <div className="flex justify-center md:justify-end space-x-6 text-sm font-medium">
          <Link to="/about" className="hover:text-cyan-800 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-cyan-800 transition">
            Contact
          </Link>
          <Link to="/faq" className="hover:text-cyan-800 transition">
            FAQ
          </Link>
        </div>
      </div>
    </footer>
  );
}
