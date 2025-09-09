import { motion } from "framer-motion";

const About = () => {
    return (
        <motion.section
            className="container mx-auto px-6 py-12 max-w-6xl grid md:grid-cols-2 md:gap-12 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            <div className="mx-automd:col-span-1 flex flex-col justify-around h-full mb-12 md:mb-0 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl mb-6 md:mb-0 font-bold">About SKILLUP</h1>
                <div>
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
            </div>

            <div className="flex justify-center md:col-span-1">
                <img
                    src="/about-skillup.png"
                    alt="SKILLUP Illustration"
                    className="max-w-full"
                />
            </div>
        </motion.section>
    );
};

export default About;
