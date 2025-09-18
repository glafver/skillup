import { useState } from "react";
import type { Profile } from "../services/profileService";
import { motion, AnimatePresence } from "framer-motion";
import { avatars } from "../helpers/avatars";

interface AvatarSectionProps {
    profile: Profile;
    onUpdateAvatar?: (url: string) => void;
}

const AvatarSection: React.FC<AvatarSectionProps> = ({ profile, onUpdateAvatar }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar || avatars[0]);
    const [message, setMessage] = useState<string | null>(null);
    const [onError, setOnError] = useState(false);

    const handleChangeAvatar = () => {
        setShowModal(true);
        setMessage(null);
    };

    const handleSelectAvatar = async (url: string) => {
        try {
            await onUpdateAvatar?.(url);
            setSelectedAvatar(url);
            setMessage("Avatar updated successfully");
            setOnError(false);
        } catch {
            setMessage("Failed to update avatar");
            setOnError(true);
        } finally {
            setShowModal(false);
        }
    };

    const handleCloseModal = () => setShowModal(false);

    return (
        <div className="bg-gray-200 shadow rounded-lg p-6 flex flex-col items-center">
            <img
                src={selectedAvatar}
                alt="User Avatar"
                className="w-24 h-24 rounded-full mb-4"
            />
            <h3 className="text-lg font-semibold">
                {profile.firstname} {profile.lastname}
            </h3>
            <p className="text-gray-600">{profile.email}</p>
            <button
                onClick={handleChangeAvatar}
                className="mt-4 px-4 py-2 bg-cyan-700 hover:bg-teal-700 text-white rounded-md"
            >
                Change Avatar
            </button>

            {message && (
                <p className={`mt-2 ${onError ? "text-red-600" : "text-green-600"}`}>
                    {message}
                </p>
            )}

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        onClick={handleCloseModal}
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
                                        ${selectedAvatar === url ? "border-5 border-cyan-700" : ""}`}
                                    onClick={() => handleSelectAvatar(url)}
                                />
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AvatarSection;
