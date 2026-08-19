import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react";
import Header from "../../components/Header";
import DocIcon from "../../assets/image/doc icon.svg";
import * as S from "./TeamProjectDocs.styles";
import { getTeamDetail } from "../../services/teamApi";

const getRelativeTime = (dateString) => {
  if (!dateString) return "";
  const now = new Date();
  const past = new Date(dateString);
  const diffInMinutes = Math.floor((now - past) / (1000 * 60));

  if (diffInMinutes < 1) return "방금 전";
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}시간 전`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}일 전`;
};

const getInitial = (name) => {
  if (!name) return "";
  return name.trim().charAt(0).toUpperCase();
};

export default function TeamProjectDocs({ onNavigate, onSelectDocument }) {
  const navigate = useNavigate();
  const { teamId } = useParams();

  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocsData = async () => {
      if (!teamId) {
        setLoading(false);
        return;
      }
      try {
        const res = await getTeamDetail(teamId);
        const resData = res.data;
        if (resData.success || resData.data) {
          setProjectData(resData.data || resData);
        }
      } catch (error) {
        console.error("팀 문서 목록 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocsData();
  }, [teamId]);

  if (loading) return <div>로딩 중...</div>;

  // 데이터 바인딩 및 예외 처리
  const projectInfo = projectData || {
    name: "AI 서비스 플랫폼",
    defaultLanguage: "한국어",
    createdAt: "2026.06.30",
    members: [],
    documents: [],
  };

  const docs = projectInfo.documents || projectInfo.docs || [];
  const members = projectInfo.members || [];

  const memberInitials = members
    .slice(0, 3)
    .map((m) => getInitial(m.name || m.firstName));
  const extraMemberCount = members.length - 3;

  return (
    <S.PageWrapper>
      <Header
        type="project"
        isLeader={false}
        onCreateDoc={null}
        onExit={() => (onNavigate ? onNavigate("home") : navigate("/"))}
      />

      <S.Content>
        <S.ProjectSummaryCard>
          <S.ProjectTitle>
            {projectInfo.name || projectInfo.title}
          </S.ProjectTitle>
          <S.ProjectMetaInfo>
            <S.MetaItem>
              <span className="label">기본 언어</span>
              <span className="value">{projectInfo.defaultLanguage}</span>
            </S.MetaItem>

            <S.MetaItem>
              <span className="label">멤버</span>
              <S.AvatarGroup>
                {memberInitials.map((initial, idx) => (
                  <S.MiniAvatar key={idx}>{initial}</S.MiniAvatar>
                ))}
                {extraMemberCount > 0 && (
                  <S.MiniAvatar className="more">
                    +{extraMemberCount}
                  </S.MiniAvatar>
                )}
              </S.AvatarGroup>
            </S.MetaItem>

            <S.MetaItem>
              <span className="label">생성일</span>
              <span className="value">
                {projectInfo.createdAt?.split("T")[0] || projectInfo.createdAt}
              </span>
            </S.MetaItem>
          </S.ProjectMetaInfo>
        </S.ProjectSummaryCard>

        <S.SectionTitle>전체 문서 목록</S.SectionTitle>

        {docs.length === 0 ? (
          <S.EmptyContainer>
            <img src={DocIcon} alt="문서 아이콘" width="48" height="48" />
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
                {docs.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => {
                      if (onSelectDocument) {
                        onSelectDocument(doc.id);
                      } else if (onNavigate) {
                        onNavigate("docDetail", doc.id);
                      } else {
                        navigate(`/documents/${doc.id}`);
                      }
                    }}
                  >
                    <td className="doc-name">{doc.name || doc.title}</td>
                    <td>{projectInfo.name || doc.project}</td>
                    <td>
                      {doc.language ||
                        doc.selectedLang ||
                        (doc.languages && doc.languages[0])}
                    </td>
                    <td>
                      v
                      {doc.latestVersion ||
                        doc.currentVersion ||
                        doc.version ||
                        1}
                    </td>
                    <td>{getRelativeTime(doc.updatedAt || doc.updated)}</td>
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
