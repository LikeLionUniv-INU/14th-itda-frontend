import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import DocIcon from "../../assets/image/doc icon.svg";
import * as S from "./TeamProject.styles";

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

const EMPTY_PROJECT = {
  id: "p1",
  title: "AI 서비스 플랫폼",
  defaultLanguage: "한국어",
  createdAt: "2026.06.30",
  members: [{ id: "m1", name: "김서연", role: "팀장", isLeader: true }],
  docs: [],
  activities: [],
};

export default function TeamProjectMember({
  project = EMPTY_PROJECT,
  inviteCode = "DOC-BRIDGE-2026-X9Y8",
  onNavigate,
}) {
  const navigate = useNavigate();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const [selectedVersions, setSelectedVersions] = useState(() => {
    const initialMap = {};
    if (project.docs) {
      project.docs.forEach((doc) => {
        initialMap[doc.id] =
          doc.currentVersion || doc.versions[doc.versions.length - 1];
      });
    }
    return initialMap;
  });

  const handleVersionChange = (docId, newVersion) => {
    setSelectedVersions((prev) => ({
      ...prev,
      [docId]: newVersion,
    }));
  };

  const memberInitials = (project.members || [])
    .slice(0, 3)
    .map((m) => getInitial(m.name));
  const extraMemberCount = (project.members || []).length - 3;

  const hasDocs = project.docs && project.docs.length > 0;
  const hasActivities = project.activities && project.activities.length > 0;

  return (
    <S.PageWrapper>

      <Header
        type="project"
        isLeader={false}
        onCreateDoc={null}
        onExit={() => onNavigate && onNavigate("home")}
        />
      <S.Container>
        <S.MainSection>
          <S.BannerCard>
            <S.BannerTitle>{project.title}</S.BannerTitle>
            <S.BannerMeta>
              <S.MetaItem>
                <span className="label">기본 언어</span>
                <span className="value">{project.defaultLanguage}</span>
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
                <span className="value">{project.createdAt}</span>
              </S.MetaItem>
            </S.BannerMeta>
          </S.BannerCard>

          <S.Card>
            <S.CardHeader>
              <h3>최근 문서</h3>
              <S.MoreButton onClick={() => navigate("/teamp-doc")}>
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
                  {project.docs.map((doc) => (
                    <tr
                      key={doc.id}
                      onClick={() =>
                        onNavigate && onNavigate("docDetail", doc.id)
                      }
                    >
                      <td className="font-bold">
                        <S.TitleWithIcon>
                          <S.DocIconImg src={DocIcon} alt="문서 아이콘" />
                          <span>{doc.title}</span>
                        </S.TitleWithIcon>
                      </td>
                      <td>{doc.selectedLang || doc.languages[0]}</td>
                      <td>{selectedVersions[doc.id] || doc.currentVersion}</td>
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
            <S.HalfCard>
              <S.CardHeader>
                <h3>활동 요약</h3>
              </S.CardHeader>
              {hasActivities ? (
                <S.ActivityList>
                  {project.activities.map((act) => (
                    <S.ActivityItem key={act.id}>
                      <S.ActivityAvatar>
                        {getInitial(act.userName)}
                      </S.ActivityAvatar>
                      <S.ActivityContent>
                        <p>
                          {act.docTitle}_{act.version}이 업로드 되었습니다.
                        </p>
                        <span>{getRelativeTime(act.updatedAt)}</span>
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

            <S.HalfCard>
              <S.CardHeader>
                <h3>프로젝트 멤버</h3>
              </S.CardHeader>
              <S.MemberList>
                {(project.members || []).map((member) => (
                  <S.MemberItem key={member.id}>
                    <S.MemberLeft>
                      <S.MemberAvatar>{getInitial(member.name)}</S.MemberAvatar>
                      <S.MemberName>{member.name}</S.MemberName>
                    </S.MemberLeft>
                    <S.RoleBadge $isLeader={member.isLeader}>
                      {member.role}
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

        <S.SidebarSection>
          <S.SidebarCard>
            <S.SidebarHeader>
              <h3>문서 모아보기</h3>
              <p>프로젝트에서 관리하는 문서를 확인해보세요.</p>
            </S.SidebarHeader>

            {hasDocs ? (
              <S.GatheredList>
                {project.docs.map((doc) => (
                  <S.DocItemCard key={doc.id}>
                    <S.DocItemLeft
                      onClick={() =>
                        onNavigate && onNavigate("docDetail", doc.id)
                      }
                    >
                      <S.SidebarDocIconImg src={DocIcon} alt="문서 아이콘" />
                      <S.DocInfo>
                        <h4>{doc.title}</h4>
                        <p className="langs">{doc.languages.join(", ")}</p>
                        <p className="time">
                          최종 업데이트 {getRelativeTime(doc.updatedAt)}
                        </p>
                      </S.DocInfo>
                    </S.DocItemLeft>

                    <S.VersionSelect
                      value={selectedVersions[doc.id] || doc.currentVersion}
                      onChange={(e) =>
                        handleVersionChange(doc.id, e.target.value)
                      }
                    >
                      {doc.versions.map((ver) => (
                        <option key={ver} value={ver}>
                          {ver}
                        </option>
                      ))}
                    </S.VersionSelect>
                  </S.DocItemCard>
                ))}
              </S.GatheredList>
            ) : (
              /* 사이드바 빈 상태에서도 '새로운 문서 작성하기' 버튼 제거 */
              <S.SidebarEmptyBox>
                <S.EmptyDocIconImg src={DocIcon} alt="문서 아이콘" />
                <h4>작성한 문서가 아직 없어요</h4>
                <p>새로운 문서를 작성하고 콘텐츠를 관리해보세요.</p>
              </S.SidebarEmptyBox>
            )}
          </S.SidebarCard>
        </S.SidebarSection>
      </S.Container>

      {/* 초대 코드 모달만 유지 */}
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
                <span>{inviteCode}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(inviteCode)}
                >
                  복사
                </button>
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