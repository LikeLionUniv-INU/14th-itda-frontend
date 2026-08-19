import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import CreateProjectModal from "../../components/Modal/CreateProjectModal";
import JoinProjectModal from "../../components/Modal/JoinProjectModal";
import { getDashboardApi } from "../../api/dashboard";
import * as S from "./MainHome.styles";

export default function MainHome({
  onNavigate,
  onCreateProject,
  onJoinProject,
  onSelectProject,
  onSelectDocument,
}) {
  const navigate = useNavigate();

  // 대시보드 상태 관리
  const [userInfo, setUserInfo] = useState(null);
  const [projects, setProjects] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 모달 제어 상태
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  // GET /api/dashboard 데이터 불러오기 함수
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getDashboardApi();

      // 백엔드 응답 구조 ({ data: { user, projects, recentDocuments } }) 적용
      const resData = response.data?.data || response.data || response;
      if (resData) {
        if (resData.user) setUserInfo(resData.user);
        if (resData.projects) setProjects(resData.projects);
        if (resData.recentDocuments) setDocuments(resData.recentDocuments);
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

  // 모달 열기 핸들러
  const handleOpenCreateModal = () => {
    if (onCreateProject) onCreateProject();
    else setIsCreateOpen(true);
  };

  const handleOpenJoinModal = () => {
    if (onJoinProject) onJoinProject();
    else setIsJoinOpen(true);
  };

  // 프로젝트 생성/참여 완료 시 처리
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

  // 표시할 유저 이름 (firstName + lastName)
  const displayUserName = userInfo
    ? `${userInfo.lastName || ""}${userInfo.firstName || ""}`.trim() || "사용자"
    : "사용자";

  // 프로필 이니셜 계산 (회원가입 시 들어온 성(lastName) 또는 이름(firstName)의 첫 글자 대문자)
  const getUserInitial = () => {
    if (!userInfo) return "U";
    if (userInfo.initial) return userInfo.initial.toUpperCase();
    if (userInfo.lastName) return userInfo.lastName.charAt(0).toUpperCase();
    if (userInfo.firstName) return userInfo.firstName.charAt(0).toUpperCase();
    if (userInfo.name) return userInfo.name.charAt(0).toUpperCase();
    if (userInfo.email) return userInfo.email.charAt(0).toUpperCase();
    return "U";
  };

  const userInitial = getUserInitial();

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
        {/* 상단 배너 */}
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

        {/* 내 프로젝트 */}
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
            {projects.slice(0, 4).map((p) => (
              <S.ProjectCard
                key={p.id}
                onClick={() => {
                  if (onSelectProject) {
                    onSelectProject(p.id, p);
                    return;
                  }

                  // 리더 여부 확인
                  const isLeader =
                    p.isLeader === true ||
                    p.role === "LEADER" ||
                    (userInfo?.id && p.leaderId === userInfo.id);

                  if (isLeader) {
                    navigate(`/teamp-leader/${p.id}`);
                  } else {
                    navigate(`/teamp-member/${p.id}`);
                  }
                }}
              >
                <h4>{p.name}</h4>
                <p className="langs">
                  {Array.isArray(p.memberLanguages)
                    ? p.memberLanguages.join(", ")
                    : p.defaultLanguage}
                </p>
                <S.AvatarGroup>
                  {p.members?.map((m, idx) => (
                    <S.MiniAvatar key={idx}>
                      {typeof m === "string"
                        ? m.charAt(0).toUpperCase()
                        : (m.initial || m.firstName?.charAt(0) || m.lastName?.charAt(0) || "U").toUpperCase()}
                    </S.MiniAvatar>
                  ))}
                </S.AvatarGroup>
                <p className="time">
                  {p.lastDocumentUpdatedAt
                    ? `최종 업데이트 • ${p.lastDocumentUpdatedAt}`
                    : `팀원 ${p.memberCount || 0}명`}
                </p>
              </S.ProjectCard>
            ))}
          </S.ProjectGrid>
        )}

        {/* 최근 문서 */}
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
              {documents.slice(0, 5).map((doc) => (
                <tr
                  key={doc.id}
                  onClick={() => {
                    if (onSelectDocument) {
                      onSelectDocument(doc.id, doc.latestVersion);
                    } else {
                      navigate(`/doc-edit/${doc.id}`);
                    }
                  }}
                >
                  <td className="doc-name">{doc.name}</td>
                  <td>{doc.teamProjectName || "-"}</td>
                  <td>{doc.language}</td>
                  <td>v{doc.latestVersion}</td>
                  <td>
                    {doc.updatedAt
                      ? new Date(doc.updatedAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </S.Table>
        )}
      </S.Content>

      {/* 프로젝트 생성 모달 */}
      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleModalSuccess}
      />

      {/* 프로젝트 참여 모달 */}
      <JoinProjectModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </S.PageWrapper>
  );
}