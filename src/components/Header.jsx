import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import * as S from "./Header.styles";

// 모달 컴포넌트 불러오기
import CreateProjectModal from "./Modal/CreateProjectModal";
import JoinProjectModal from "./Modal/JoinProjectModal";

export default function Header({
  type = "main",
  showNav = true,
  onCreateProject,
  onJoinProject,
  onCreateDoc,
  onExit,
  onRefresh, // 상위 페이지에서 새로고침 함수가 전달되면 실행
}) {
  const navigate = useNavigate();
  const isProject = type === "project";

  // 모달 열림/닫힘 상태 관리
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  const handleExit = () => {
    if (onExit) {
      onExit();
    }
    navigate("/home");
  };

  // 프로젝트 생성 버튼 클릭 시
  const handleOpenCreate = () => {
    setIsCreateOpen(true);
    if (onCreateProject) {
      onCreateProject();
    }
  };

  // 프로젝트 입장 버튼 클릭 시
  const handleOpenJoin = () => {
    setIsJoinOpen(true);
    if (onJoinProject) {
      onJoinProject();
    }
  };

  // 모달 작업 성공 시 콜백
  const handleSuccess = (result) => {
    setIsCreateOpen(false);
    setIsJoinOpen(false);

    if (onRefresh) {
      onRefresh();
    } else if (result?.teamId || result?.projectId) {
      // 생성/참여한 프로젝트 ID가 오면 해당 팀 프로젝트 페이지로 바로 이동
      const id = result.teamId || result.projectId;
      navigate(`/project/${id}`);
    } else {
      // 그 외의 경우 페이지 새로고침으로 목록 갱신
      window.location.reload();
    }
  };

  return (
    <>
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
              <S.Avatar>S</S.Avatar>
            </>
          )}
        </S.HeaderRight>
      </S.Header>

      {/* 프로젝트 생성 모달 */}
      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* 프로젝트 참여 모달 */}
      <JoinProjectModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
