const testimonials = [
    {
        name: "Emma L.",
        text: "SkillUp made it so easy to learn coding while working full time. I love the short lessons!",
        img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        name: "Daniel K.",
        text: "The flexibility is unbeatable. I studied during my commute and actually enjoyed it.",
        img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        name: "Sofia M.",
        text: "I started as a complete beginner and now I feel confident building real projects!",
        img: "https://randomuser.me/api/portraits/women/68.jpg",
    },
];

const TestimonialsSection: React.FC = () => {
    return (
        <section className="w-full bg-white py-16 md:py-36">
            <div className="container mx-auto max-w-6xl px-4">
                <h2 className="text-3xl md:text-4xl font-semibold text-center mb-10">
                    What our students say
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {testimonials.map((t, i) => (
                        <article
                            key={i}
                            className="bg-gray-100 rounded-xl shadow-md p-6 flex items-start text-left transition-transform duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]"
                        >
                            <img
                                src={t.img}
                                alt={t.name}
                                className="w-16 h-16 rounded-full mr-4 object-cover flex-shrink-0"
                                loading="lazy"
                            />
                            <div className="flex flex-col justify-between h-full w-full">
                                <p className="italic mb-4">“{t.text}”</p>
                                <h3 className="font-semibold text-lg self-end">{t.name}</h3>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;