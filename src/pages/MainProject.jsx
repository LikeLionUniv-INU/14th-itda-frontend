import React from "react";
import { FolderPlus } from "lucide-react";
import Header from "../components/Header";
import * as S from "./MainProject.styles";

// 더미데이터
const dummyProjects = [
  {
    id: 1,
    title: "글로벌 이커머스 앱",
    langs: ["한국어", "English", "日本語"],
    members: ["J", "S", "K"],
    updated: "2시간 전",
  },
  {
    id: 2,
    title: "마케팅 웹 사이트",
    langs: ["한국어", "English"],
    members: ["J", "S"],
    updated: "1일 전",
  },
  {
    id: 3,
    title: "AI 서비스 플랫폼",
    langs: ["한국어", "日本語"],
    members: ["J", "S", "K"],
    updated: "2시간 전",
  },
  {
    id: 4,
    title: "회사 소개 자료",
    langs: ["한국어", "日本語"],
    members: ["J", "S", "K"],
    updated: "2시간 전",
  },
  {
    id: 5,
    title: "글로벌 이커머스 앱",
    langs: ["한국어", "English", "日本語"],
    members: ["J", "S", "K"],
    updated: "2시간 전",
  },
  {
    id: 6,
    title: "마케팅 웹 사이트",
    langs: ["한국어", "English"],
    members: ["J", "S"],
    updated: "1일 전",
  },
  {
    id: 7,
    title: "AI 서비스 플랫폼",
    langs: ["한국어", "日本語"],
    members: ["J", "S", "K"],
    updated: "2시간 전",
  },
  {
    id: 8,
    title: "회사 소개 자료",
    langs: ["한국어", "日本語"],
    members: ["J", "S", "K"],
    updated: "2시간 전",
  },
];

export default function MainProject({
  projects = dummyProjects, //더미데이터
  onNavigate,
  onCreateProject,
}) {
  return (
    <S.PageWrapper>
      <Header
        activeTab="project"
        showNav={true}
        onNavigate={onNavigate}
        onCreateProject={onCreateProject}
      />

      <S.Content>
        <S.Banner>
          <S.BannerText>
            <h2>안녕하세요, 김멋사님!</h2>
            <p>
              여러 언어의 문서를 하나의 기준으로 관리하고,
              <br />
              글로벌 팀과 함께 효율적으로 협업해 보세요!
            </p>
          </S.BannerText>
        </S.Banner>

        <S.SectionHeader>
          <h3>내 프로젝트</h3>
        </S.SectionHeader>

        {/* 데이터 유무 */}
        {projects.length === 0 ? (
          <S.EmptyContainer>
            <FolderPlus size={50} color="#8F92A1" />
            <h4>아직 생성된 프로젝트가 없어요.</h4>
            <p>프로젝트를 생성하고 팀과 함께 문서를 관리해보세요.</p>
            <S.ActionButton onClick={onCreateProject}>
              프로젝트 생성하기
            </S.ActionButton>
          </S.EmptyContainer>
        ) : (
          <S.ProjectGrid>
            {projects.map((p) => (
              <S.ProjectCard key={p.id}>
                <h4>{p.title}</h4>
                <p className="langs">{p.langs?.join(", ")}</p>
                <S.AvatarGroup>
                  {p.members?.map((m, idx) => (
                    <S.MiniAvatar key={idx}>{m}</S.MiniAvatar>
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
