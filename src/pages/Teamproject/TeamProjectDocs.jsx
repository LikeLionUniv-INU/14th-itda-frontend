import React from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./TeamProjectDocs.styles";

export default function TeamProjectDocs({
  projectInfo = {
    title: "AI 서비스 플랫폼",
    defaultLang: "한국어",
    members: ["J", "K", "B", "+2"],
    createdDate: "2026.06.30",
  },
  documents = [],
  onSelectDocument,
}) {
  const navigate = useNavigate();

  return (
    <S.PageWrapper>
      <S.TopHeader>
        <S.BackButton onClick={() => navigate(-1)} aria-label="뒤로가기">
          <svg viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </S.BackButton>
      </S.TopHeader>

      <S.Content>
        <S.ProjectSummaryCard>
          <S.ProjectTitle>{projectInfo.title}</S.ProjectTitle>
          <S.ProjectMetaInfo>
            <S.MetaItem>
              <span className="label">기본 언어</span>
              <span className="value">{projectInfo.defaultLang}</span>
            </S.MetaItem>

            <S.MetaItem>
              <span className="label">멤버</span>
              <S.AvatarGroup>
                {projectInfo.members.map((m, idx) => (
                  <S.MiniAvatar
                    key={idx}
                    className={m.startsWith("+") ? "more" : ""}
                  >
                    {m}
                  </S.MiniAvatar>
                ))}
              </S.AvatarGroup>
            </S.MetaItem>

            <S.MetaItem>
              <span className="label">생성일</span>
              <span className="value">{projectInfo.createdDate}</span>
            </S.MetaItem>
          </S.ProjectMetaInfo>
        </S.ProjectSummaryCard>

        <S.SectionTitle>최근 문서</S.SectionTitle>

        {documents.length === 0 ? (
          <S.EmptyContainer>
            <S.DocIcon />
            <h4>작성한 문서가 아직 없어요</h4>
            <p>새로운 문서를 작성하고 콘텐츠를 관리해보세요.</p>
          </S.EmptyContainer>
        ) : (
          <S.TableContainer>
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
                {documents.map((doc) => (
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
          </S.TableContainer>
        )}
      </S.Content>
    </S.PageWrapper>
  );
}
