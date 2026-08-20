import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const Title = styled.h3`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 16px;
  color: #4548f6;
  margin: 0;
`;

export const DeviceBadge = styled.div`
  height: 32px;
  padding: 0 14px;
  border-radius: 6px;
  border: 1px solid #b6b6b6;
  background-color: #ffffff;
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 12px;
  display: flex;
  align-items: center;
`;

export const CanvasWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

/* 단일 모드 (데스크탑 371px / 모바일 463px) */
export const SingleContainer = styled.div`
  width: ${({ device }) => (device === "desktop" ? "660px" : "214px")};
  height: ${({ device }) => (device === "desktop" ? "371px" : "463px")};
  border-radius: 12px;
  border: 1px solid #d6d6d6;
  background-color: #fafafa;
  overflow: hidden;
  position: relative;
`;

/* 듀얼 모드 (데스크탑 상하, 모바일 좌우) */
export const DualContainer = styled.div`
  display: flex;
  flex-direction: ${({ device }) => (device === "mobile" ? "row" : "column")};
  gap: ${({ device }) => (device === "mobile" ? "20px" : "16px")};
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
`;

/* 내부 사진 상자 (데스크탑 듀얼 시 240px로 콤팩트하게 줄임) */
export const FrameBox = styled.div`
  width: ${({ device }) => (device === "desktop" ? "660px" : "214px")};
  height: ${({ device }) => (device === "desktop" ? "240px" : "463px")};
  border-radius: 12px;
  border: 2px solid
    ${({ isPrev, isCurr }) =>
      isPrev ? "#FF0000" : isCurr ? "#50BB5E" : "#D6D6D6"};
  background-color: #fafafa;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
`;

export const ScrollArea = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  display: block;
`;

export const WireImage = styled.img`
  width: 100%;
  display: block;
  pointer-events: none;
`;

export const EmptyText = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 13px;
  color: #999999;
`;

/* 초록 스왑 아이콘: 위아래 상자 사이 정중앙에 정확히 걸치도록 배치 */
export const SwapIconBadge = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 25;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #50bb5e;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  pointer-events: none;
`;

export const Pin = styled.div`
  position: absolute;
  left: ${({ x }) => x}px;
  top: ${({ y }) => y}px;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;

  background-color: ${({ pinType }) =>
    pinType === "prev" ? "#8E8E93" : "#462FEA"};
  color: #ffffff;
  border: 2px solid
    ${({ pinType }) =>
      pinType === "prev"
        ? "#FF0000"
        : pinType === "added"
          ? "#9ED2FE"
          : "#50BB5E"};
  box-shadow: ${({ isFocused }) => (isFocused ? "0 0 0 3px #1D6621" : "none")};
`;
