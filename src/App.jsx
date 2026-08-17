import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainHome from "./pages/MainHome";
import MainProject from "./pages/MainProject";
import MainDoc from "./pages/MainDoc";
import Test from "./pages/Test";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<MainHome />} />
        <Route path="/project" element={<MainProject />} />
        <Route path="/doc" element={<MainDoc />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
