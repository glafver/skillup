import { FaEnvelope, FaPhone, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";

const Contact = () => {
    return (
        <motion.section
            className="container mx-auto px-6 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            <div className="text-center max-w-2xl mx-auto mb-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-6">Contact Us</h1>
                <p className=" ">
                    Have questions or want to get in touch? Fill out the form or reach us directly.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 md:gap-24 max-w-4xl mx-auto">
                <form className="bg-gray-100 p-8 rounded-xl shadow space-y-4  ">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full text-sm bg-white   rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full text-sm bg-white  rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Message</label>
                        <textarea
                            rows={4}
                            placeholder="Your Message"
                            className="w-full text-sm bg-white  rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full  bg-cyan-700 text-white py-2 rounded-md hover:bg-cyan-800 transition"
                    >
                        Send Message
                    </button>
                </form>

                <div className="flex flex-col items-center  space-y-6">
                    <div className="flex items-center space-x-3">
                        <FaEnvelope className="text-cyan-700 text-xl" />
                        <span className="text-gray-700">support@skillup.com</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <FaPhone className="text-cyan-700 text-xl" />
                        <span className="text-gray-700">+46 70 123 45 67</span>
                    </div>

                    <div className="flex space-x-5 mt-4">
                        <a href="#" className="text-cyan-700 hover:text-cyan-800 text-2xl">
                            <FaFacebook />
                        </a>
                        <a href="#" className="text-cyan-700 hover:text-cyan-800 text-2xl">
                            <FaTwitter />
                        </a>
                        <a href="#" className="text-cyan-700 hover:text-cyan-800 text-2xl">
                            <FaLinkedin />
                        </a>
                    </div>
                    <div className="mt-12 flex justify-center">
                        <img
                            src="/contact.png"
                            alt="Contact illustration"
                            className="max-w-md w-full"
                        />
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default Contact;
