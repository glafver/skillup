import RegisterForm from "../components/RegisterForm";
import HeroSection from "../components/HeroSection";
import BenefitsSection from "../components/BenefitsSection";
import TestimonialsSection from "../components/TestimonialsSection";
import AboutSection from "../components/AboutSection";

export default function Home() {
  return (
    <div className="">
      <RegisterForm />
      <HeroSection />
      <BenefitsSection />
      <TestimonialsSection />
      <AboutSection />
    </div>
  );
}
