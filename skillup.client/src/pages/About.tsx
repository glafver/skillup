import { motion } from "framer-motion";

const About = () => {
    return (
        <motion.section
            className="container mx-auto px-6 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            <div className="text-center max-w-4xl mx-auto mb-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-6">About SKILLUP</h1>
                <p className="text-lg leading-relaxed">
                    SKILLUP isn’t just any learning platform – it’s your brain’s personal training arena.
                    Here, you learn programming step by step with theory, exercises, and levels that feel more like a game than a lesson.
                </p>
                <p className="text-lg leading-relaxed mt-4">
                    Every level you complete unlocks certificates (just like achievements in a game – but with a bit more LinkedIn credibility than Xbox points).
                </p>
                <p className="text-lg leading-relaxed mt-4">
                    In short: you’ll get smarter, have fun, and maybe even get a little hooked – but in the best way possible. 🚀
                </p>
            </div>

            <div className="flex justify-center">
                <img
                    src="/about-skillup.png"
                    alt="SKILLUP Illustration"
                    className="max-w-full h-150"
                />
            </div>
        </motion.section>
    );
};

export default About;
