import React from "react";
import * as S from "./DiffWireframeCanvas.styles";

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
    <S.Container>
      <S.HeaderRow>
        <S.Title>와이어프레임</S.Title>
        <S.DeviceBadge>
          {device === "desktop" ? "데스크탑" : "모바일"}
        </S.DeviceBadge>
      </S.HeaderRow>

      <S.CanvasWrapper>
        {isImageModified ? (
          <S.DualContainer device={device}>
            {/* 변경 전 */}
            <S.FrameBox isPrev device={device}>
              <S.ScrollArea>
                {prevImageUrl ? (
                  <S.ImageWrapper>
                    <S.WireImage
                      src={prevImageUrl}
                      alt="변경 전 와이어프레임"
                    />
                    {prevPins.map((pin) => (
                      <S.Pin
                        key={`prev-${pin.id}`}
                        pinType="prev"
                        x={pin.x}
                        y={pin.y}
                      >
                        {pin.number}
                      </S.Pin>
                    ))}
                  </S.ImageWrapper>
                ) : (
                  <S.EmptyText>
                    변경 전 와이어프레임 이미지가 없습니다.
                  </S.EmptyText>
                )}
              </S.ScrollArea>
            </S.FrameBox>

            {/* 중앙 교체 아이콘 */}
            <S.SwapIconBadge>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </S.SwapIconBadge>

            {/* 변경 후 */}
            <S.FrameBox isCurr device={device}>
              <S.ScrollArea>
                {currImageUrl ? (
                  <S.ImageWrapper>
                    <S.WireImage
                      src={currImageUrl}
                      alt="변경 후 와이어프레임"
                    />
                    {currPins.map((pin) => (
                      <S.Pin
                        key={`curr-${pin.id}`}
                        pinType={pin.pinType || "curr"}
                        isFocused={focusedPinId === pin.id}
                        x={pin.x}
                        y={pin.y}
                        onClick={() => onFocusPin?.(pin.id)}
                      >
                        {pin.number}
                      </S.Pin>
                    ))}
                  </S.ImageWrapper>
                ) : (
                  <S.EmptyText>
                    변경 후 와이어프레임 이미지가 없습니다.
                  </S.EmptyText>
                )}
              </S.ScrollArea>
            </S.FrameBox>
          </S.DualContainer>
        ) : (
          <S.SingleContainer device={device}>
            <S.ScrollArea>
              {currImageUrl ? (
                <S.ImageWrapper>
                  <S.WireImage src={currImageUrl} alt="와이어프레임" />
                  {currPins.map((pin) => (
                    <S.Pin
                      key={`curr-${pin.id}`}
                      pinType={pin.pinType || "curr"}
                      isFocused={focusedPinId === pin.id}
                      x={pin.x}
                      y={pin.y}
                      onClick={() => onFocusPin?.(pin.id)}
                    >
                      {pin.number}
                    </S.Pin>
                  ))}
                </S.ImageWrapper>
              ) : (
                <S.EmptyText>
                  등록된 와이어프레임 이미지가 없습니다.
                </S.EmptyText>
              )}
            </S.ScrollArea>
          </S.SingleContainer>
        )}
      </S.CanvasWrapper>
    </S.Container>
  );
}
