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
import TeamProject from "./pages/Teamproject/TeamProject";
import TeamProjectDocs from "./pages/Teamproject/TeamProjectDocs";
import Translation from "./pages/Translation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 인증 */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 메인 대시보드 */}
        <Route path="/home" element={<MainHome />} />
        <Route path="/project" element={<MainProject />} />
        <Route path="/doc" element={<MainDoc />} />
        <Route path="/set" element={<MainSetting />} />
        <Route path="/trans" element={<Translation />} />
        <Route path="/test" element={<Test />} />

        {/* 문서 작성 / 수정 / 비교 (파라미터 연동 지원) */}
        <Route path="/doc-create" element={<DocEditor />} />
        <Route path="/doc-edit" element={<DocEdit />} />
        <Route path="/doc-edit/:docId" element={<DocEdit />} />
        <Route path="/doc-compare" element={<DocCompare />} />
        <Route path="/doc-compare/:docId" element={<DocCompare />} />

        {/* 팀 프로젝트 (파라미터 연동 지원) */}
        <Route path="/teamp/:teamId" element={<TeamProject />} />
        <Route path="/teamp-leader/:teamId" element={<TeamProject />} />
        <Route path="/teamp-member/:teamId" element={<TeamProject />} />
        <Route path="/teamp-doc" element={<TeamProjectDocs />} />
        <Route path="/teamp-doc/:teamId" element={<TeamProjectDocs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
