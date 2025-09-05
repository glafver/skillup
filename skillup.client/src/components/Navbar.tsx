import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useEffect, useState } from "react";

export function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(authService.isLoggedIn());

    useEffect(() => {
        setLoggedIn(authService.isLoggedIn());
    }, [location]);

    const handleLogout = () => {
        authService.logout();
        setLoggedIn(false);
        navigate("/");
    };

    const getLinkClasses = (path: string) =>
        `hover:text-teal-700 transition ${location.pathname === path ? "font-semibold" : ""}`;

    return (
        <nav className="bg-gray-200 p-6 mb-6">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <Link to="/">
                        <img
                            src="/logo-cyan-name.png"
                            alt="SkillUp Logo"
                            className="h-8 w-auto"
                        />
                    </Link>
                </div>

                <ul className="flex space-x-6">
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
            </div>
        </nav>
    );
}
