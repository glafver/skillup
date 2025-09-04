import './App.css';
import Home from './pages/Home';
import Courses from './pages/Courses';
import { Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
      </Routes>
    </>
  );
}

export default App;
