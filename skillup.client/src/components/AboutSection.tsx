import { Link } from "react-router-dom";

const AboutSection: React.FC = () => {
    return (
        <section className="w-full bg-gray-200 py-8">
            <div className="container mx-auto max-w-6xl px-6 grid md:grid-cols-3 md:gap-12 items-center">

                <div className="md:col-span-2">
                    <img
                        src="about.png"
                        alt="About SkillUp"
                        className="w-full object-cover"
                    />
                </div>

                <div className="md:col-span-1 text-center">
                    <img
                        src="/logo-cyan.png"
                        alt="Learning illustration"
                        className="w-15 mx-auto mb-8"
                    />
                    <h2 className="text-3xl md:text-4xl font-semibold mb-6">About  <span className="inline-block align-baseline font-bold">SKILLUP</span> </h2>
                    <p className="text-lg leading-relaxed mb-8">
                        SKILLUP is an interactive platform for anyone who wants to learn programming.
                        Our mission is to make coding simple, engaging, and accessible for everyone.
                    </p>
                    <Link to="/about">
                        <button className="bg-cyan-700 hover:bg-cyan-800 text-white font-semibold py-3 px-6 rounded-md transition transform hover:scale-105 cursor-pointer">
                            Read More
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;