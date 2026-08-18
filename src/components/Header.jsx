import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Plus } from "lucide-react";
import * as S from "./Header.styles";

export default function Header({
  type = "main",
  showNav = true,
  onCreateProject,
  onJoinProject,
  onCreateDoc,
  onExit,
}) {
  const navigate = useNavigate();
  const isProject = type === "project";

  const handleExit = () => {
    if (onExit) {
      onExit();
    }
    navigate("/home");
  };

  return (
    <S.Header $type={type}>
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
            <S.ExitButton onClick={handleExit}>
              나가기
            </S.ExitButton>
          </>
        ) : (
          <>
            <S.ProjectCreateButton onClick={onCreateProject}>
              프로젝트 생성 <Plus size={16} />
            </S.ProjectCreateButton>
            <S.ProjectEnterButton onClick={onJoinProject}>
              프로젝트 입장
            </S.ProjectEnterButton>
            <S.Avatar>S</S.Avatar>
          </>
        )}
      </S.HeaderRight>
    </S.Header>
  );
}