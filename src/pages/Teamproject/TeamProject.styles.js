import styled from "styled-components";

// 페이지 레이아웃
export const PageWrapper = styled.div`
  background-color: #f8f9fa;
  min-height: 100vh;
  font-family: sans-serif;
  color: #000000;
`;

export const Container = styled.div`
  max-width: 1120px;
  margin: 28px auto;
  padding: 0 20px;
  display: flex;
  gap: 20px;
  align-items: stretch;
`;

export const MainSection = styled.div`
  flex: 1.6;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const SidebarSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

// 배너
export const BannerCard = styled.div`
  background: linear-gradient(90deg, #ffffff 0%, #bebaf1 150%);
  border: 1px solid #d6d5d5;
  border-radius: 12px;
  padding: 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const BannerTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #462fea;
`;

export const BannerMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
`;

export const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  .label {
    font-size: 11px;
    color: #828282;
    font-weight: 500;
  }

  .value {
    font-size: 14px;
    font-weight: 700;
    color: #000000;
  }
`;

export const AvatarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: -4px;
`;

export const MiniAvatar = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: ${(props) => (props.$isMore ? "#828282" : "#F0F1FD")};
  color: ${(props) => (props.$isMore ? "#FFFFFF" : "#462FEA")};
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffffff;
`;

// 최근 문서
export const Card = styled.div`
  background-color: #ffffff;
  border: 1px solid #d6d5d5;
  border-radius: 12px;
  padding: 20px 24px;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  margin-bottom: 16px;
  border-bottom: 1px solid #d6d5d5;

  h3 {
    font-size: 15px;
    font-weight: 700;
    color: #462fea;
    margin: 0;
  }
`;

export const MoreButton = styled.button`
  background: none;
  border: none;
  color: #828282;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;

  &:hover {
    color: #000000;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    background-color: #f0f1fd;
    color: #828282;
    font-size: 12px;
    font-weight: 500;
    padding: 10px 14px;
    text-align: left;
  }

  tbody tr {
    cursor: pointer;
    &:hover {
      background-color: #fffcfc;
    }
  }

  td {
    padding: 12px 14px;
    font-size: 12px;
    color: #000000;
    border-bottom: 1px solid #f5f5f5;
  }

  .font-bold {
    font-weight: 700;
  }
`;

export const TitleWithIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const DocIconImg = styled.img`
  width: 18px;
  height: 22px;
  object-fit: contain;
`;

export const EmptyDocIconImg = styled.img`
  width: 64px;
  height: 64px;
  object-fit: contain;
  margin-bottom: 12px;
`;

export const BottomRow = styled.div`
  display: flex;
  gap: 16px;
`;

export const HalfCard = styled(Card)`
  flex: 1;
  padding: 20px;
`;

// 활동 요약
export const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

export const ActivityAvatar = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: #f0f1fd;
  color: #462fea;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ActivityContent = styled.div`
  p {
    font-size: 12px;
    font-weight: 700;
    color: #000000;
    line-height: 1.3;
    margin-bottom: 2px;
  }

  span {
    font-size: 10px;
    color: #828282;
  }
`;

// 프로젝트 멤버
export const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

export const MemberItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const MemberLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const MemberAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid #d6d5d5;
  color: #462fea;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MemberName = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #000000;
`;

export const RoleBadge = styled.span`
  padding: 5px 14px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  background-color: ${(props) => (props.$isLeader ? "#462FEA" : "#FFFFFF")};
  color: ${(props) => (props.$isLeader ? "#FFFFFF" : "#462FEA")};
  border: ${(props) => (props.$isLeader ? "none" : "1px solid #462FEA")};
`;

export const InviteButton = styled.button`
  width: 100%;
  background: none;
  border: none;
  color: #462fea;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 6px 0;

  &:hover {
    opacity: 0.8;
  }
`;

// ==========================================
// [수정됨] 문서 모아보기 (Sidebar 영역)
// ==========================================
export const SidebarCard = styled(Card)`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
`;

export const SidebarHeader = styled.div`
  padding-bottom: 10px;
  margin-bottom: 14px;
  border-bottom: 1px solid #d6d5d5;

  h3 {
    font-size: 15px;
    font-weight: 700;
    color: #462fea;
    margin: 0 0 4px 0;
  }

  p {
    font-size: 11px;
    color: #828282;
    margin: 0;
  }
`;

export const GatheredList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  overflow-y: auto;
`;

export const DocItemCard = styled.div`
  border: 1px solid #d6d5d5;
  border-radius: 8px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
`;

export const DocItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
`;

export const SidebarDocIconImg = styled.img`
  width: 28px;
  height: 34px;
  object-fit: contain;
  flex-shrink: 0;
`;

export const DocInfo = styled.div`
  display: flex;
  flex-direction: column;

  h4 {
    font-size: 13px;
    font-weight: 700;
    color: #000000;
    margin: 0 0 3px 0;
  }

  .langs {
    font-size: 11px;
    font-weight: 700;
    color: #000000;
    margin-bottom: 2px;
  }

  .time {
    font-size: 10px;
    color: #828282;
  }
`;

export const VersionSelect = styled.select`
  background-color: #f0f1fd;
  color: #462fea;
  border: none;
  border-radius: 6px;
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 600;
  outline: none;
  cursor: pointer;
`;

// 공통 모달 및 빈 상태
export const EmptyBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 30px 0;

  h4 {
    font-size: 14px;
    font-weight: 700;
    color: #000000;
    margin: 6px 0 4px 0;
  }

  p {
    font-size: 11px;
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

  p {
    font-size: 11px;
    color: #828282;
    line-height: 1.5;
    text-align: center;
  }
`;

export const ActionButton = styled.button`
  background-color: #462fea;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 12px;
  font-weight: 600;
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
    font-weight: 700;
    color: #000000;
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
  font-weight: 600;
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
  font-weight: 600;
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
    font-weight: 600;
    color: #000000;
  }

  input,
  select {
    height: 36px;
    padding: 0 10px;
    border: 1px solid #d6d5d5;
    border-radius: 6px;
    font-size: 13px;
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
  background-color: #f0f1fd;
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid #d6d5d5;

  span {
    font-size: 14px;
    font-weight: 700;
    color: #462fea;
  }

  button {
    background-color: #ffffff;
    border: 1px solid #462fea;
    color: #462fea;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 11px;
    cursor: pointer;

    &:hover {
      background-color: #f0f1fd;
    }
  }
`;
