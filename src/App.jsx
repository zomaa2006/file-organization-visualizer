import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ الصفحات
import Home from "./pages/Home";
import About from "./pages/About";
import Simulator from "./pages/Simulator";

// ✅ المكونات
import Navbar from "./components/Navbar/Navbar";

const App = () => {
  return (
    <Router>
      <>
        <Navbar />
        <div className="bg-dark min-vh-100 text-light">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </>
    </Router>
  );
};

export default App;
