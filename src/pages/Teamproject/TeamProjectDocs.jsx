import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import DocIcon from "../../assets/image/file.svg";
import * as S from "./TeamProjectDocs.styles";
import { getTeamDetail } from "../../api/teamApi";

// 언어 코드를 표기명으로 변환하는 함수
const getLanguageFullName = (langCode) => {
  if (!langCode) return "-";
  const code = String(langCode).toLowerCase().trim();
  const langMap = {
    ko: "한국어",
    korean: "한국어",
    en: "English",
    english: "English",
    ja: "日本語",
    japanese: "日本語",
    zh: "中文",
    chinese: "中文",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
    vi: "Tiếng Việt",
  };
  return langMap[code] || langCode;
};

// 단일 언어 및 배열 형태의 언어 목록 모두 처리하는 함수
const getLanguagesDisplay = (languages, fallback) => {
  if (Array.isArray(languages) && languages.length > 0) {
    return languages.map(getLanguageFullName).join(", ");
  }
  return getLanguageFullName(fallback);
};

const getRelativeTime = (dateString) => {
  if (!dateString) return "방금 전";
  const now = new Date();

  let formatted = dateString;
  if (
    typeof dateString === "string" &&
    !dateString.endsWith("Z") &&
    !dateString.includes("+")
  ) {
    formatted = dateString.replace(" ", "T");
  }

  const past = new Date(formatted);
  if (isNaN(past.getTime())) return "방금 전";

  const diffInMinutes = Math.floor(
    (now.getTime() - past.getTime()) / (1000 * 60),
  );
  if (diffInMinutes < 1) return "방금 전";
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}시간 전`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}일 전`;
};

const getInitial = (name) => {
  if (!name) return "";
  return String(name).trim().charAt(0).toUpperCase();
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
        const resData = res?.data;
        if (resData) {
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

  const projectInfo = projectData || {
    name: "프로젝트",
    defaultLanguage: "ko",
    createdAt: "",
    members: [],
    documents: [],
  };

  const isLeader =
    projectInfo.myRole === "LEADER" ||
    projectInfo.isLeader === true ||
    projectInfo.role === "LEADER";

  const docs = projectInfo.documents || projectInfo.docs || [];
  const members = projectInfo.members || [];

  const memberInitials = members
    .slice(0, 3)
    .map((m) => getInitial(m.name || m.firstName || m.nickname));
  const extraMemberCount = members.length - 3;

  // 전체 문서 목록 클릭 분기 핸들러
  const handleDocClick = (doc) => {
    const targetId = doc.id || doc.documentId;
    const docVersion = Number(
      doc.latestVersion || doc.currentVersion || doc.version || 1,
    );

    if (onSelectDocument) {
      onSelectDocument(targetId, isLeader, docVersion);
      return;
    }

    if (isLeader) {
      // 1. 팀장 -> 문서 수정 화면
      if (onNavigate) {
        onNavigate("docEdit", targetId);
      } else {
        navigate(`/doc-edit/${targetId}`, {
          state: { teamId, version: docVersion, docId: targetId },
        });
      }
    } else {
      // 2. 팀원
      if (docVersion === 1) {
        // Version 1 -> 수정 요약 없는 순수 작성 문서 확인 뷰어
        if (onNavigate) {
          onNavigate("docView", targetId);
        } else {
          navigate(`/doc-view/${targetId}`, {
            state: { teamId, version: 1, docId: targetId },
          });
        }
      } else {
        // Version 2 이상 -> 수정 문서 확인 (비교 및 요약)
        if (onNavigate) {
          onNavigate("docDetail", targetId);
        } else {
          navigate(`/doc-compare/${targetId}`, {
            state: { teamId, version: docVersion, docId: targetId },
          });
        }
      }
    }
  };

  return (
    <S.PageWrapper>
      <Header
        type="project"
        isLeader={isLeader}
        onCreateDoc={null}
        onExit={() => (onNavigate ? onNavigate("home") : navigate("/home"))}
      />

      <S.Content>
        {/* 프로젝트 배너 */}
        <S.BannerCard>
          <S.BannerTitle>{projectInfo.name || projectInfo.title}</S.BannerTitle>
          <S.BannerMeta>
            <S.MetaItem>
              <span className="label">기본 언어</span>
              <span className="value">
                {getLanguageFullName(
                  projectInfo.defaultLanguage || projectInfo.language,
                )}
              </span>
            </S.MetaItem>

            <S.MetaItem>
              <span className="label">멤버</span>
              <S.AvatarGroup>
                {memberInitials.map((initial, idx) => (
                  <S.MiniAvatar key={idx}>{initial}</S.MiniAvatar>
                ))}
                {extraMemberCount > 0 && (
                  <S.MiniAvatar $isMore>+{extraMemberCount}</S.MiniAvatar>
                )}
              </S.AvatarGroup>
            </S.MetaItem>

            <S.MetaItem>
              <span className="label">생성일</span>
              <span className="value">
                {projectInfo.createdAt?.split("T")[0] ||
                  projectInfo.createdAt ||
                  "-"}
              </span>
            </S.MetaItem>
          </S.BannerMeta>
        </S.BannerCard>

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
                    key={doc.id || doc.documentId}
                    onClick={() => handleDocClick(doc)}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="doc-name">{doc.name || doc.title}</td>
                    <td>
                      {projectInfo.name || doc.projectName || doc.project}
                    </td>
                    <td>
                      {getLanguagesDisplay(
                        doc.languages,
                        doc.language || doc.selectedLang,
                      )}
                    </td>
                    <td>
                      ver.{" "}
                      {doc.latestVersion ||
                        doc.currentVersion ||
                        doc.version ||
                        1}
                    </td>
                    <td>
                      {getRelativeTime(
                        doc.updatedAt ||
                          doc.updated ||
                          doc.lastUpdatedAt ||
                          doc.createdAt,
                      )}
                    </td>
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
