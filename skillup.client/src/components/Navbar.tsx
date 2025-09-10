import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // ✅ react-icons

export function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(authService.isLoggedIn());
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setLoggedIn(authService.isLoggedIn());
    }, [location]);

    const handleLogout = () => {
        authService.logout();
        setLoggedIn(false);
        navigate("/");
        setMenuOpen(false);
    };

    const getLinkClasses = (path: string) =>
        `hover:text-teal-700 transition block py-2 md:py-0 ${location.pathname === path ? "font-semibold" : ""
        }`;

    return (
        <nav className="bg-gray-200 p-4 md:p-6 mb-6">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" onClick={() => setMenuOpen(false)}>
                    <img
                        src="/logo-cyan-name.png"
                        alt="SkillUp Logo"
                        className="h-8 w-auto"
                    />
                </Link>

                <ul className="hidden md:flex space-x-6">
                    <li>
                        <Link to="/about" className={getLinkClasses("/about")}>
                            About
                        </Link>
                    </li>
                    <li>
                        <Link to="/courses" className={getLinkClasses("/courses")}>
                            Courses
                        </Link>
                    </li>
                    {loggedIn ? (
                        <>
                            <li>
                                <Link to="/profile" className={getLinkClasses("/profile")}>
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="hover:text-red-600 transition"
                                >
                                    Log out
                                </button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to="/account" className={getLinkClasses("/account")}>
                                Log in
                            </Link>
                        </li>
                    )}
                </ul>

                <button
                    className="md:hidden p-2"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {menuOpen && (
                <div className="md:hidden mt-4 bg-white rounded-md shadow p-4">
                    <ul className="">
                        <li>
                            <Link
                                to="/about"
                                className={getLinkClasses("/about")}
                                onClick={() => setMenuOpen(false)}
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/courses"
                                className={getLinkClasses("/courses")}
                                onClick={() => setMenuOpen(false)}
                            >
                                Courses
                            </Link>
                        </li>
                        {loggedIn ? (
                            <>
                                <li>
                                    <Link
                                        to="/profile"
                                        className={getLinkClasses("/profile")}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="hover:text-red-600 transition"
                                    >
                                        Log out
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li>
                                <Link
                                    to="/account"
                                    className={getLinkClasses("/account")}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Log in
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </nav>
    );
}
