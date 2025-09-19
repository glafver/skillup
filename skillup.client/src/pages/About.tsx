import { motion } from "framer-motion";

const About = () => {
    return (
        <motion.div className="py-12 mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}>
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">
                About SKILLUP
            </h1>
            <div
                className="container mx-auto px-6 max-w-6xl grid md:grid-cols-2 md:gap-12 items-center"
            >
                <div className="flex flex-col justify-center text-center md:text-left space-y-4">
                    <p className="text-lg leading-relaxed">
                        SKILLUP isn’t just any learning platform – it’s your brain’s personal training arena.
                        Here, you learn programming step by step with theory, exercises, and levels that feel more like a game than a lesson.
                    </p>
                    <p className="text-lg leading-relaxed">
                        Every level you complete unlocks certificates (just like achievements in a game – but with a bit more LinkedIn credibility than Xbox points).
                    </p>
                    <p className="text-lg leading-relaxed">
                        In short: you’ll get smarter, have fun, and maybe even get a little hooked – but in the best way possible. 🚀
                    </p>
                </div>

                <div className="flex justify-center md:justify-end">
                    <img
                        src="/about-skillup.png"
                        alt="SKILLUP Illustration"
                        className="max-w-full h-auto"
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default About;
