import React from "react";
import { useNavigate } from "react-router-dom";
import { FolderPlus } from "lucide-react";
import Header from "../../components/Header";
import * as S from "./MainProject.styles";

export default function MainProject({
  userName = "김멋사",
  projects = [],
  onNavigate,
  onCreateProject,
  onJoinProject,
  onSelectProject,
}) {
  const navigate = useNavigate();

  return (
    <S.PageWrapper>
      <Header
        activeTab="project"
        showNav={true}
        userName={userName}
        onNavigate={onNavigate}
        onCreateProject={onCreateProject}
        onJoinProject={onJoinProject}
      />

      <S.Content>
        {/* 상단 배너 */}
        <S.Banner>
          <S.BannerText>
            <h2>안녕하세요, {userName}님!</h2>
            <p>
              여러 언어의 문서를 하나의 기준으로 관리하고,
              <br />
              글로벌 팀과 함께 효율적으로 협업해 보세요!
            </p>
          </S.BannerText>
          <S.Popup />
        </S.Banner>

        {/* 내 프로젝트 */}
        <S.SectionHeader>
          <h3>내 프로젝트</h3>
        </S.SectionHeader>

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
                  if (onSelectProject) onSelectProject(p.id);
                  else navigate(`/project/${p.id}`);
                }}
              >
                <h4>{p.title}</h4>
                <p className="langs">{p.langs?.join(", ")}</p>
                <S.AvatarGroup>
                  {p.members?.map((m, idx) => (
                    <S.MiniAvatar key={idx}>
                      {typeof m === "string" ? m.charAt(0) : m}
                    </S.MiniAvatar>
                  ))}
                </S.AvatarGroup>
                <p className="time">최종 업데이트 • {p.updated}</p>
              </S.ProjectCard>
            ))}
          </S.ProjectGrid>
        )}
      </S.Content>
    </S.PageWrapper>
  );
}
