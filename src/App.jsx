import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Test from "./pages/Test";
import DocEditor from "./pages/DocEditor/DocEditor";
import DocEdit from "./pages/DocEditor/DocEdit";
import DocCompare from "./pages/DocEditor/DocCompare";
import MainHome from "./pages/mainpage/MainHome";
import MainProject from "./pages/mainpage/MainProject";
import MainDoc from "./pages/mainpage/MainDoc";
import MainSetting from "./pages/mainpage/MainSetting";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TeamProjectLeader from "./pages/Teamproject/TeamProjectLeader";
import TeamProjectMember from "./pages/Teamproject/TeamProjectMember";
import TeamProjectDocs from "./pages/Teamproject/TeamProjectDocs";
import Translation from "./pages/Translation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<MainHome />} />
        <Route path="/project" element={<MainProject />} />
        <Route path="/doc" element={<MainDoc />} />
        <Route path="/test" element={<Test />} />
        <Route path="/doc-create" element={<DocEditor />} />
        <Route path="/doc-edit" element={<DocEdit />} />
        <Route path="/doc-compare" element={<DocCompare />} />
        <Route path="/set" element={<MainSetting />} />
        <Route path="/teamp-leader" element={<TeamProjectLeader />} />
        <Route path="/teamp-member" element={<TeamProjectMember />} />
        <Route path="/teamp-doc" element={<TeamProjectDocs />} />
        <Route path="/trans" element={<Translation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
