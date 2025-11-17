import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./index.css";
// import { Routes, Route } from "react-router-dom";
import Sidebar from "./layout/Sidebar";

function App() {
  return (
    <div>
      <Sidebar />
      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes> */}
    </div>
  );
}

export default App;
