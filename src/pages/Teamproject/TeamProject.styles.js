import styled from "styled-components";

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
  width: 1202px;
  margin: 28px auto;
  padding: 0 0 80px 0;
  display: grid;
  grid-template-columns: 791px 387px;
  gap: 24px;
  align-items: start;
  box-sizing: border-box;

  @media (max-width: 1240px) {
    width: 100%;
    padding: 0 20px 80px 20px;
    grid-template-columns: 1fr;
  }
`;

export const MainSection = styled.div`
  width: 791px;
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

export const BannerCard = styled.div`
  width: 791px;
  height: 135px;
  background: linear-gradient(135deg, #ffffff 0%, #f4f0ff 60%, #e9e3ff 100%);
  border: 1.5px solid #d8b4fe;
  border-radius: 12px;
  padding: 0 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;

  @media (max-width: 1240px) {
    width: 100%;
  }

  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    right: -60px;
    bottom: 60px;
    width: 130px;
    height: 130px;
    background: rgba(219, 215, 255, 0.4);
    border-radius: 50%;
    z-index: 1;
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    right: -50px;
    bottom: -60px;
    width: 120px;
    height: 120px;
    background: rgba(219, 215, 255, 0.4);
    border-radius: 50%;
    z-index: 1;
    pointer-events: none;
  }

  > * {
    position: relative;
    z-index: 2;
  }
`;

export const BannerTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
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
    font-weight: 600;
  }

  .value {
    font-size: 18px;
    font-weight: 700;
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
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #d8b4fe;
  margin-left: -5px;

  &:first-child {
    margin-left: 0;
  }
`;

export const RecentDocsCard = styled.div`
  width: 792px;
  height: 357px;
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
    height: auto;
    min-height: 357px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  margin-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;

  h3 {
    font-size: 16px;
    font-weight: 700;
    color: #3b28cc;
    margin: 0;
  }
`;

export const MoreButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;

  &:hover {
    color: #111827;
  }
`;

export const TableContainer = styled.div`
  width: 744px;
  height: 262px;
  margin: 0 auto;
  box-sizing: border-box;

  @media (max-width: 1240px) {
    width: 100%;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;

  thead tr {
    background-color: #f5f3fd;
    height: 46px;
  }

  th {
    color: #6b7280;
    font-size: 13px;
    font-weight: 600;
    padding: 0 12px;
    text-align: left;
    vertical-align: middle;

    &:nth-child(1) {
      width: 30%;
    }
    &:nth-child(2) {
      width: 20%;
    }
    &:nth-child(3) {
      width: 15%;
    }
    &:nth-child(4) {
      width: 20%;
    }
    &:nth-child(5) {
      width: 15%;
    }

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
    height: 43px;
    transition: background-color 0.15s ease;

    &:hover {
      background-color: #faf5ff;
    }

    &:has(.manage-cell:hover) {
      background-color: transparent;
    }

    &:has(.manage-cell:hover) {
      background-color: transparent;
    }
  }

  td {
    padding: 0 12px;
    font-size: 13.5px;
    font-weight: 700;
    color: #111827;
    border-bottom: 1px solid #f0f0f0;
    vertical-align: middle;

    &.doc-title {
      font-weight: 700;
      text-decoration: underline;
      text-underline-offset: 3px;
    }

    &.plain-title {
      font-weight: 700;
      text-decoration: none;
    }
  }
`;

export const TableEditButton = styled.button`
  padding: 6px 12px;
  background-color: #fff;
  border: 1px solid #4f46e5;
  color: #4f46e5;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s ease;

  &:hover {
    background-color: #faf5ff;
  }
`;

export const EmptyDocIconImg = styled.img`
  width: 52px;
  height: 52px;
  object-fit: contain;
  margin-bottom: 12px;
`;

export const BottomRow = styled.div`
  width: 791px;
  height: 321px;
  display: grid;
  grid-template-columns: 385.5px 385.5px;
  gap: 20px;
  box-sizing: border-box;

  @media (max-width: 1240px) {
    width: 100%;
    grid-template-columns: 1fr 1fr;
    height: auto;
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
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid #e9d5ff;
`;

export const ActivityContent = styled.div`
  p {
    font-size: 13px;
    font-weight: 700;
    color: #111827;
    line-height: 1.3;
    margin: 0 0 2px 0;
  }

  span {
    font-size: 11px;
    font-weight: 600;
    color: #828282;
  }
`;

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
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MemberName = styled.span`
  font-size: 13.5px;
  font-weight: 700;
  color: #111827;
`;

export const RoleBadge = styled.span`
  padding: 5px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
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
  font-weight: 700;
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

export const SidebarCard = styled.div`
  width: 387px;
  height: 866px;
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  overflow: hidden;

  @media (max-width: 1240px) {
    width: 100%;
    height: auto;
    max-height: 866px;
  }
`;

export const SidebarHeader = styled.div`
  padding: 0 4px 12px 4px;
  margin-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;

  h3 {
    font-size: 16px;
    font-weight: 700;
    color: #3b28cc;
    margin: 0 0 4px 0;
  }

  p {
    font-size: 12px;
    font-weight: 600;
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
  overflow-x: hidden;
  padding: 0;
  box-sizing: border-box;
  align-items: center;

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

export const DocItemCard = styled.div`
  width: 343px;
  min-width: 343px;
  max-width: 343px;
  height: 93px;
  min-height: 93px;
  border: 1px solid #e9d5ff;
  border-radius: 12px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  box-sizing: border-box;
`;

export const DocItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex: 1;
  overflow: hidden;
`;

export const SidebarDocIconImg = styled.img`
  width: 50px;
  height: 50px;
  min-width: 50px;
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
    font-weight: 700;
    color: #111827;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .langs {
    font-size: 12px;
    font-weight: 700;
    color: #111827;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 155px;
  }

  .time {
    font-size: 11px;
    font-weight: 600;
    color: #828282;
    margin: 0;
    white-space: nowrap;
  }
`;

export const VersionSelect = styled.select`
  width: 78px;
  height: 34px;
  min-width: 78px;
  background-color: #f5f3fd;
  color: #142fdf;
  border: 1px solid #c9c1eb;
  border-radius: 8px;
  padding: 0 6px;
  font-size: 13px;
  font-weight: 700;
  outline: none;
  cursor: pointer;
  text-align: center;
  box-sizing: border-box;

  &:hover {
    background-color: #ede9fe;
  }
`;

export const NotificationBar = styled.div`
  grid-column: 1 / -1;
  width: 100%;
  box-sizing: border-box;
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
    font-weight: 700;
    color: #111111;
  }

  p {
    margin: 4px 0 0 0;
    font-size: 12px;
    font-weight: 600;
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
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: #1d4ed8;
  }
`;

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
    color: #111827;
    margin: 6px 0 4px 0;
  }

  p {
    font-size: 12px;
    font-weight: 600;
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
    font-weight: 600;
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
  font-weight: 700;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;
