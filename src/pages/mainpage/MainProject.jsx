import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import CreateProjectModal from "../../components/Modal/CreateProjectModal";
import JoinProjectModal from "../../components/Modal/JoinProjectModal";
import { getDashboardApi } from "../../api/dashboard"; 
import * as S from "./MainProject.styles";

export default function MainProject({
  onNavigate,
  onCreateProject,
  onJoinProject,
  onSelectProject,
}) {
  const navigate = useNavigate();

  // 1. 홈과 완벽하게 동일한 상태 관리 (문서 부분만 제외)
  const [userInfo, setUserInfo] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  // 2. 홈과 동일하게 API로 데이터 호출
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getDashboardApi();
      const resData = response.data?.data || response.data || response;
      if (resData) {
        if (resData.user) setUserInfo(resData.user);
        if (resData.projects) setProjects(resData.projects);
      }
    } catch (error) {
      console.error("데이터를 가져오는데 실패했습니다.", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // 3. 홈과 동일한 모달 핸들러
  const handleOpenCreateModal = () => {
    if (onCreateProject) onCreateProject();
    else setIsCreateOpen(true);
  };

  const handleOpenJoinModal = () => {
    if (onJoinProject) onJoinProject();
    else setIsJoinOpen(true);
  };

  const handleModalSuccess = (result) => {
    setIsCreateOpen(false);
    setIsJoinOpen(false);
    const targetId = result?.teamId || result?.projectId || result?.id;
    if (targetId) navigate(`/teamp-leader/${targetId}`);
    else fetchDashboardData();
  };

  const displayUserName = userInfo
    ? `${userInfo.lastName || ""}${userInfo.firstName || ""}`.trim() || "사용자"
    : "사용자";

  if (loading) return <S.PageWrapper>로딩 중...</S.PageWrapper>;

  return (
    <S.PageWrapper>
      <Header
        activeTab="project"
        showNav={true}
        userName={displayUserName}
        userInitial={userInfo?.initial}
        onNavigate={onNavigate}
        onCreateProject={handleOpenCreateModal}
        onJoinProject={handleOpenJoinModal}
        onRefresh={fetchDashboardData}
      />

      <S.Content>
        {/* 상단 배너 */}
        <S.Banner>
          <S.BannerText>
            <h2>안녕하세요, {displayUserName}님!</h2>
            <p>
              여러 언어의 문서를 하나의 기준으로 관리하고,<br />
              글로벌 팀과 함께 효율적으로 협업해 보세요!
            </p>
          </S.BannerText>
          <S.Popup />
        </S.Banner>

        {/* 내 프로젝트 */}
        <S.SectionHeader>내 프로젝트</S.SectionHeader>

        {projects.length === 0 ? (
          <S.EmptyContainer>
            <S.ProjectIcon />
            <h4>아직 생성된 프로젝트가 없어요.</h4>
            <p>프로젝트를 생성하고 팀과 함께 문서를 관리해보세요.</p>
            <S.ActionButton type="button" onClick={handleOpenCreateModal}>
              프로젝트 생성하기
            </S.ActionButton>
          </S.EmptyContainer>
        ) : (
          <S.ProjectGrid>
            {/* 홈 화면의 slice(0, 4)만 제거하여 여기서는 모든 프로젝트가 보이게 했습니다 */}
            {projects.map((p) => (
              <S.ProjectCard
                key={p.id}
                onClick={() => {
                  if (onSelectProject) {
                    onSelectProject(p.id, p);
                    return;
                  }
                  // 4. 홈과 동일하게 리더/멤버 권한 체크 후 라우팅
                  const isLeader =
                    p.isLeader === true ||
                    p.role === "LEADER" ||
                    (userInfo?.id && p.leaderId === userInfo.id);

                  if (isLeader) navigate(`/teamp-leader/${p.id}`);
                  else navigate(`/teamp-member/${p.id}`);
                }}
              >
                <h4>{p.name}</h4>
                <p className="langs">
                  {Array.isArray(p.memberLanguages)
                    ? p.memberLanguages.join(", ")
                    : p.defaultLanguage}
                </p>
                <S.AvatarGroup>
                  {p.members?.map((m, idx) => (
                    <S.MiniAvatar key={idx}>
                      {typeof m === "string"
                        ? m.charAt(0)
                        : m.initial || m.firstName?.charAt(0)}
                    </S.MiniAvatar>
                  ))}
                </S.AvatarGroup>
                <p className="time">
                  {p.lastDocumentUpdatedAt
                    ? `최종 업데이트 • ${p.lastDocumentUpdatedAt}`
                    : `팀원 ${p.memberCount || 0}명`}
                </p>
              </S.ProjectCard>
            ))}
          </S.ProjectGrid>
        )}
      </S.Content>

      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleModalSuccess}
      />
      <JoinProjectModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </S.PageWrapper>
  );
}