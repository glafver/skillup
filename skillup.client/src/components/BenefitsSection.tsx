
import React from "react";

const cards = [
    {
        title: "Learn in 5–10 Minutes Daily",
        text: "Build new skills fast with bite‑sized lessons that fit your schedule.",
        img: "timer.png"
    },
    {
        title: "Flexible, Anywhere, Anytime",
        text: "Study on your terms — at home, on the go, on desktop or mobile.",
        img: "coding.png"
    },
    {
        title: "Grow From Beginner to Advanced",
        text: "Progress through clear levels and track your growth step by step.",
        img: "success.png"
    },
];

const BenefitsSection: React.FC = () => {
    return (
        <section className="w-full bg-gray-200 py-16">
            <div className="container mx-auto max-w-6xl px-4">
                <h2 className="text-3xl md:text-4xl font-semibold text-center mb-10">
                    Why choose <span className="inline-block align-baseline font-bold">SKILLUP</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {cards.map((c, i) => (
                        <article
                            key={i}
                            className="bg-white rounded-xl text-center shadow-md transition-transform duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]"
                            aria-label={c.title}
                        >
                            <div className="py-6 pt-6 md:p-15">
                                <img
                                    src={c.img}
                                    className="h-30 md:h-50 mx-auto"
                                    loading="lazy"
                                />
                            </div>

                            <div className="p-8 md:pt-0 md:px-15 md:pb-15">
                                <h3 className="text-xl md:text-2xl font-semibold mb-2">{c.title}</h3>
                                <p className="text-lg">{c.text}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BenefitsSection;
