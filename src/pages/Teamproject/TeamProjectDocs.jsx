import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import DocIcon from "../../assets/image/file.svg";
import { getTeamDetail } from "../../api/teamApi";
import { getDocumentVersions } from "../../api/documentApi";
import { getRelativeTime } from "../../components/dateUtil";
import * as S from "./TeamProjectDocs.styles";

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

const getLanguagesDisplay = (languages, fallback) => {
  if (Array.isArray(languages) && languages.length > 0) {
    return languages.map(getLanguageFullName).join(", ");
  }
  return getLanguageFullName(fallback);
};

const getInitial = (name) => {
  if (!name) return "";
  return String(name).trim().charAt(0).toUpperCase();
};

export default function TeamProjectDocs({ onNavigate, onSelectDocument }) {
  const navigate = useNavigate();
  const { teamId } = useParams();

  const [projectData, setProjectData] = useState(null);
  const [docLatestTimes, setDocLatestTimes] = useState({});
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
          const pData = resData.data || resData;
          setProjectData(pData);

          const docs = pData.documents || pData.docs || [];
          if (docs.length > 0) {
            const timeMap = {};
            await Promise.allSettled(
              docs.map(async (doc) => {
                const dId = doc.id || doc.documentId;
                try {
                  const vRes = await getDocumentVersions(dId);
                  const vList = vRes?.data?.data || vRes?.data || [];
                  if (Array.isArray(vList) && vList.length > 0) {
                    const latestVerObj = vList.reduce(
                      (prev, curr) =>
                        Number(curr.version) > Number(prev.version)
                          ? curr
                          : prev,
                      vList[0],
                    );
                    timeMap[dId] =
                      latestVerObj.updatedAt || latestVerObj.createdAt;
                  }
                } catch (err) {
                  console.warn(`문서(${dId}) 버전 목록 조회 스킵:`, err);
                }
              }),
            );
            setDocLatestTimes(timeMap);
          }
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

  const rawDocs = projectInfo.documents || projectInfo.docs || [];

  // 최신순(내림차순) 정렬
  const docs = [...rawDocs].sort((a, b) => {
    const aId = a.id || a.documentId;
    const bId = b.id || b.documentId;
    const timeA = new Date(
      docLatestTimes[aId] ||
        a.latestVersionUpdatedAt ||
        a.updatedAt ||
        a.createdAt ||
        0,
    ).getTime();
    const timeB = new Date(
      docLatestTimes[bId] ||
        b.latestVersionUpdatedAt ||
        b.updatedAt ||
        b.createdAt ||
        0,
    ).getTime();
    return timeB - timeA;
  });

  const members = projectInfo.members || [];
  const memberInitials = members
    .slice(0, 3)
    .map((m) => getInitial(m.name || m.firstName || m.nickname));
  const extraMemberCount = members.length - 3;

  const handleDocClick = (doc) => {
    const targetId = doc.id || doc.documentId;
    const docVersion = Number(
      doc.latestVersion || doc.currentVersion || doc.version || 1,
    );

    if (onSelectDocument) {
      onSelectDocument(targetId, isLeader, docVersion);
      return;
    }

    if (docVersion === 1) {
      if (onNavigate) {
        onNavigate("docView", targetId);
      } else {
        navigate(`/doc-view/${targetId}`, {
          state: { teamId, version: 1, docId: targetId },
        });
      }
    } else {
      if (onNavigate) {
        onNavigate("docDetail", targetId);
      } else {
        navigate(`/doc-compare/${targetId}`, {
          state: { teamId, version: docVersion, docId: targetId },
        });
      }
    }
  };

  const handleEditClick = (e, doc) => {
    e.stopPropagation();
    const targetId = doc.id || doc.documentId;
    const docVersion = Number(
      doc.latestVersion || doc.currentVersion || doc.version || 1,
    );

    localStorage.setItem("currentTeamId", String(teamId));

    if (onNavigate) {
      onNavigate("docEdit", targetId);
    } else {
      navigate(`/doc-edit/${targetId}`, {
        state: { teamId, version: docVersion, docId: targetId },
      });
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
                  {isLeader && <th style={{ width: "90px" }}></th>}
                </tr>
              </thead>
              <tbody>
                {docs.map((doc) => {
                  const docId = doc.id || doc.documentId;
                  const realTime =
                    docLatestTimes[docId] ||
                    doc.latestVersionUpdatedAt ||
                    doc.versionUpdatedAt ||
                    doc.updatedAt ||
                    doc.createdAt;

                  const docVersion = Number(
                    doc.latestVersion || doc.currentVersion || doc.version || 1,
                  );

                  return (
                    <tr
                      key={docId}
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
                      <td>ver. {docVersion}</td>
                      <td>{getRelativeTime(realTime)}</td>
                      {isLeader && (
                        <td
                          style={{ textAlign: "center" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={(e) => handleEditClick(e, doc)}
                            style={{
                              padding: "4px 10px",
                              backgroundColor: "#ffffff",
                              color: "#4f46e5",
                              border: "1px solid #4f46e5",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: "pointer",
                            }}
                          >
                            수정하기
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </S.Table>
          </S.TableContainer>
        )}
      </S.Content>
    </S.PageWrapper>
  );
}
