import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import FileIcon from "../../assets/image/file.svg";
import * as S from "./TeamProject.styles";

import CreateDocumentModal from "../../components/Modal/CreateDocumentModal";
import InviteModal from "../../components/Modal/InviteModal";

import {
  getTeamDetail,
  createTeamDocument,
  getTeamNotifications,
  markNotificationAsRead,
} from "../../api/teamApi";

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
  if (diffInDays < 30) return `${diffInDays}일 전`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}달 전`;

  return `${Math.floor(diffInMonths / 12)}년 전`;
};

const getInitial = (name) => {
  if (!name) return "";
  return String(name).trim().charAt(0).toUpperCase();
};

export default function TeamProject({ onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { teamId } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isCreateDocModalOpen, setIsCreateDocModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const [selectedVersions, setSelectedVersions] = useState({});
  const [notification, setNotification] = useState(null);

  const fetchTeamData = async () => {
    if (!teamId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      // 현재 팀 ID를 로컬스토리지에 항상 동기화
      localStorage.setItem("currentTeamId", String(teamId));

      const res = await getTeamDetail(teamId);
      const resData = res?.data;
      const data = resData?.data || resData || {};
      setProject(data);

      const docs = data.documents || data.docs || [];
      const initialMap = {};
      docs.forEach((doc) => {
        const dId = doc.id || doc.documentId;
        const ver =
          doc.latestVersion ||
          (Array.isArray(doc.versions) && doc.versions.length > 0
            ? doc.versions[doc.versions.length - 1]
            : null) ||
          doc.version ||
          1;
        initialMap[dId] = Number(ver);
      });
      setSelectedVersions(initialMap);
    } catch (error) {
      console.error("팀 정보 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotification = async () => {
    if (!teamId) return;
    try {
      const res = await getTeamNotifications(teamId);
      const notifications = res?.data?.data || res?.data || [];

      if (Array.isArray(notifications) && notifications.length > 0) {
        setNotification(notifications[0]);
      } else {
        setNotification(null);
      }
    } catch (error) {
      console.error("알림 조회 실패:", error);
    }
  };

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
  }, [teamId, location.key]);

  const handleDocumentSuccess = async (docData) => {
    setIsCreateDocModalOpen(false);
    try {
      const res = await createTeamDocument(teamId, {
        name: docData.name,
        documentType: docData.documentType,
        language: docData.language,
        version: Number(docData.version) || 1,
      });

      const resData = res?.data?.data || res?.data || {};
      const newDocId = resData.id || resData.documentId || resData.docId;

      navigate(`/doc-create`, {
        state: {
          docId: newDocId,
          teamId,
          name: docData.name,
          documentType: docData.documentType,
          language: docData.language,
          version: docData.version,
        },
      });
    } catch (error) {
      console.error("문서 생성 실패, 클라이언트 전환 진행:", error);
      navigate(`/doc-create`, {
        state: { ...docData, teamId },
      });
    }
  };

  const handleGoToAllDocs = () => {
    if (onNavigate) {
      onNavigate("teamDocs", teamId);
    } else {
      navigate(`/teamp-doc/${teamId}`);
    }
  };

  const handleVersionChange = (docId, newVersion) => {
    setSelectedVersions((prev) => ({
      ...prev,
      [docId]: Number(newVersion),
    }));
  };

  if (loading)
    return (
      <S.PageWrapper style={{ padding: "40px", textAlign: "center" }}>
        로딩 중...
      </S.PageWrapper>
    );
  if (!project)
    return (
      <S.PageWrapper style={{ padding: "40px", textAlign: "center" }}>
        프로젝트 정보를 불러올 수 없습니다.
      </S.PageWrapper>
    );

  const isLeader =
    project.myRole === "LEADER" ||
    project.isLeader === true ||
    project.role === "LEADER";

  // 문서 클릭 이동 핸들러
  const handleDocClick = (docId, targetVersion) => {
    const versionToUse = targetVersion || selectedVersions[docId] || 1;
    localStorage.setItem("currentTeamId", String(teamId));

    if (isLeader) {
      navigate(`/doc-edit/${docId}`, {
        state: {
          docId,
          teamId,
          version: versionToUse,
        },
      });
    } else {
      navigate(`/doc-compare/${docId}`, {
        state: {
          docId,
          teamId,
          version: versionToUse,
        },
      });
    }
  };

  const docs = project.documents || project.docs || [];
  const activities = (project.activityLogs || project.activities || []).slice(
    0,
    4,
  );
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
      return `${documentName}_version${beforeVersion}이 수정되어 version${afterVersion}가 업로드 되었습니다.`;
    }
    return `${documentName}_version${afterVersion || 1}이 수정되었습니다.`;
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
        isLeader={isLeader}
        onCreateDoc={isLeader ? () => setIsCreateDocModalOpen(true) : null}
        onExit={() => (onNavigate ? onNavigate("home") : navigate("/home"))}
      />

      <S.Container>
        <S.MainSection>
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
                  {getLanguageFullName(
                    project.defaultLanguage || project.language,
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
                  {project.createdAt?.split("T")[0] || project.createdAt || "-"}
                </span>
              </S.MetaItem>
            </S.BannerMeta>
          </S.BannerCard>

          {/* 최근 문서 카드 */}
          <S.RecentDocsCard>
            <S.CardHeader>
              <h3>최근 문서</h3>
              <S.MoreButton onClick={handleGoToAllDocs}>
                <span>{"전체보기 >"} </span>
              </S.MoreButton>
            </S.CardHeader>
            {hasDocs ? (
              <S.TableContainer>
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
                    {docs.slice(0, 5).map((doc, idx) => {
                      const docId = doc.id || doc.documentId;
                      const latestVer =
                        selectedVersions[docId] ||
                        doc.latestVersion ||
                        (Array.isArray(doc.versions) && doc.versions.length > 0
                          ? doc.versions[doc.versions.length - 1]
                          : null) ||
                        doc.version ||
                        1;

                      return (
                        <tr
                          key={docId}
                          onClick={() => handleDocClick(docId, latestVer)}
                        >
                          <td className={idx < 2 ? "doc-title" : "plain-title"}>
                            <span>{doc.name || doc.title}</span>
                          </td>
                          <td>
                            {getLanguagesDisplay(
                              doc.languages,
                              doc.language || doc.selectedLang,
                            )}
                          </td>
                          <td>ver.{latestVer}</td>
                          <td>
                            {getRelativeTime(
                              doc.updatedAt ||
                                doc.lastUpdatedAt ||
                                doc.modifiedAt ||
                                doc.createdAt,
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </S.Table>
              </S.TableContainer>
            ) : (
              <S.EmptyBox>
                <S.EmptyDocIconImg src={FileIcon} alt="문서 아이콘" />
                <h4>작성한 문서가 아직 없어요</h4>
                <p>새로운 문서를 작성하고 콘텐츠를 관리해보세요.</p>
                {isLeader && (
                  <S.ActionButton onClick={() => setIsCreateDocModalOpen(true)}>
                    새로운 문서 작성하기
                  </S.ActionButton>
                )}
              </S.EmptyBox>
            )}
          </S.RecentDocsCard>

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
                          {act.docTitle || act.documentName}_version
                          {act.version}이 업로드 되었습니다.
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
              <S.MemberListScrollWrapper>
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
                      {member.isLeader ||
                      member.role === "LEADER" ||
                      member.role === "팀장"
                        ? "팀장"
                        : "팀원"}
                    </S.RoleBadge>
                  </S.MemberItem>
                ))}
              </S.MemberListScrollWrapper>

              {/* 초대 버튼 */}
              <S.InviteButton onClick={() => setIsInviteModalOpen(true)}>
                <span>+</span> 멤버 초대하기
              </S.InviteButton>
            </S.HalfCard>
          </S.BottomRow>
        </S.MainSection>

        {/* 사이드바 - 문서 모아보기 */}
        <S.SidebarSection>
          <S.SidebarCard>
            <S.SidebarHeader>
              <h3>문서 모아보기</h3>
              <p>프로젝트에서 관리하는 문서를 확인해보세요.</p>
            </S.SidebarHeader>

            {hasDocs ? (
              <S.GatheredListScrollWrapper>
                {docs.map((doc) => {
                  const docId = doc.id || doc.documentId;
                  const targetVer =
                    selectedVersions[docId] ||
                    doc.latestVersion ||
                    (Array.isArray(doc.versions) && doc.versions.length > 0
                      ? doc.versions[doc.versions.length - 1]
                      : null) ||
                    doc.version ||
                    1;

                  return (
                    <S.DocItemCard key={docId}>
                      <S.DocItemLeft
                        onClick={() => handleDocClick(docId, targetVer)}
                      >
                        <S.SidebarDocIconImg src={FileIcon} alt="문서 아이콘" />
                        <S.DocInfo>
                          <h4>{doc.name || doc.title}</h4>
                          <p className="langs">
                            {getLanguagesDisplay(
                              doc.languages,
                              doc.language || doc.selectedLang,
                            )}
                          </p>
                          <p className="time">
                            최종 업데이트{" "}
                            {getRelativeTime(
                              doc.updatedAt ||
                                doc.lastUpdatedAt ||
                                doc.modifiedAt ||
                                doc.createdAt,
                            )}
                          </p>
                        </S.DocInfo>
                      </S.DocItemLeft>

                      <S.VersionSelect
                        value={targetVer}
                        onChange={(e) =>
                          handleVersionChange(docId, e.target.value)
                        }
                      >
                        {(
                          doc.versions || [
                            doc.latestVersion || doc.currentVersion || 1,
                          ]
                        ).map((ver) => (
                          <option key={ver} value={ver}>
                            ver. {ver}
                          </option>
                        ))}
                      </S.VersionSelect>
                    </S.DocItemCard>
                  );
                })}
              </S.GatheredListScrollWrapper>
            ) : (
              <S.SidebarEmptyBox>
                <S.EmptyDocIconImg src={FileIcon} alt="문서 아이콘" />
                <h4>작성한 문서가 아직 없어요</h4>
                <p>새로운 문서를 작성하고 콘텐츠를 관리해보세요.</p>
                {isLeader && (
                  <S.ActionButton onClick={() => setIsCreateDocModalOpen(true)}>
                    새로운 문서 작성하기
                  </S.ActionButton>
                )}
              </S.SidebarEmptyBox>
            )}
          </S.SidebarCard>
        </S.SidebarSection>
      </S.Container>

      {/* 1. 문서 생성 모달 */}
      <CreateDocumentModal
        isOpen={isCreateDocModalOpen}
        onClose={() => {
          setIsCreateDocModalOpen(false);
          fetchTeamData();
        }}
        onSuccess={handleDocumentSuccess}
      />

      {/* 2. 전용 팀 초대 코드 모달 */}
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        inviteCode={inviteCode}
      />
    </S.PageWrapper>
  );
}
