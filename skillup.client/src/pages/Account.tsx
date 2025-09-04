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
    setSuccessMessage(undefined); // reset message
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 font-family-Roboto text-slate-700 text-center">
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

      <button
        onClick={toggleForm}
        className="text-sm hover:text-teal-700 transition mt-4"
      >
        {isLogin
          ? "Don't have an account? Register"
          : "Already have an account? Login"}
      </button>
    </div>
  );
}
