import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
    return (
        <section className="container mx-auto mt-12">
            <div className="container mx-auto flex flex-col md:flex-row items-center">

                <div className="w-full md:w-1/2 text-center px-10 pb-8">
                    <img
                        src="/logo-cyan.png"
                        alt="Learning illustration"
                        className="w-15 mx-auto mb-8"
                    />
                    <h1 className="text-4xl md:text-6xl font-bold mb-7">
                        Step by step - <br /> learning made easy!
                    </h1>
                    <p className="text-lg mb-8">
                        Start your journey and gain new skills with ease.
                    </p>
                    <Link to="/courses">
                        <button className="bg-cyan-700 hover:bg-cyan-800 text-white font-semibold py-3 px-6 rounded-md transition transform hover:scale-105">
                            Start learning
                        </button>
                    </Link>
                </div>

                <div className="w-full md:w-1/2">
                    <img
                        src="/hero-image.png"
                        alt="Learning illustration"
                        className="w-150 p-16"
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
