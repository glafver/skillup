import { useState } from "react";
import { authService } from "../services/authService";
import type { RegisterRequest } from "../services/authService";
import { avatars } from "../helpers/avatars";
import { motion, AnimatePresence } from "framer-motion";

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
  const [avatar, setAvatar] = useState(avatars[0]);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const data: RegisterRequest = { firstname, lastname, email, password, avatar };

    try {
      await authService.register(data);
      onRegisterSuccess("Registration successful! Please log in.");
      setSuccess(true);
      setFirstname("");
      setLastname("");
      setEmail("");
      setPassword("");
      setAvatar(avatars[0]);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  const handleSelectAvatar = (url: string) => {
    setAvatar(url);
    setShowModal(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-gray-200 p-8 rounded-lg shadow space-y-4"
    >
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && (
        <p className="text-green-500 mb-2">Registration successful!</p>
      )}

      <div className="flex flex-col items-center">
        <img
          src={avatar}
          alt="Selected Avatar"
          className="w-24 h-24 rounded-full mb-2"
        />
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="bg-none text-cyan-700 hover:text-cyan-800 text-sm rounded-md"
        >
          Choose Avatar
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">First Name</label>
        <input
          type="text"
          placeholder="First Name"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          required
          className="w-full text-sm bg-white px-4 border py-2 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Last Name</label>
        <input
          type="text"
          placeholder="Last Name"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          required
          className="w-full text-sm bg-white px-4 border py-2 rounded-md"
        />
      </div>

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
        Register
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-8 text-center shadow-lg z-10 grid grid-cols-2 md:grid-cols-4 gap-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {avatars.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Avatar ${idx}`}
                  className={`w-24 h-24 rounded-full shadow cursor-pointer transition-transform duration-200 
                  hover:scale-110 hover:shadow-xl
                  ${avatar === url ? "border-4 border-cyan-700" : ""}`}
                  onClick={() => handleSelectAvatar(url)}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};
