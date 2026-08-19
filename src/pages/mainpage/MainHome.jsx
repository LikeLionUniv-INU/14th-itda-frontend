import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import CreateProjectModal from "../../components/Modal/CreateProjectModal";
import JoinProjectModal from "../../components/Modal/JoinProjectModal";
import { getDashboardApi } from "../../api/dashboard";
import * as S from "./MainHome.styles";
import { getTeamDetail } from "../../api/teamApi";

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

  // 자체 모달 제어 상태
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  // GET /api/dashboard 데이터 불러오기
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

  // 모달 오픈 핸들러 (props 우선, 없으면 자체 모달 open)
  const handleOpenCreateModal = () => {
    if (onCreateProject) onCreateProject();
    else setIsCreateOpen(true);
  };

  const handleOpenJoinModal = () => {
    if (onJoinProject) onJoinProject();
    else setIsJoinOpen(true);
  };

  // 모달 생성/참여 성공 시 처리 콜백
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

  if (loading) {
    return <S.PageWrapper>로딩 중...</S.PageWrapper>;
  }

  return (
    <S.PageWrapper>
      <Header
        activeTab="home"
        showNav={true}
        userName={displayUserName}
        userInitial={userInfo?.initial}
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
                onClick={async () => {
                  if (onSelectProject) {
                    onSelectProject(p.id, p);
                    return;
                  }

                  try {
                    // 해당 팀의 상세 정보를 조회하여 나의 실제 권한(myRole) 확인
                    const res = await getTeamDetail(p.id);
                    const teamData = res.data?.data || res.data;

                    const isLeader =
                      teamData?.myRole === "LEADER" ||
                      teamData?.isLeader === true ||
                      teamData?.role === "LEADER";

                    if (isLeader) {
                      navigate(`/teamp-leader/${p.id}`);
                    } else {
                      navigate(`/teamp-member/${p.id}`);
                    }
                  } catch (error) {
                    console.error("팀 권한 확인 실패:", error);
                    // 조회 실패 시 기본 멤버 경로로 이동
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
                        ? m.charAt(0)
                        : m.initial || m.firstName?.charAt(0)}
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
                      // App.jsx에 등록된 /doc-edit/:docId 경로로 이동
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
