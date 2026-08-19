import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import DocIcon from "../../assets/image/doc icon.svg";
import * as S from "./TeamProject.styles";
import {
  getTeamDetail,
  getTeamNotifications,
  markNotificationAsRead,
} from "../../api/teamApi";

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

export default function TeamProjectMember({ onNavigate }) {
  const navigate = useNavigate();
  const { teamId } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState({});
  const [notification, setNotification] = useState(null);

  // 1. 팀 상세 데이터 받아오기
  const fetchTeamData = async () => {
    if (!teamId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await getTeamDetail(teamId);
      const data = res.data?.data || res.data || {};
      console.log("팀 멤버 상세 데이터 응답:", data);
      setProject(data);

      const docs = data.documents || data.docs || [];
      const initialMap = {};
      docs.forEach((doc) => {
        initialMap[doc.id] =
          doc.latestVersion ||
          (doc.versions && doc.versions[doc.versions.length - 1]) ||
          1;
      });
      setSelectedVersions(initialMap);
    } catch (error) {
      console.error("팀 정보 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. 알림 데이터 받아오기
  const fetchNotification = async () => {
    if (!teamId) return;
    try {
      const res = await getTeamNotifications(teamId);
      const notifications = res.data?.data || res.data || [];
      if (Array.isArray(notifications) && notifications.length > 0) {
        setNotification(notifications[0]);
      } else {
        setNotification(null);
      }
    } catch (error) {
      console.error("알림 조회 실패:", error);
    }
  };

  // 3. 알림 읽음 처리
  const handleReadNotification = async () => {
    if (!notification) return;
    try {
      await markNotificationAsRead(teamId, notification.id);
      setNotification(null);
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);
      setNotification(null);
    }
  };

  useEffect(() => {
    fetchTeamData();
    fetchNotification();
  }, [teamId]);

  const handleVersionChange = (docId, newVersion) => {
    setSelectedVersions((prev) => ({
      ...prev,
      [docId]: newVersion,
    }));
  };

  if (loading) return <div>로딩 중...</div>;
  if (!project) return <div>프로젝트 정보를 불러올 수 없습니다.</div>;

  const docs = project.documents || project.docs || [];
  const activities = project.activityLogs || project.activities || [];
  const members = project.members || [];
  const inviteCode = project.inviteCode || "";

  const memberInitials = members
    .slice(0, 3)
    .map((m) => getInitial(m.name || m.firstName || m.lastName));
  const extraMemberCount = members.length - 3;

  const hasDocs = docs.length > 0;
  const hasActivities = activities.length > 0;

  const renderNotificationTitle = (noti) => {
    if (!noti) return "";
    const { documentName, beforeVersion, afterVersion } = noti;
    if (beforeVersion !== undefined && beforeVersion !== afterVersion) {
      return `${documentName}_Version.${beforeVersion}이 수정되어 Version.${afterVersion}가 업로드 되었습니다.`;
    }
    return `${documentName}_Version.${afterVersion || 1}이 수정되었습니다.`;
  };

  const renderNotificationSub = (noti) => {
    if (!noti) return "";
    const author = `${noti.performedByLastName || ""}${
      noti.performedByFirstName || ""
    }`.trim();
    const time = noti.createdAt
      ? noti.createdAt.replace("T", " ").slice(0, 16)
      : "";
    return `${author ? `${author} 님께서 업로드 하셨어요. ` : ""}${time}`;
  };

  return (
    <S.PageWrapper>
      <Header
        type="project"
        isLeader={false}
        onCreateDoc={null}
        onExit={() => (onNavigate ? onNavigate("home") : navigate("/home"))}
      />

      <S.Container>
        <S.MainSection>
          {/* 알림 바 */}
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

          {/* 프로젝트 배너 */}
          <S.BannerCard>
            <S.BannerTitle>{project.name || project.title}</S.BannerTitle>
            <S.BannerMeta>
              <S.MetaItem>
                <span className="label">기본 언어</span>
                <span className="value">
                  {project.defaultLanguage || project.language || "-"}
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
                  {project.createdAt?.split("T")[0] || project.createdAt || "-"}
                </span>
              </S.MetaItem>
            </S.BannerMeta>
          </S.BannerCard>

          {/* 최근 문서 카드 */}
          <S.Card>
            <S.CardHeader>
              <h3>최근 문서</h3>
              <S.MoreButton onClick={() => navigate(`/teamp-doc/${teamId}`)}>
                <span>{"전체보기 >"} </span>
              </S.MoreButton>
            </S.CardHeader>
            {hasDocs ? (
              <S.Table>
                <thead>
                  <tr>
                    <th>문서 이름</th>
                    <th>언어</th>
                    <th>버전</th>
                    <th>최종 업데이트</th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map((doc) => (
                    <tr
                      key={doc.id}
                      onClick={() => navigate(`/doc-edit/${doc.id}`)}
                    >
                      <td className="font-bold">
                        <S.TitleWithIcon>
                          <S.DocIconImg src={DocIcon} alt="문서 아이콘" />
                          <span>{doc.name || doc.title}</span>
                        </S.TitleWithIcon>
                      </td>
                      <td>
                        {doc.language ||
                          doc.selectedLang ||
                          (doc.languages && doc.languages[0]) ||
                          "-"}
                      </td>
                      <td>
                        v
                        {selectedVersions[doc.id] ||
                          doc.latestVersion ||
                          doc.currentVersion ||
                          1}
                      </td>
                      <td>{getRelativeTime(doc.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </S.Table>
            ) : (
              <S.EmptyBox>
                <S.EmptyDocIconImg src={DocIcon} alt="문서 아이콘" />
                <h4>작성한 문서가 아직 없어요</h4>
                <p>새로운 문서를 작성하고 콘텐츠를 관리해보세요.</p>
              </S.EmptyBox>
            )}
          </S.Card>

          <S.BottomRow>
            {/* 활동 요약 */}
            <S.HalfCard>
              <S.CardHeader>
                <h3>활동 요약</h3>
              </S.CardHeader>
              {hasActivities ? (
                <S.ActivityList>
                  {activities.map((act) => (
                    <S.ActivityItem key={act.id}>
                      <S.ActivityAvatar>
                        {getInitial(act.userName || act.performedByFirstName)}
                      </S.ActivityAvatar>
                      <S.ActivityContent>
                        <p>
                          {act.docTitle || act.documentName}_{act.version}이
                          업로드 되었습니다.
                        </p>
                        <span>
                          {getRelativeTime(act.updatedAt || act.createdAt)}
                        </span>
                      </S.ActivityContent>
                    </S.ActivityItem>
                  ))}
                </S.ActivityList>
              ) : (
                <S.EmptyTextContainer>
                  <p>아직 활동 내역이 없습니다.</p>
                  <p>문서가 생성되면 팀 활동을 확인할 수 있어요.</p>
                </S.EmptyTextContainer>
              )}
            </S.HalfCard>

            {/* 프로젝트 멤버 */}
            <S.HalfCard>
              <S.CardHeader>
                <h3>프로젝트 멤버</h3>
              </S.CardHeader>
              <S.MemberList>
                {members.map((member) => (
                  <S.MemberItem key={member.id}>
                    <S.MemberLeft>
                      <S.MemberAvatar>
                        {getInitial(member.name || member.firstName)}
                      </S.MemberAvatar>
                      <S.MemberName>
                        {member.name ||
                          `${member.lastName || ""} ${member.firstName || ""}`.trim()}
                      </S.MemberName>
                    </S.MemberLeft>
                    <S.RoleBadge
                      $isLeader={
                        member.isLeader ||
                        member.role === "LEADER" ||
                        member.role === "팀장"
                      }
                    >
                      {member.role === "LEADER"
                        ? "팀장"
                        : member.role || "팀원"}
                    </S.RoleBadge>
                  </S.MemberItem>
                ))}
              </S.MemberList>
              <S.InviteButton onClick={() => setIsInviteModalOpen(true)}>
                <span>+</span> 멤버 초대하기
              </S.InviteButton>
            </S.HalfCard>
          </S.BottomRow>
        </S.MainSection>

        {/* 사이드바 문서 모아보기 */}
        <S.SidebarSection>
          <S.SidebarCard>
            <S.SidebarHeader>
              <h3>문서 모아보기</h3>
              <p>프로젝트에서 관리하는 문서를 확인해보세요.</p>
            </S.SidebarHeader>

            {hasDocs ? (
              <S.GatheredList>
                {docs.map((doc) => (
                  <S.DocItemCard key={doc.id}>
                    <S.DocItemLeft
                      onClick={() => navigate(`/doc-edit/${doc.id}`)}
                    >
                      <S.SidebarDocIconImg src={DocIcon} alt="문서 아이콘" />
                      <S.DocInfo>
                        <h4>{doc.name || doc.title}</h4>
                        <p className="langs">
                          {doc.language ||
                            (doc.languages && doc.languages.join(", ")) ||
                            "-"}
                        </p>
                        <p className="time">
                          최종 업데이트 {getRelativeTime(doc.updatedAt)}
                        </p>
                      </S.DocInfo>
                    </S.DocItemLeft>

                    <S.VersionSelect
                      value={
                        selectedVersions[doc.id] ||
                        doc.latestVersion ||
                        doc.currentVersion ||
                        1
                      }
                      onChange={(e) =>
                        handleVersionChange(doc.id, e.target.value)
                      }
                    >
                      {(
                        doc.versions || [
                          doc.latestVersion || doc.currentVersion || 1,
                        ]
                      ).map((ver) => (
                        <option key={ver} value={ver}>
                          v{ver}
                        </option>
                      ))}
                    </S.VersionSelect>
                  </S.DocItemCard>
                ))}
              </S.GatheredList>
            ) : (
              <S.SidebarEmptyBox>
                <S.EmptyDocIconImg src={DocIcon} alt="문서 아이콘" />
                <h4>작성한 문서가 아직 없어요</h4>
                <p>새로운 문서를 작성하고 콘텐츠를 관리해보세요.</p>
              </S.SidebarEmptyBox>
            )}
          </S.SidebarCard>
        </S.SidebarSection>
      </S.Container>

      {/* 초대 코드 모달 */}
      {isInviteModalOpen && (
        <S.ModalOverlay onClick={() => setIsInviteModalOpen(false)}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <h3>초대 코드</h3>
              <button onClick={() => setIsInviteModalOpen(false)}>✕</button>
            </S.ModalHeader>
            <S.ModalBody>
              <p style={{ fontSize: "12px", color: "#828282" }}>
                팀원에게 아래 초대 코드를 공유해 보세요.
              </p>
              <S.CodeBox>
                <span>{inviteCode || "초대 코드를 불러올 수 없습니다."}</span>
                {inviteCode && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(inviteCode);
                      alert("초대 코드가 복사되었습니다!");
                    }}
                  >
                    복사
                  </button>
                )}
              </S.CodeBox>
            </S.ModalBody>
            <S.ModalFooter>
              <S.ModalSubmitButton onClick={() => setIsInviteModalOpen(false)}>
                확인
              </S.ModalSubmitButton>
            </S.ModalFooter>
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </S.PageWrapper>
  );
}
