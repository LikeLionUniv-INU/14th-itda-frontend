import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainHome from "./pages/MainHome";
import MainProject from "./pages/MainProject";
import MainDoc from "./pages/MainDoc";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<MainHome />} />
        <Route path="/project" element={<MainProject />} />
        <Route path="/doc" element={<MainDoc />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
