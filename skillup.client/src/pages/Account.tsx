import { useState, useEffect } from "react";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(
    undefined
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isLoggedIn()) {
      navigate("/");
    }
  }, [navigate]);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
    setSuccessMessage(undefined);
  };

  return (
    <div className="w-md mx-auto mt-10 p-6">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 font-family-Roboto text-slate-700 text-center">
        {isLogin ? "Login" : "Register"}
      </h2>

      {isLogin ? (
        <LoginForm successMessage={successMessage} />
      ) : (
        <RegisterForm
          onRegisterSuccess={(message) => {
            setSuccessMessage(message);
            setIsLogin(true);
          }}
        />
      )}
      <div className="text-sm mt-4 ">
        {isLogin
          ? "Don't have an account?"
          : "Already have an account?"}
        <button
          onClick={toggleForm}
          className="ms-1 hover:text-cyan-800 transition font-semibold"
        >
          {isLogin
            ? "Register"
            : "Login"}
        </button>
      </div>
    </div>
  );
}
