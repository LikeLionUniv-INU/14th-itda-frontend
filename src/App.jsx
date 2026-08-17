import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainHome from "./pages/mainpage/MainHome";
import MainProject from "./pages/mainpage/MainProject";
import MainDoc from "./pages/mainpage/MainDoc";
import MainSetting from "./pages/mainpage/MainSetting";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TeamProjectLeader from "./pages/TeamProjectLeader";
import Translation from "./pages/Translation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<MainHome />} />
        <Route path="/project" element={<MainProject />} />
        <Route path="/doc" element={<MainDoc />} />
        <Route path="/set" element={<MainSetting />} />
        <Route path="/teamp-leader" element={<TeamProjectLeader />} />
        <Route path="/trans" element={<Translation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
