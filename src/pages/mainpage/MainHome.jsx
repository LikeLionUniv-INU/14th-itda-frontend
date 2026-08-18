import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import * as S from "./MainHome.styles";

export default function MainHome({
  userName = "김멋사",
  projects = [],
  documents = [],
  onNavigate,
  onCreateProject,
  onJoinProject,
  onSelectProject,
  onSelectDocument,
}) {
  const navigate = useNavigate();

  return (
    <S.PageWrapper>
      <Header
        activeTab="home"
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
          내 프로젝트
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
            {projects.slice(0, 4).map((p) => (
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

        {/* 최근 문서 */}
        <S.SectionHeader>
          최근 문서
        </S.SectionHeader>

        {documents.length === 0 ? (
          <S.EmptyContainer>
            <S.DocIcon />
            <h4>작성한 문서가 아직 없어요</h4>
            <p>새로운 문서를 작성하고 콘텐츠를 관리해보세요.</p>
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
                <tr
                  key={doc.id}
                  onClick={() => {
                    if (onSelectDocument) onSelectDocument(doc.id);
                    else navigate(`/doc/${doc.id}`);
                  }}
                >
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
