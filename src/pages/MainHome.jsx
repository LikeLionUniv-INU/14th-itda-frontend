import React from "react";
import { FolderPlus, FileText } from "lucide-react";
import Header from "../components/Header";
import * as S from "./MainHome.styles";

// 더미데이터
const dummyProjects = [
  {
    id: 1,
    title: "글로벌 이커머스 앱",
    langs: ["한국어", "English", "日本語"],
    members: ["J", "S", "K", "+2"],
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
    members: ["J", "S", "K", "+3"],
    updated: "2시간 전",
  },
  {
    id: 4,
    title: "회사 소개 자료",
    langs: ["한국어", "日本語"],
    members: ["J", "S", "K", "+2"],
    updated: "2시간 전",
  },
];

const dummyDocs = [
  {
    id: 1,
    name: "스토리보드",
    project: "글로벌 이커머스 앱",
    lang: "한국어",
    version: "ver.1",
    updated: "2시간 전",
  },
  {
    id: 2,
    name: "스토리보드",
    project: "글로벌 이커머스 앱",
    lang: "English",
    version: "ver.1",
    updated: "2시간 전",
  },
  {
    id: 3,
    name: "기획서",
    project: "마케팅 웹사이트",
    lang: "한국어",
    version: "ver.2",
    updated: "2일 전",
  },
  {
    id: 4,
    name: "기획서",
    project: "마케팅 웹사이트",
    lang: "한국어",
    version: "ver.2",
    updated: "2일 전",
  },
  {
    id: 5,
    name: "기획서",
    project: "마케팅 웹사이트",
    lang: "日本語",
    version: "ver.2",
    updated: "2일 전",
  },
];

export default function MainHome({
  projects = dummyProjects,
  documents = dummyDocs,
  onNavigate,
  onCreateProject,
  onCreateDocument,
}) {
  return (
    <S.PageWrapper>
      <Header
        activeTab="home"
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
          {projects.length > 0 && (
            <S.MoreLink onClick={() => onNavigate && onNavigate("project")}>
              전체보기 &gt;
            </S.MoreLink>
          )}
        </S.SectionHeader>

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
            {projects.slice(0, 4).map((p) => (
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

        <S.SectionHeader>
          <h3>최근 문서</h3>
          {documents.length > 0 && (
            <S.MoreLink onClick={() => onNavigate && onNavigate("document")}>
              전체보기 &gt;
            </S.MoreLink>
          )}
        </S.SectionHeader>

        {documents.length === 0 ? (
          <S.EmptyContainer>
            <FileText size={50} color="#8F92A1" />
            <h4>작성한 문서가 아직 없어요</h4>
            <p>새로운 문서를 작성하고 콘텐츠를 관리해보세요.</p>
            <S.ActionButton onClick={onCreateDocument}>
              문서 작성하기
            </S.ActionButton>
          </S.EmptyContainer>
        ) : (
          <S.Table>
            <thead>
              <tr>
                <th>문서 이름</th>
                <th>프로젝트</th>
                <th>언어</th>
                <th>버전</th>
                <th>최종 업데이트</th>
              </tr>
            </thead>
            <tbody>
              {documents.slice(0, 5).map((doc) => (
                <tr key={doc.id}>
                  <td className="doc-name">{doc.name}</td>
                  <td>{doc.project}</td>
                  <td>{doc.lang}</td>
                  <td>{doc.version}</td>
                  <td>{doc.updated}</td>
                </tr>
              ))}
            </tbody>
          </S.Table>
        )}
      </S.Content>
    </S.PageWrapper>
  );
}
