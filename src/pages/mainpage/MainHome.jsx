import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import CreateProjectModal from "../../components/Modal/CreateProjectModal";
import JoinProjectModal from "../../components/Modal/JoinProjectModal";
import { getDashboardApi } from "../../api/dashboard";
import {
  getTeamDetail,
  getTeamNotifications,
  markNotificationAsRead,
} from "../../api/teamApi";
import { getDocumentVersions } from "../../api/documentApi";
import { getRelativeTime } from "../../components/dateUtil";
import * as S from "./MainHome.styles";

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

const getInitial = (member) => {
  if (!member) return "";
  if (typeof member === "string") return member.charAt(0).toUpperCase();
  const target =
    member.lastName || member.name || member.firstName || member.initial || "";
  return String(target).trim().charAt(0).toUpperCase();
};

export default function MainHome({
  onNavigate,
  onCreateProject,
  onJoinProject,
  onSelectProject,
}) {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [projects, setProjects] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [docLatestTimes, setDocLatestTimes] = useState({});
  const [docLatestVersions, setDocLatestVersions] = useState({});
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  const fetchNotificationData = async (projectsList) => {
    try {
      if (!projectsList || projectsList.length === 0) return;

      for (const project of projectsList) {
        const teamId = project.id;
        const notiRes = await getTeamNotifications(teamId);
        const notifications = notiRes?.data?.data || notiRes?.data || [];

        if (Array.isArray(notifications) && notifications.length > 0) {
          setNotification({ ...notifications[0], teamId: teamId });
          break;
        }
      }
    } catch (error) {
      console.error("팀 알림 조회 실패:", error);
    }
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getDashboardApi();
      const resData = response.data?.data || response.data || response;

      if (resData) {
        if (resData.user) setUserInfo(resData.user);
        if (resData.projects) {
          setProjects(resData.projects);
          await fetchNotificationData(resData.projects);
        }
        if (resData.recentDocuments) {
          const recentDocs = resData.recentDocuments;
          setDocuments(recentDocs);

          if (recentDocs.length > 0) {
            const timeMap = {};
            const verMap = {};
            await Promise.allSettled(
              recentDocs.map(async (doc) => {
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
                    verMap[dId] = Number(latestVerObj.version);
                  }
                } catch (err) {
                  console.warn(`문서(${dId}) 버전 목록 조회 스킵:`, err);
                }
              }),
            );
            setDocLatestTimes(timeMap);
            setDocLatestVersions(verMap);
          }
        }
      }
    } catch (error) {
      console.error("대시보드 데이터를 가져오는데 실패했습니다.", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // 🔥 최근 문서 클릭 핸들러 (v1이면 doc-view, v2 이상이면 doc-compare)
  const handleDocumentClick = (doc) => {
    const docId = doc.id || doc.documentId;
    const teamId = doc.teamProjectId || doc.teamId || doc.projectId;
    const latestVer =
      docLatestVersions[docId] || doc.latestVersion || doc.version || 1;

    const versionToUse = Number(latestVer);

    if (teamId) {
      localStorage.setItem("currentTeamId", String(teamId));
    }

    if (versionToUse === 1) {
      navigate(`/doc-view/${docId}`, {
        state: { docId, teamId, version: 1 },
      });
    } else {
      navigate(`/doc-compare/${docId}`, {
        state: { docId, teamId, version: versionToUse },
      });
    }
  };

  const handleReadNotification = async () => {
    if (!notification) return;

    const notifId = notification.id;
    const teamId = notification.teamId;
    const docId = notification.documentId || notification.docId;
    const versionToUse = Number(
      notification.afterVersion || notification.version || 1,
    );

    if (teamId && notifId) {
      try {
        await markNotificationAsRead(teamId, notifId);
      } catch (error) {
        console.error("알림 읽음 처리 실패:", error);
      }
    }

    setNotification(null);

    if (docId) {
      if (versionToUse === 1) {
        navigate(`/doc-view/${docId}`, {
          state: { docId, teamId, version: 1 },
        });
      } else {
        navigate(`/doc-compare/${docId}`, {
          state: { docId, teamId, version: versionToUse },
        });
      }
    }
  };

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
    if (targetId) {
      navigate(`/teamp-leader/${targetId}`);
    } else {
      fetchDashboardData();
    }
  };

  const displayUserName = userInfo
    ? `${userInfo.lastName || ""}${userInfo.firstName || ""}`.trim() || "사용자"
    : "사용자";

  const userInitial = userInfo?.initial || userInfo?.lastName?.charAt(0) || "U";

  if (loading) {
    return <S.PageWrapper>로딩 중...</S.PageWrapper>;
  }

  return (
    <S.PageWrapper>
      <Header
        activeTab="home"
        showNav={true}
        userName={displayUserName}
        userInitial={userInitial}
        onNavigate={onNavigate}
        onCreateProject={handleOpenCreateModal}
        onJoinProject={handleOpenJoinModal}
        onRefresh={fetchDashboardData}
      />

      <S.Content>
        {notification && (
          <div
            style={{
              width: "1202px",
              margin: "28px auto 0 auto",
              boxSizing: "border-box",
            }}
          >
            <S.NotificationBar>
              <S.NotificationLeft>
                <S.NotificationIconBox>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </S.NotificationIconBox>
                <S.NotificationTextContainer>
                  <h4>
                    {notification.title ||
                      `${notification.documentName || "문서"}가 수정되었습니다.`}
                  </h4>
                  <p>
                    {notification.sender
                      ? `${notification.sender} 님께서 업로드 하셨어요.`
                      : ""}
                    {notification.createdAt && (
                      <span style={{ marginLeft: "12px", color: "#8a8a8a" }}>
                        {getRelativeTime(notification.createdAt)}
                      </span>
                    )}
                  </p>
                </S.NotificationTextContainer>
              </S.NotificationLeft>
              <S.NotificationButton onClick={handleReadNotification}>
                확인하기
              </S.NotificationButton>
            </S.NotificationBar>
          </div>
        )}

        <S.Banner>
          <S.BannerText>
            <h2>안녕하세요, {displayUserName}님!</h2>
            <p>
              여러 언어의 문서를 하나의 기준으로 관리하고,
              <br />
              글로벌 팀과 함께 효율적으로 협업해 보세요!
            </p>
          </S.BannerText>
          <S.Popup />
        </S.Banner>

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
            {projects.slice(0, 4).map((p) => {
              const memberList = p.members || [];
              const displayMembers = memberList.slice(0, 3);
              const extraCount = memberList.length - 3;
              const updatedAt =
                p.updatedAt || p.lastUpdatedAt || p.modifiedAt || p.createdAt;

              return (
                <S.ProjectCard
                  key={p.id}
                  onClick={async () => {
                    if (onSelectProject) {
                      onSelectProject(p.id, p);
                      return;
                    }
                    try {
                      const res = await getTeamDetail(p.id);
                      const teamData = res.data?.data || res.data;
                      const isLeader =
                        teamData?.myRole === "LEADER" ||
                        teamData?.isLeader === true;
                      if (isLeader) navigate(`/teamp-leader/${p.id}`);
                      else navigate(`/teamp-member/${p.id}`);
                    } catch (error) {
                      navigate(`/teamp-member/${p.id}`);
                    }
                  }}
                >
                  <h4>{p.name}</h4>
                  <p className="langs">
                    {getLanguagesDisplay(p.memberLanguages, p.defaultLanguage)}
                  </p>
                  <S.AvatarGroup>
                    {displayMembers.map((m, idx) => (
                      <S.MiniAvatar
                        key={idx}
                        title={
                          typeof m === "object"
                            ? `${m.lastName || ""} ${m.firstName || m.name || ""}`.trim()
                            : String(m)
                        }
                      >
                        {getInitial(m)}
                      </S.MiniAvatar>
                    ))}
                    {extraCount > 0 && (
                      <S.MiniAvatar $isMore>+{extraCount}</S.MiniAvatar>
                    )}
                  </S.AvatarGroup>
                  <S.CardFooterText>
                    최종 업데이트 • {getRelativeTime(updatedAt)}
                  </S.CardFooterText>
                </S.ProjectCard>
              );
            })}
          </S.ProjectGrid>
        )}

        <S.SectionHeader>최근 문서</S.SectionHeader>
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
              {documents.slice(0, 5).map((doc) => {
                const docId = doc.id || doc.documentId;
                const realTime =
                  docLatestTimes[docId] ||
                  doc.latestVersionUpdatedAt ||
                  doc.versionUpdatedAt ||
                  doc.updatedAt ||
                  doc.createdAt;

                const displayVer =
                  docLatestVersions[docId] ||
                  doc.latestVersion ||
                  doc.version ||
                  1;

                return (
                  <tr
                    key={docId}
                    onClick={() => handleDocumentClick(doc)}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="doc-name">{doc.name || doc.title}</td>
                    <td>{doc.teamProjectName || "-"}</td>
                    <td>{getLanguagesDisplay(doc.languages, doc.language)}</td>
                    <td>v{displayVer}</td>
                    <td>{getRelativeTime(realTime)}</td>
                  </tr>
                );
              })}
            </tbody>
          </S.Table>
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
