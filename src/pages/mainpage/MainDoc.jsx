import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import CreateProjectModal from "../../components/Modal/CreateProjectModal";
import JoinProjectModal from "../../components/Modal/JoinProjectModal";
import { getDashboardApi } from "../../api/dashboard";
import {
  getTeamNotifications,
  markNotificationAsRead,
} from "../../api/teamApi";
import { getDocumentVersions } from "../../api/documentApi";
import { getRelativeTime } from "../../components/dateUtil";
import * as S from "./MainDoc.styles";

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

export default function MainDoc({
  onNavigate,
  onCreateProject,
  onJoinProject,
}) {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
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
      console.error("알림 데이터를 가져오는데 실패했습니다.", error);
    }
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getDashboardApi();
      const resData = response.data?.data || response.data || response;

      if (resData) {
        if (resData.user) setUserInfo(resData.user);
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
        if (resData.projects) {
          await fetchNotificationData(resData.projects);
        }
      }
    } catch (error) {
      console.error("문서 목록 데이터를 가져오는데 실패했습니다.", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

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

  const renderNotificationTitle = (noti) => {
    if (!noti) return "";
    const { documentName, beforeVersion, afterVersion } = noti;

    if (
      beforeVersion !== undefined &&
      beforeVersion !== null &&
      beforeVersion === afterVersion
    ) {
      return `${documentName || "문서"}_version${afterVersion}이 수정되었습니다.`;
    }

    if (
      beforeVersion !== undefined &&
      beforeVersion !== null &&
      beforeVersion !== afterVersion
    ) {
      return `${documentName || "문서"}_version${beforeVersion}이 수정되어 version${afterVersion}가 업로드 되었습니다.`;
    }

    return `${documentName || "문서"}_version${afterVersion || 1}이 수정되었습니다.`;
  };

  const renderNotificationSub = (noti) => {
    if (!noti) return "";
    const firstName = noti.performedByFirstName || "";
    const lastName = noti.performedByLastName || "";
    const author =
      `${lastName} ${firstName}`.trim() || `${firstName} ${lastName}`.trim();

    const time = noti.createdAt ? getRelativeTime(noti.createdAt) : "";

    return `${author ? `${author} 님께서 업로드 하셨어요. ` : ""}${time}`;
  };

  const displayUserName = userInfo
    ? `${userInfo.lastName || ""}${userInfo.firstName || ""}`.trim() || "사용자"
    : "사용자";

  if (loading) {
    return <S.PageWrapper>로딩 중...</S.PageWrapper>;
  }

  return (
    <S.PageWrapper>
      <Header
        activeTab="doc"
        showNav={true}
        userName={displayUserName}
        userInitial={userInfo?.initial}
        onNavigate={onNavigate}
        onCreateProject={handleOpenCreateModal}
        onJoinProject={handleOpenJoinModal}
        onRefresh={fetchDashboardData}
      />

      <S.Content>
        {notification && (
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
                <h4>{renderNotificationTitle(notification)}</h4>
                <p>{renderNotificationSub(notification)}</p>
              </S.NotificationTextContainer>
            </S.NotificationLeft>
            <S.NotificationButton onClick={handleReadNotification}>
              확인하기
            </S.NotificationButton>
          </S.NotificationBar>
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
              {documents.map((doc) => {
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
