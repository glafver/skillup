import { useEffect, useState } from "react";
import { authService } from "../services/authService";
import type { LoginRequest } from "../services/authService";
import { useNavigate } from "react-router-dom";

export const LoginForm = ({ successMessage }: { successMessage?: string; }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [demoAccount, setDemoAccount] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Fill in the shared demo account so a visitor can just press "Login".
  useEffect(() => {
    let active = true;

    authService.getDemoAccount().then((account) => {
      if (!active || !account) return;
      setEmail((current) => current || account.email);
      setPassword((current) => current || account.password);
      setDemoAccount(true);
    });

    return () => {
      active = false;
    };
  }, []);

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
      className="max-w-md mx-auto bg-gray-200 p-8 rounded-lg shadow space-y-4"
    >
      {successMessage && (
        <p className="text-green-500 mb-2">{successMessage}</p>
      )}
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">Login successful!</p>}

      {demoAccount && (
        <p className="text-xs text-gray-600 bg-white border border-gray-300 rounded px-3 py-2">
          Demo account is filled in for you — just press <strong>Login</strong> to look
          around. Feel free to register your own account instead.
        </p>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full text-sm bg-white px-4 border py-2 rounded-md"
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
          className="w-full text-sm bg-white px-4 border py-2 rounded-md"
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
