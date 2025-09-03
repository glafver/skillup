import { useState } from "react";
import { authService } from "../services/authService";
import type { LoginRequest } from "../services/authService";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const data: LoginRequest = { email, password };

    try {
      await authService.login(data);
      setSuccess(true);
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 rounded">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">Login successful!</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full mb-2 p-2 border rounded"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
        className="w-full mb-4 p-2 border rounded"
      />

      <button
        type="submit"
        className="w-full bg-slate-700 text-gray-200 p-2 rounded"
      >
        Login
      </button>
    </form>
  );
};
