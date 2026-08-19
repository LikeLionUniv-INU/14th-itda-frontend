import styled from "styled-components";

// 페이지 레이아웃
export const PageWrapper = styled.div`
  background-color: #f8f9fa;
  min-height: 100vh;
  font-family:
    "Pretendard",
    -apple-system,
    BlinkMacSystemFont,
    system-ui,
    Roboto,
    sans-serif;
  color: #000000;
  display: flex;
  flex-direction: column;
`;

export const Container = styled.div`
  max-width: 1240px;
  width: 100%;
  margin: 28px auto;
  padding: 0 20px 80px 20px;
  display: grid;
  grid-template-columns: 792px 387px;
  gap: 24px;
  align-items: start;
  box-sizing: border-box;

  @media (max-width: 1240px) {
    grid-template-columns: 1fr;
    max-width: 792px;
  }
`;

export const MainSection = styled.div`
  width: 792px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;

  @media (max-width: 1240px) {
    width: 100%;
  }
`;

export const SidebarSection = styled.div`
  width: 387px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  @media (max-width: 1240px) {
    width: 100%;
  }
`;

// [배너 카드] banner.svg 직접 렌더링을 위한 상대 위치 박스
export const BannerCard = styled.div`
  width: 100%;
  height: 128px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-sizing: border-box;
`;

export const BannerBgImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  z-index: 1;
`;

export const BannerContent = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  padding: 0 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
`;

export const BannerTitle = styled.h2`
  font-size: 32px;
  font-weight: 700; /* Bold */
  color: #3b28cc;
  margin: 0;
  letter-spacing: -0.5px;
`;

export const BannerMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 36px;
`;

export const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .label {
    font-size: 13px;
    color: #111827;
    font-weight: 600; /* SemiBold */
  }

  .value {
    font-size: 18px;
    font-weight: 700; /* Bold */
    color: #111827;
    letter-spacing: -0.3px;
  }
`;

export const AvatarGroup = styled.div`
  display: flex;
  align-items: center;
`;

export const MiniAvatar = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: ${(props) => (props.$isMore ? "#f3f4f6" : "#ffffff")};
  color: ${(props) => (props.$isMore ? "#111827" : "#462fea")};
  font-size: 11px;
  font-weight: 700; /* Bold */
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #d8b4fe;
  margin-left: -5px;

  &:first-child {
    margin-left: 0;
  }
`;

// [최근 문서 카드]
export const RecentDocsCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 24px 28px;
  min-height: 356px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  margin-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;

  h3 {
    font-size: 17px;
    font-weight: 700; /* Bold */
    color: #3b28cc;
    margin: 0;
  }
`;

export const MoreButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  font-size: 13px;
  font-weight: 600; /* SemiBold */
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;

  &:hover {
    color: #111827;
  }
`;

// [최근 문서 테이블]
export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  thead tr {
    background-color: #f5f3fd;
  }

  th {
    color: #6b7280;
    font-size: 13px;
    font-weight: 600; /* SemiBold */
    padding: 12px 20px;
    text-align: left;

    &:first-child {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }
    &:last-child {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
    }
  }

  tbody tr {
    cursor: pointer;
    transition: background-color 0.15s ease;
    &:hover {
      background-color: #faf5ff;
    }
  }

  td {
    padding: 16px 20px;
    font-size: 13.5px;
    font-weight: 700; /* Bold */
    color: #111827;
    border-bottom: 1px solid #f0f0f0;

    &.doc-title {
      font-weight: 700; /* Bold */
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    &.plain-title {
      font-weight: 700; /* Bold */
      text-decoration: none;
    }
  }
`;

export const TitleWithIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const DocIconImg = styled.img`
  width: 18px;
  height: 18px;
  object-fit: contain;
`;

export const EmptyDocIconImg = styled.img`
  width: 52px;
  height: 52px;
  object-fit: contain;
  margin-bottom: 12px;
`;

// 하단 2열 영역 (W 791px, H 321px)
export const BottomRow = styled.div`
  display: grid;
  grid-template-columns: 385.5px 385.5px;
  gap: 20px;
  box-sizing: border-box;

  @media (max-width: 1240px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const HalfCard = styled.div`
  width: 385.5px;
  height: 321px;
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);

  @media (max-width: 1240px) {
    width: 100%;
  }
`;

// 활동 요약
export const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 4px;
`;

export const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ActivityAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #f5f3ff;
  color: #462fea;
  font-size: 11px;
  font-weight: 700; /* Bold */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid #e9d5ff;
`;

export const ActivityContent = styled.div`
  p {
    font-size: 13px;
    font-weight: 700; /* Bold */
    color: #111827;
    line-height: 1.3;
    margin: 0 0 2px 0;
  }

  span {
    font-size: 11px;
    font-weight: 600; /* SemiBold */
    color: #828282;
  }
`;

// 프로젝트 멤버
export const MemberListScrollWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 4px;
  }
`;

export const MemberItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const MemberLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const MemberAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #f5f3ff;
  border: 1px solid #e9d5ff;
  color: #462fea;
  font-size: 11px;
  font-weight: 700; /* Bold */
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MemberName = styled.span`
  font-size: 13.5px;
  font-weight: 700; /* Bold */
  color: #111827;
`;

export const RoleBadge = styled.span`
  padding: 5px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700; /* Bold */
  background-color: ${(props) => (props.$isLeader ? "#462fea" : "#ffffff")};
  color: ${(props) => (props.$isLeader ? "#ffffff" : "#462fea")};
  border: ${(props) => (props.$isLeader ? "none" : "1px solid #462fea")};
`;

