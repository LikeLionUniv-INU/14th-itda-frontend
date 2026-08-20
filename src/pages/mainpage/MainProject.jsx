import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import CreateProjectModal from "../../components/Modal/CreateProjectModal";
import JoinProjectModal from "../../components/Modal/JoinProjectModal";
import { getDashboardApi } from "../../api/dashboard"; 
import { getTeamNotifications, markNotificationAsRead, getTeamDetail } from "../../api/teamApi";
import * as S from "./MainProject.styles";

export default function MainProject({
  onNavigate,
  onCreateProject,
  onJoinProject,
  onSelectProject,
}) {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [projects, setProjects] = useState([]);
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
        if (resData.projects) {
          setProjects(resData.projects);
          await fetchNotificationData(resData.projects);
        }
      }
    } catch (error) {
      console.error("데이터를 가져오는데 실패했습니다.", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleReadNotification = async () => {
    if (!notification) return;

    const notifId = notification.id;
    const teamId = notification.teamId;
    const docId = notification.documentId || notification.docId;
    const versionToUse = notification.afterVersion || notification.version || 1;

    if (teamId && notifId) {
      try {
        await markNotificationAsRead(teamId, notifId);
      } catch (error) {
        console.error("알림 읽음 처리 실패:", error);
      }
    }

    setNotification(null);

    if (docId) {
      navigate(`/doc-edit/${docId}`, {
        state: { docId, teamId, version: versionToUse },
      });
    }
  };

  const renderNotificationTitle = (noti) => {
    if (!noti) return "";
    if (noti.title) return noti.title;
    const { documentName, beforeVersion, afterVersion } = noti;
    if (beforeVersion !== undefined && afterVersion !== undefined) {
      return `${documentName || "문서"}_version${beforeVersion}이 수정되어 version${afterVersion}가 업로드 되었습니다.`;
    }
    return `${documentName || "문서"}가 수정되었습니다.`;
  };

  const renderNotificationSub = (noti) => {
    if (!noti) return "";
    if (noti.sender) return `${noti.sender} 님께서 업로드 하셨어요.`;
    const firstName = noti.performedByFirstName || "";
    const lastName = noti.performedByLastName || "";
    const author = `${lastName}${firstName}`.trim();
    return author ? `${author} 님께서 업로드 하셨어요.` : "";
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
    if (targetId) navigate(`/teamp-leader/${targetId}`);
    else fetchDashboardData();
  };

  const displayUserName = userInfo
    ? `${userInfo.lastName || ""}${userInfo.firstName || ""}`.trim() || "사용자"
    : "사용자";

  if (loading) return <S.PageWrapper>로딩 중...</S.PageWrapper>;

  return (
    <S.PageWrapper>
      <Header
        activeTab="project"
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </S.NotificationIconBox>
              <S.NotificationTextContainer>
                <h4>{renderNotificationTitle(notification)}</h4>
                <p>
                  {renderNotificationSub(notification)}
                  {notification.createdAt && (
                    <span style={{ marginLeft: "12px", color: "#8a8a8a" }}>
                      {notification.createdAt.replace("T", " ").slice(0, 16)}
                    </span>
                  )}
                </p>
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
            <p>여러 언어의 문서를 하나의 기준으로 관리하고,<br />글로벌 팀과 함께 효율적으로 협업해 보세요!</p>
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
            {projects.map((p) => (
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
                    const isLeader = teamData?.myRole === "LEADER" || teamData?.isLeader === true;
                    if (isLeader) navigate(`/teamp-leader/${p.id}`);
                    else navigate(`/teamp-member/${p.id}`);
                  } catch (error) {
                    navigate(`/teamp-member/${p.id}`);
                  }
                }}
              >
                <h4>{p.name}</h4>
                <p className="langs">{Array.isArray(p.memberLanguages) ? p.memberLanguages.join(", ") : p.defaultLanguage}</p>
                <S.AvatarGroup>
                  {p.members?.map((m, idx) => (
                    <S.MiniAvatar key={idx}>{typeof m === "string" ? m.charAt(0) : "U"}</S.MiniAvatar>
                  ))}
                </S.AvatarGroup>
              </S.ProjectCard>
            ))}
          </S.ProjectGrid>
        )}
      </S.Content>

      <CreateProjectModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={handleModalSuccess} />
      <JoinProjectModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} onSuccess={handleModalSuccess} />
    </S.PageWrapper>
  );
}