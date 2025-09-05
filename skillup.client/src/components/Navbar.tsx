import { Link } from "react-router-dom";
import { authService } from "../services/authService";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export function Navbar() {
    const location = useLocation();
    const [loggedIn, setLoggedIn] = useState(authService.isLoggedIn());

    // Kör varje gång path ändras
    useEffect(() => {
        setLoggedIn(authService.isLoggedIn());
    }, [location]);

    const handleLogout = () => {
        authService.logout();
        setLoggedIn(false);
    };
    return (
        <nav className="bg-gray-200 px-6 mb-6">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <Link to="/">
                        <img
                            src="/logo_name.png"
                            alt="SkillUp Logo"
                            className="h-15 w-auto"
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
                    {loggedIn ? (
                        <>
                            <li>
                                <Link to="/profile" className="hover:text-teal-700 transition">
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
                            <Link to="/account" className="hover:text-teal-700 transition">
                                Log in
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}
