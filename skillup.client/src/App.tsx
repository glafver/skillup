import "./App.css";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Account from "./pages/Account";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import CourseContentPage from "./pages/CourseContentPage";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";


function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/account" element={<Account />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={< FAQ />} />
          <Route path="/courses/:slug" element={<CourseContentPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
