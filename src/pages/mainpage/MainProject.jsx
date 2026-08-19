import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { getDashboardProjectsApi } from "../../api/dashboard";
import * as S from "./MainProject.styles";

export default function MainProject({
  userName: initialUserName,
  projects: initialProjects = [],
  onNavigate,
  onCreateProject,
  onJoinProject,
  onSelectProject,
}) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(initialProjects);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 최초 마운트 시 initialProjects가 없으면 1회만 호출
    if (initialProjects.length === 0) {
      const fetchProjects = async () => {
        try {
          setLoading(true);
          const response = await getDashboardProjectsApi();
          const resData = response.data?.data || response.data || response;
          if (resData?.projects) {
            setProjects(resData.projects);
          }
        } catch (error) {
          console.error("프로젝트 목록을 가져오는 데 실패했습니다.", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProjects();
    }
  // eslint-disable-next-deps
  }, []); // <-- 의존성 배열을 []로 수정하여 무한 루프 방지!

  if (loading) {
    return <S.PageWrapper>로딩 중...</S.PageWrapper>;
  }

  return (
    <S.PageWrapper>
      <Header
        activeTab="project"
        showNav={true}
        userName={initialUserName}
        onNavigate={onNavigate}
        onCreateProject={onCreateProject}
        onJoinProject={onJoinProject}
      />

      <S.Content>
        {/* 상단 배너 */}
        <S.Banner>
          <S.BannerText>
            <h2>안녕하세요, {initialUserName}님!</h2>
            <p>
              여러 언어의 문서를 하나의 기준으로 관리하고,
              <br />
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
            <S.ActionButton onClick={onCreateProject}>
              프로젝트 생성하기
            </S.ActionButton>
          </S.EmptyContainer>
        ) : (
          <S.ProjectGrid>
            {projects.map((p) => (
              <S.ProjectCard
                key={p.id}
                onClick={() => {
                  if (onSelectProject) {
                    onSelectProject(p.id);
                  } else {
                    navigate(`/teams/${p.id}`);
                  }
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
    </S.PageWrapper>
  );
}