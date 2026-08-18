import React from "react";
import styled from "styled-components";

export default function DiffWireframeCanvas({
  device = "desktop",
  prevImageUrl = "",
  currImageUrl = "",
  prevPins = [],
  currPins = [],
  focusedPinId,
  isImageModified = false,
  onFocusPin,
}) {
  return (
    <Container>
      <HeaderRow>
        <Title>와이어프레임</Title>
        <DeviceBadge>
          {device === "desktop" ? "데스크탑" : "모바일"}
        </DeviceBadge>
      </HeaderRow>

      <CanvasWrapper>
        {isImageModified ? (
          /* 이미지 변경사항이 있을 때: 2단 분할 + 중앙 교체 아이콘 */
          <DualContainer device={device}>
            {/* 1. 변경 전 와이어프레임 (빨간 테두리 #FF0000) */}
            <FrameBox isPrev device={device}>
              <ScrollArea>
                {prevImageUrl ? (
                  <ImageWrapper>
                    <WireImage src={prevImageUrl} alt="변경 전 와이어프레임" />
                    {prevPins.map((pin) => (
                      <Pin
                        key={`prev-${pin.id}`}
                        pinType="prev"
                        x={pin.x}
                        y={pin.y}
                      >
                        {pin.number}
                      </Pin>
                    ))}
                  </ImageWrapper>
                ) : (
                  <EmptyText>변경 전 와이어프레임 이미지가 없습니다.</EmptyText>
                )}
              </ScrollArea>
            </FrameBox>

            {/* 2. 중앙 교체 아이콘 (인라인 SVG) */}
            <SwapIconBadge>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </SwapIconBadge>

            {/* 3. 변경 후 와이어프레임 (초록 테두리 #50BB5E) */}
            <FrameBox isCurr device={device}>
              <ScrollArea>
                {currImageUrl ? (
                  <ImageWrapper>
                    <WireImage src={currImageUrl} alt="변경 후 와이어프레임" />
                    {currPins.map((pin) => (
                      <Pin
                        key={`curr-${pin.id}`}
                        pinType={pin.pinType || "curr"}
                        isFocused={focusedPinId === pin.id}
                        x={pin.x}
                        y={pin.y}
                        onClick={() => onFocusPin?.(pin.id)}
                      >
                        {pin.number}
                      </Pin>
                    ))}
                  </ImageWrapper>
                ) : (
                  <EmptyText>변경 후 와이어프레임 이미지가 없습니다.</EmptyText>
                )}
              </ScrollArea>
            </FrameBox>
          </DualContainer>
        ) : (
          /* 이미지 변경사항이 없을 때: 1단 단일 규격 */
          <SingleContainer device={device}>
            <ScrollArea>
              {currImageUrl ? (
                <ImageWrapper>
                  <WireImage src={currImageUrl} alt="와이어프레임" />
                  {currPins.map((pin) => (
                    <Pin
                      key={`curr-${pin.id}`}
                      pinType={pin.pinType || "curr"}
                      isFocused={focusedPinId === pin.id}
                      x={pin.x}
                      y={pin.y}
                      onClick={() => onFocusPin?.(pin.id)}
                    >
                      {pin.number}
                    </Pin>
                  ))}
                </ImageWrapper>
              ) : (
                <EmptyText>등록된 와이어프레임 이미지가 없습니다.</EmptyText>
              )}
            </ScrollArea>
          </SingleContainer>
        )}
      </CanvasWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const Title = styled.h3`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 16px;
  color: #4548f6;
  margin: 0;
`;

const DeviceBadge = styled.div`
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

const CanvasWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

/* 데스크탑 660x371px, 모바일 214x463px */
const SingleContainer = styled.div`
  width: ${({ device }) => (device === "desktop" ? "660px" : "214px")};
  height: ${({ device }) => (device === "desktop" ? "371px" : "463px")};
  border-radius: 12px;
  border: 1px solid #d6d6d6;
  background-color: #fafafa;
  overflow: hidden;
  position: relative;
`;

const DualContainer = styled.div`
  display: flex;
  flex-direction: ${({ device }) => (device === "mobile" ? "row" : "column")};
  gap: 14px;
  align-items: center;
  position: relative;
`;

const FrameBox = styled.div`
  width: ${({ device }) => (device === "desktop" ? "660px" : "214px")};
  height: ${({ device }) => (device === "desktop" ? "320px" : "463px")};
  border-radius: 12px;
  border: 2px solid
    ${({ isPrev, isCurr }) => (isPrev ? "#FF0000" : isCurr ? "#50BB5E" : "#D6D6D6")};
  background-color: #fafafa;
  overflow: hidden;
  position: relative;
`;

const ScrollArea = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  display: block;
`;

const WireImage = styled.img`
  width: 100%;
  display: block;
  pointer-events: none;
`;

const EmptyText = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 13px;
  color: #999999;
`;

const SwapIconBadge = styled.div`
  position: absolute;
  z-index: 20;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: #50bb5e;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
`;

const Pin = styled.div`
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

  background-color: ${({ pinType }) => (pinType === "prev" ? "#8E8E93" : "#462FEA")};
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
