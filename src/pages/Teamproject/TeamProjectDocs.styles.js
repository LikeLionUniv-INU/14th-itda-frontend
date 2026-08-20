import styled from "styled-components";
import docicon from "../../assets/image/doc icon.svg";

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

export const TopHeader = styled.header`
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 24px;
  display: flex;
  align-items: center;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
    fill: #333;
  }
`;

export const Content = styled.main`
  width: 100%;
  max-width: 1200px;
  margin: 28px auto;
  padding: 0 20px 80px 20px;
  box-sizing: border-box;
`;

export const BannerCard = styled.div`
  width: 100%;
  min-height: 135px;
  background: linear-gradient(135deg, #ffffff 0%, #f4f0ff 60%, #e9e3ff 100%);
  border: 1.5px solid #d8b4fe;
  border-radius: 12px;
  padding: 24px 36px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);

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

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
`;

/* 📌 TableContainer는 아예 쓰지 않거나, 필요하다면 단순히 패딩 없는 빈 Wrapper로 대체 */
export const TableContainer = styled.div`
  width: 100%;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  background: transparent; /* 외부 박스 없이 투명 배경 */

  thead tr {
    background-color: #f5f3fd; /* 연보라색 헤더 배경 */
    height: 48px;
  }

  th {
    color: #6b7280;
    font-size: 13px;
    font-weight: 600;
    padding: 0 20px;
    text-align: left;
    vertical-align: middle;

    /* 헤더의 양 끝만 둥글게 처리 */
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
    height: 52px;
    transition: background-color 0.15s ease;
    background-color: #ffffff;

    &:hover {
      background-color: #faf5ff;
    }
  }

  td {
    padding: 0 20px;
    font-size: 13.5px;
    font-weight: 600;
    color: #111827;
    border-bottom: 1px solid #f0f0f0; /* 행 사이에만 가로 선 추가 */
    vertical-align: middle;

    &:last-child {
      color: #111827;
      font-weight: 600;
    }

    &.doc-name,
    &.doc-title {
      font-weight: 700;
      color: #111827;
      cursor: pointer;
    }
  }
`;

export const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);

  h4 {
    font-size: 15px;
    font-weight: 700;
    color: #111827;
    margin: 12px 0 6px 0;
  }

  p {
    font-size: 12px;
    font-weight: 600;
    color: #828282;
    margin: 0 0 16px 0;
  }
`;

export const DocIcon = styled.div`
  background-image: url("${docicon}");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 52px;
  height: 52px;
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
