import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainHome from "./pages/MainHome";
import MainProject from "./pages/MainProject";
import MainDoc from "./pages/MainDoc";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<MainHome />} />
        <Route path="/project" element={<MainProject />} />
        <Route path="/doc" element={<MainDoc />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
