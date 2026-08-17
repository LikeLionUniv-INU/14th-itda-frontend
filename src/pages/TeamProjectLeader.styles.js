import styled from "styled-components";

export const PageWrapper = styled.div`
  background-color: #FFFCFC;
  min-height: 100vh;
  font-family: sans-serif;
  color: #000000;
`;

export const Header = styled.header`
  height: 64px;
  background-color: #FFFFFF;
  border-bottom: 1px solid #DCDCDC;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
`;

export const HeaderLeft = styled.div`
  cursor: pointer;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const OutlineButton = styled.button`
  height: 36px;
  padding: 0 16px;
  background-color: #FFFFFF;
  border: 1px solid #4253E2;
  color: #4253E2;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #F0F1FD;
  }
`;

export const PrimaryButton = styled.button`
  height: 36px;
  padding: 0 20px;
  background-color: #4253E2;
  border: none;
  color: #FFFFFF;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #3138E7;
  }
`;

export const Container = styled.div`
  max-width: 1120px;
  margin: 28px auto;
  padding: 0 20px;
  display: flex;
  gap: 20px;
`;

export const MainSection = styled.div`
  flex: 1.6;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const SidebarSection = styled.div`
  flex: 1;
`;

export const BannerCard = styled.div`
  background: linear-gradient(135deg, #F0F1FD 0%, #FFFFFF 100%);
  border: 1px solid #DCDCDC;
  border-radius: 12px;
  padding: 28px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const BannerTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #2942F1;
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
  color: ${(props) => (props.$isMore ? "#FFFFFF" : "#4253E2")};
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #FFFFFF;
`;

export const Card = styled.div`
  background-color: #FFFFFF;
  border: 1px solid #DCDCDC;
  border-radius: 12px;
  padding: 24px;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  h3 {
    font-size: 15px;
    font-weight: 700;
    color: #3138E7;
  }
`;

export const MoreButton = styled.button`
  background: none;
  border: none;
  color: #828282;
  font-size: 12px;
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
    background-color: #F0F1FD;
    color: #828282;
    font-size: 12px;
    font-weight: 500;
    padding: 10px 14px;
    text-align: left;
  }

  tbody tr {
    cursor: pointer;
    &:hover {
      background-color: #FFFCFC;
    }
  }

  td {
    padding: 12px 14px;
    font-size: 12px;
    color: #000000;
    border-bottom: 1px solid #FFFCFC;
  }

  .font-bold {
    font-weight: 700;
  }
`;

export const BottomRow = styled.div`
  display: flex;
  gap: 16px;
`;

export const HalfCard = styled(Card)`
  flex: 1;
  padding: 20px;
`;

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
  background-color: #F0F1FD;
  color: #2942F1;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ActivityContent = styled.div`
  p {
    font-size: 11px;
    font-weight: 700;
    color: #000000;
    line-height: 1.3;
    margin-bottom: 2px;
  }

  span {
    font-size: 10px;
    color: #B6B6B6;
  }
`;

export const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #F0F1FD;
  color: #2942F1;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MemberName = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #000000;
`;

export const RoleBadge = styled.span`
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  background-color: ${(props) => (props.$isLeader ? "#3138E7" : "#FFFFFF")};
  color: ${(props) => (props.$isLeader ? "#FFFFFF" : "#3138E7")};
  border: ${(props) => (props.$isLeader ? "none" : "1px solid #3138E7")};
`;

export const InviteButton = styled.button`
  width: 100%;
  background: none;
  border: none;
  color: #2942F1;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 0;

  &:hover {
    color: #3138E7;
  }
`;

export const SidebarCard = styled(Card)`
  height: 100%;
  padding: 24px 20px;
`;

export const SidebarHeader = styled.div`
  margin-bottom: 20px;

  h3 {
    font-size: 15px;
    font-weight: 700;
    color: #3138E7;
    margin-bottom: 4px;
  }

  p {
    font-size: 11px;
    color: #828282;
  }
`;

export const GatheredList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const DocItemCard = styled.div`
  border: 1px solid #DCDCDC;
  border-radius: 8px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #FFFFFF;
`;

export const DocItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

export const DocInfo = styled.div`
  h4 {
    font-size: 12px;
    font-weight: 700;
    color: #000000;
    margin-bottom: 2px;
  }

  .langs {
    font-size: 10px;
    font-weight: 600;
    color: #000000;
    margin-bottom: 2px;
  }

  .time {
    font-size: 9px;
    color: #828282;
  }
`;

export const VersionSelect = styled.select`
  background-color: #F0F1FD;
  color: #3138E7;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 600;
  outline: none;
  cursor: pointer;
`;

export const EmptyBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;

  h4 {
    font-size: 13px;
    font-weight: 700;
    color: #000000;
    margin: 12px 0 4px 0;
  }

  p {
    font-size: 11px;
    color: #828282;
    margin-bottom: 12px;
  }
`;

export const SidebarEmptyBox = styled(EmptyBox)`
  padding: 100px 0;
`;

export const EmptyTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0;

  p {
    font-size: 10px;
    color: #828282;
    line-height: 1.4;
  }
`;

export const ActionButton = styled.button`
  background-color: #4253E2;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #3138E7;
  }
`;

export const LogoPlaceholder = styled.div`
  width: 120px;
  height: 32px;
  background-color: #F0F1FD;
  border: 1px dashed #4253E2;
  border-radius: 4px;
`;

export const ArrowPlaceholder = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: #B6B6B6;
`;

export const DocIconPlaceholder = styled.div`
  width: 28px;
  height: 34px;
  border: 1px solid #4253E2;
  border-radius: 4px;
  background-color: #F0F1FD;
`;

export const EmptyIconPlaceholder = styled.div`
  width: 60px;
  height: 70px;
  border: 2px dashed #B6B6B6;
  border-radius: 8px;
  background-color: #F0F1FD;
`;

/* ===== 모달 스타일 ===== */
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
  background-color: #FFFFFF;
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
    border: 1px solid #DCDCDC;
    border-radius: 6px;
    font-size: 13px;
    outline: none;

    &:focus {
      border-color: #2942F1;
    }
  }
`;

export const CodeBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #F0F1FD;
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid #DCDCDC;

  span {
    font-size: 14px;
    font-weight: 700;
    color: #2942F1;
  }

  button {
    background-color: #FFFFFF;
    border: 1px solid #4253E2;
    color: #4253E2;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 11px;
    cursor: pointer;

    &:hover {
      background-color: #F0F1FD;
    }
  }
`;