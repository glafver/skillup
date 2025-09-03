import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
    return (
        <nav className="bg-gray-200 px-6 mb-6">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <Link to="/">
                        <img
                            src="/logo_name.png"
                            alt="SkillUp Logo"
                            className="h-20 w-auto"
                        />
                    </Link>
                </div>

                <ul className="flex space-x-6">
                    <li>
                        <Link to="/about" className="hover:text-teal-700 transition">
                            About
                        </Link>
                    </li>
                    <li>
                        <Link to="/courses" className="hover:text-teal-700 transition">
                            Courses
                        </Link>
                    </li>
                    <li>
                        <Link to="/" className="hover:text-teal-700 transition">
                            Profile
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;