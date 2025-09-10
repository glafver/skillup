import { useState } from "react";
import { authService } from "../services/authService";
import type { RegisterRequest } from "../services/authService";

interface RegisterFormProps {
  onRegisterSuccess: (message: string) => void;
}
export const RegisterForm = ({ onRegisterSuccess }: RegisterFormProps) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const data: RegisterRequest = { firstname, lastname, email, password };

    try {
      await authService.register(data);
      onRegisterSuccess("Registration successful! Please log in.");
      setSuccess(true);
      setFirstname("");
      setLastname("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 rounded-md">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && (
        <p className="text-green-500 mb-2">Registration successful!</p>
      )}

      <input
        type="text"
        placeholder="First Name"
        value={firstname}
        onChange={(e) => setFirstname(e.target.value)}
        required
        className="w-full mb-2 p-2 border rounded-md bg-white"
      />

      <input
        type="text"
        placeholder="Last Name"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
        required
        className="w-full mb-2 p-2 border rounded-md bg-white"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full mb-2 p-2 border rounded-md bg-white"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
        className="w-full mb-4 p-2 border rounded-md bg-white"
      />

      <button
        type="submit"
        className="w-full bg-cyan-700 hover:bg-teal-700 text-white p-2 rounded-md"
      >
        Register
      </button>
    </form>
  );
};
