import React, { useState } from "react";
import * as S from "./TeamProjectLeader.styles";

// 상대 시간 계산 함수 (현재시간 - 업데이트 시간)
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

// 성 이니셜 추출 함수 (한국어 첫 글자 / 영문 첫 글자 대문자)
const getInitial = (name) => {
  if (!name) return "";
  return name.trim().charAt(0).toUpperCase();
};

// 백엔드 연동 전 더미 데이터 예시
const DUMMY_PROJECT = {
  id: "p1",
  title: "AI 서비스 플랫폼",
  defaultLanguage: "한국어",
  createdAt: "2026.06.30",
  members: [
    { id: "m1", name: "김서연", role: "팀장", isLeader: true },
    { id: "m2", name: "Sarah", role: "팀원", isLeader: false },
    { id: "m3", name: "남건후", role: "팀원", isLeader: false },
    { id: "m4", name: "Emily", role: "팀원", isLeader: false },
    { id: "m5", name: "박지성", role: "팀원", isLeader: false },
  ],
  // 테스트 시 docs를 []로 바꾸면 '아직 데이터 없을 시' 화면으로 전환됩니다.
  docs: [
    {
      id: "d1",
      title: "기능 명세서",
      projectName: "AI 서비스 플랫폼",
      languages: ["한국어", "English", "日本語"],
      selectedLang: "한국어",
      versions: ["ver. 1", "ver. 2"],
      currentVersion: "ver. 1",
      updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2시간 전
    },
    {
      id: "d2",
      title: "화면 설계서",
      projectName: "AI 서비스 플랫폼",
      languages: ["한국어", "English", "日本語"],
      selectedLang: "English",
      versions: ["ver. 1"],
      currentVersion: "ver. 1",
      updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: "d3",
      title: "스토리보드",
      projectName: "AI 서비스 플랫폼",
      languages: ["한국어", "English", "日本語"],
      selectedLang: "한국어",
      versions: ["ver. 1", "ver. 2", "ver. 3"],
      currentVersion: "ver. 3",
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1일 전
    },
    {
      id: "d4",
      title: "기획서",
      projectName: "AI 서비스 플랫폼",
      languages: ["한국어", "English", "日本語"],
      selectedLang: "한국어",
      versions: ["ver. 1", "ver. 2"],
      currentVersion: "ver. 2",
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2일 전
    },
  ],
  activities: [
    {
      id: "a1",
      userName: "김서연",
      docTitle: "스토리보드",
      version: "version3",
      updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1시간 전
    },
    {
      id: "a2",
      userName: "김서연",
      docTitle: "스토리보드",
      version: "version2",
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: "a3",
      userName: "남건후",
      docTitle: "스토리보드",
      version: "version1",
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
  ],
};

export default function TeamProjectLeader({
  isLeader = true, // 팀장 여부 (true: [문서 생성] 버튼 노출, false: 미노출)
  project = DUMMY_PROJECT,
  inviteCode = "DOC-BRIDGE-2026-X9Y8",
  onNavigate, // 페이지 이동 핸들러
}) {
  // 모달 상태 관리
  const [isCreateDocModalOpen, setIsCreateDocModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // 문서 모아보기 드롭다운 상태 관리 (문서 ID : 선택된 버전)
  const [selectedVersions, setSelectedVersions] = useState(() => {
    const initialMap = {};
    project.docs.forEach((doc) => {
      // default는 가장 최근 버전
      initialMap[doc.id] =
        doc.currentVersion || doc.versions[doc.versions.length - 1];
    });
    return initialMap;
  });

  const handleVersionChange = (docId, newVersion) => {
    setSelectedVersions((prev) => ({
      ...prev,
      [docId]: newVersion,
    }));
  };

  // 배너 참여자 성 이니셜 노출 처리 (최대 3개까지, 그 이상은 +N 처리)
  const memberInitials = project.members
    .slice(0, 3)
    .map((m) => getInitial(m.name));
  const extraMemberCount = project.members.length - 3;

  const hasDocs = project.docs && project.docs.length > 0;
  const hasActivities = project.activities && project.activities.length > 0;

  return (
    <S.PageWrapper>
      {/* 1. 네비게이션 */}
      <S.Header>
        <S.HeaderLeft onClick={() => onNavigate && onNavigate("home")}>
          <S.LogoPlaceholder />
        </S.HeaderLeft>
        <S.HeaderRight>
          {/* 팀장 화면에서만 [문서 생성] 버튼 노출 */}
          {isLeader && (
            <S.OutlineButton onClick={() => setIsCreateDocModalOpen(true)}>
              문서 생성
            </S.OutlineButton>
          )}
          {/* [나가기] 누르면 메인화면으로 이동 */}
          <S.PrimaryButton onClick={() => onNavigate && onNavigate("home")}>
            나가기
          </S.PrimaryButton>
        </S.HeaderRight>
      </S.Header>

      <S.Container>
        {/* 메인 좌측 콘텐츠 */}
        <S.MainSection>
          {/* 2. 배너 */}
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

          {/* 3. 최근 문서 */}
          <S.Card>
            <S.CardHeader>
              <h3>최근 문서</h3>
              <S.MoreButton onClick={() => onNavigate && onNavigate("docList")}>
                <span>전체보기</span>
                <S.ArrowPlaceholder />
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
                      <td className="font-bold">{doc.title}</td>
                      <td>{doc.selectedLang || doc.languages[0]}</td>
                      <td>{selectedVersions[doc.id] || doc.currentVersion}</td>
                      <td>{getRelativeTime(doc.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </S.Table>
            ) : (
              /* 데이터 없을 시 화면 디자인 */
              <S.EmptyBox>
                <S.EmptyIconPlaceholder />
                <h4>작성한 문서가 아직 없어요</h4>
                <p>새로운 문서를 작성하고 콘텐츠를 관리해보세요.</p>
                {isLeader && (
                  <S.ActionButton onClick={() => setIsCreateDocModalOpen(true)}>
                    새로운 문서 작성하기
                  </S.ActionButton>
                )}
              </S.EmptyBox>
            )}
          </S.Card>

          {/* 하단 영역 (활동 요약 / 프로젝트 멤버) */}
          <S.BottomRow>
            {/* 4. 활동 요약 */}
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

            {/* 5. 프로젝트 멤버 */}
            <S.HalfCard>
              <S.CardHeader>
                <h3>프로젝트 멤버</h3>
              </S.CardHeader>
              <S.MemberList>
                {project.members.map((member) => (
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
              {/* 멤버 초대하기 클릭 시 초대코드 모달 오픈 */}
              <S.InviteButton onClick={() => setIsInviteModalOpen(true)}>
                <span>+</span> 멤버 초대하기
              </S.InviteButton>
            </S.HalfCard>
          </S.BottomRow>
        </S.MainSection>

        {/* 6. 문서 모아보기 (우측 사이드바) */}
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
                      <S.DocIconPlaceholder />
                      <S.DocInfo>
                        <h4>{doc.title}</h4>
                        <p className="langs">{doc.languages.join(", ")}</p>
                        <p className="time">
                          최종 업데이트 {getRelativeTime(doc.updatedAt)}
                        </p>
                      </S.DocInfo>
                    </S.DocItemLeft>

                    {/* 버전을 드롭다운으로 선택해 보기 (Default: 최근 버전) */}
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
              <S.SidebarEmptyBox>
                <S.EmptyIconPlaceholder />
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

      {/* --- 모달 영역 --- */}

      {/* 문서 생성 모달 */}
      {isCreateDocModalOpen && (
        <S.ModalOverlay onClick={() => setIsCreateDocModalOpen(false)}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <h3>문서 생성</h3>
              <button onClick={() => setIsCreateDocModalOpen(false)}>✕</button>
            </S.ModalHeader>
            <S.ModalBody>
              <S.InputGroup>
                <label>문서 제목</label>
                <input type="text" placeholder="문서 제목을 입력해 주세요." />
              </S.InputGroup>
              <S.InputGroup>
                <label>문서 종류</label>
                <select>
                  <option value="기능 명세서">기능 명세서</option>
                  <option value="화면 설계서">화면 설계서</option>
                  <option value="스토리보드">스토리보드</option>
                  <option value="기획서">기획서</option>
                  <option value="회의록">회의록</option>
                </select>
              </S.InputGroup>
            </S.ModalBody>
            <S.ModalFooter>
              <S.OutlineButton onClick={() => setIsCreateDocModalOpen(false)}>
                취소
              </S.OutlineButton>
              <S.PrimaryButton
                onClick={() => {
                  setIsCreateDocModalOpen(false);
                  onNavigate && onNavigate("docCreate");
                }}
              >
                생성하기
              </S.PrimaryButton>
            </S.ModalFooter>
          </S.ModalContent>
        </S.ModalOverlay>
      )}

      {/* 초대 코드 노출 모달 */}
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
              <S.PrimaryButton onClick={() => setIsInviteModalOpen(false)}>
                확인
              </S.PrimaryButton>
            </S.ModalFooter>
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </S.PageWrapper>
  );
}
