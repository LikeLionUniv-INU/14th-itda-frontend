import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import * as S from "./Header.styles";

import CreateProjectModal from "./Modal/CreateProjectModal";
import JoinProjectModal from "./Modal/JoinProjectModal";
import { clearUserLangCache } from "../api/documentApi";

export default function Header({
  type = "main",
  showNav = true,
  userName,
  userInitial,
  onCreateProject,
  onJoinProject,
  onCreateDoc,
  onExit,
  onRefresh,
}) {
  const navigate = useNavigate();
  const isProject = type === "project";

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  const displayInitial = (
    userInitial || (userName ? userName.charAt(0) : "U")
  ).toUpperCase();

  const handleExit = () => {
    if (onExit) {
      onExit();
    }
    navigate("/home");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userLanguage");
    clearUserLangCache();

    navigate("/");
  };

  const handleOpenCreate = () => {
    setIsCreateOpen(true);
    if (onCreateProject) {
      onCreateProject();
    }
  };

  const handleOpenJoin = () => {
    setIsJoinOpen(true);
    if (onJoinProject) {
      onJoinProject();
    }
  };

  const handleSuccess = (result) => {
    setIsCreateOpen(false);
    setIsJoinOpen(false);

    if (onRefresh) {
      onRefresh();
    } else if (result?.teamId || result?.projectId) {
      const id = result.teamId || result.projectId;
      navigate(`/project/${id}`);
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      <S.Header $type={type}>
        <S.HeaderInner>
          <S.HeaderLeft>
            <S.Logo />
            {!isProject && showNav && (
              <S.Nav>
                <S.MenuItem to="/home">홈</S.MenuItem>
                <S.MenuItem to="/project">프로젝트</S.MenuItem>
                <S.MenuItem to="/doc">문서</S.MenuItem>
                <S.MenuItem to="/set">설정</S.MenuItem>
              </S.Nav>
            )}
          </S.HeaderLeft>

          <S.HeaderRight>
            {isProject ? (
              <>
                {onCreateDoc && (
                  <S.DocCreateButton onClick={onCreateDoc}>
                    문서 생성
                  </S.DocCreateButton>
                )}
                <S.ExitButton onClick={handleExit}>나가기</S.ExitButton>
              </>
            ) : (
              <>
                <S.ProjectCreateButton onClick={handleOpenCreate}>
                  프로젝트 생성 <Plus size={16} />
                </S.ProjectCreateButton>
                <S.ProjectEnterButton onClick={handleOpenJoin}>
                  프로젝트 입장
                </S.ProjectEnterButton>

                <S.LogoutButton onClick={handleLogout}>로그아웃</S.LogoutButton>

                <S.Avatar title={userName}>{displayInitial}</S.Avatar>
              </>
            )}
          </S.HeaderRight>
        </S.HeaderInner>
      </S.Header>

      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleSuccess}
      />

      <JoinProjectModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