export const InviteButton = styled.button`
  width: 100%;
  background: none;
  border: none;
  color: #462fea;
  font-size: 13px;
  font-weight: 700; /* Bold */
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 6px 0;
  margin-top: auto;

  &:hover {
    opacity: 0.8;
  }
`;

// [사이드바 - 문서 모아보기]
export const SidebarCard = styled.div`
  width: 387px;
  height: 866px;
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 24px 13px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);

  @media (max-width: 1240px) {
    width: 100%;
    height: auto;
    max-height: 866px;
  }
`;

export const SidebarHeader = styled.div`
  padding: 0 8px 12px 8px;
  margin-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;

  h3 {
    font-size: 17px;
    font-weight: 700; /* Bold */
    color: #3b28cc;
    margin: 0 0 4px 0;
  }

  p {
    font-size: 12px;
    font-weight: 600; /* SemiBold */
    color: #6b7280;
    margin: 0;
  }
`;

export const GatheredListScrollWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  overflow-y: auto;
  padding: 0 4px;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 4px;
  }
`;

// [사이드바 카드: W 360px × H 90px 고정, 배경색 #FFFFFF]
export const DocItemCard = styled.div`
  width: 360px;
  height: 90px;
  min-height: 90px;
  border: 1px solid #e9d5ff;
  border-radius: 12px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  box-sizing: border-box;
  margin: 0 auto;
`;

export const DocItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex: 1;
  overflow: hidden;
`;

// [file.svg 단독 52px × 52px]
export const SidebarDocIconImg = styled.img`
  width: 52px;
  height: 52px;
  min-width: 52px;
  object-fit: contain;
  flex-shrink: 0;
`;

export const DocInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  overflow: hidden;

  h4 {
    font-size: 14px;
    font-weight: 700; /* Bold */
    color: #111827;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .langs {
    font-size: 12px;
    font-weight: 700; /* Bold */
    color: #111827;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 170px;
  }

  .time {
    font-size: 11px;
    font-weight: 600; /* SemiBold */
    color: #828282;
    margin: 0;
    white-space: nowrap;
  }
`;

// [버전 셀렉트: 80px × 34px, #142FDF / #F5F3FD / #C9C1EB]
export const VersionSelect = styled.select`
  width: 80px;
  height: 34px;
  min-width: 80px;
  background-color: #f5f3fd;
  color: #142fdf;
  border: 1px solid #c9c1eb;
  border-radius: 8px;
  padding: 0 8px;
  font-size: 13px;
  font-weight: 700; /* Bold */
  outline: none;
  cursor: pointer;
  text-align: center;
  box-sizing: border-box;

  &:hover {
    background-color: #ede9fe;
  }
`;

// 빈 상태 & 공통 모달
export const EmptyBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 30px 0;

  h4 {
    font-size: 14px;
    font-weight: 700; /* Bold */
    color: #111827;
    margin: 6px 0 4px 0;
  }

  p {
    font-size: 12px;
    font-weight: 600; /* SemiBold */
    color: #828282;
    margin-bottom: 16px;
  }
`;

export const SidebarEmptyBox = styled(EmptyBox)`
  padding: 40px 0;
`;

export const EmptyTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  margin: auto 0;

  p {
    font-size: 12px;
    font-weight: 600; /* SemiBold */
    color: #828282;
    line-height: 1.5;
    text-align: center;
    margin: 0;
  }
`;

export const ActionButton = styled.button`
  background-color: #462fea;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 700; /* Bold */
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

export const ModalContent = styled.div`
  background-color: #ffffff;
  width: 360px;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    font-size: 16px;
    font-weight: 700; /* Bold */
    color: #111827;
    margin: 0;
  }

  button {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: #828282;
  }
`;

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

export const ModalCancelButton = styled.button`
  height: 36px;
  padding: 0 16px;
  background-color: #ffffff;
  border: 1px solid #462fea;
  color: #462fea;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600; /* SemiBold */
  cursor: pointer;

  &:hover {
    background-color: #f0f1fd;
  }
`;

export const ModalSubmitButton = styled.button`
  height: 36px;
  padding: 0 20px;
  background-color: #462fea;
  border: none;
  color: #ffffff;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700; /* Bold */
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 12px;
    font-weight: 700; /* Bold */
    color: #111827;
  }

  input,
  select {
    height: 36px;
    padding: 0 10px;
    border: 1px solid #d6d5d5;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600; /* SemiBold */
    outline: none;

    &:focus {
      border-color: #462fea;
    }
  }
`;

export const CodeBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f5f3fd;
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid #d8b4fe;

  span {
    font-size: 14px;
    font-weight: 700; /* Bold */
    color: #462fea;
  }

  button {
    background-color: #ffffff;
    border: 1px solid #462fea;
    color: #462fea;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 11px;
    font-weight: 700; /* Bold */
    cursor: pointer;

    &:hover {
      background-color: #f0f1fd;
    }
  }
`;

// 알림 바
export const NotificationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ebf2ff;
  border: 1px solid #bed8ff;
  border-radius: 12px;
  padding: 16px 24px;
  margin-bottom: 4px;
`;

export const NotificationLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const NotificationIconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 1px solid #dce8ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2f65f6;
  flex-shrink: 0;
`;

export const NotificationTextContainer = styled.div`
  display: flex;
  flex-direction: column;

  h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 700; /* Bold */
    color: #111111;
  }

  p {
    margin: 4px 0 0 0;
    font-size: 12px;
    font-weight: 600; /* SemiBold */
    color: #666666;
  }
`;

export const NotificationButton = styled.button`
  background-color: #2f65f6;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 700; /* Bold */
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: #1d4ed8;
  }
`;
