import "./App.css";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Account from "./pages/Account";
import Profile from "./pages/Profile";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import CourseContentPage from "./pages/CourseContentPage";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import TestActiveCourses from "./pages/TestActiveCourses";


function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/account" element={<Account />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={< FAQ />} />
          <Route path="/courses/:slug" element={<CourseContentPage />} />
          <Route path="/quiz/:slug" element={<Quiz />} />
          <Route path="/quiz/:slug/results" element={<Results />} />
          <Route path="/test/active-courses" element={<TestActiveCourses />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
