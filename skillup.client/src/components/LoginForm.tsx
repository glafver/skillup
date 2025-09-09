import { useState } from "react";
import { authService } from "../services/authService";
import type { LoginRequest } from "../services/authService";
import { useNavigate } from "react-router-dom";

export const LoginForm = ({ successMessage }: { successMessage?: string; }) => {
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
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-gray-200 p-8 rounded-xl shadow space-y-4"
    >
      {successMessage && (
        <p className="text-green-500 mb-2">{successMessage}</p>
      )}
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">Login successful!</p>}

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full text-sm bg-white px-4 py-2 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full text-sm bg-white px-4 py-2 rounded-md"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-cyan-700 hover:bg-cyan-800 text-white p-2 mt-4 rounded-md"
      >
        Login
      </button>
    </form>
  );
};
