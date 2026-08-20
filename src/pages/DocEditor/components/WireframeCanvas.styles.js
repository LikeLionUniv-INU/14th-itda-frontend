import styled, { css } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 672px;
  box-sizing: border-box;
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const Title = styled.h2`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 20px;
  color: #462fea;
  margin: 0;
`;

export const SelectBox = styled.select`
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid #d6d6d6;
  background-color: #ffffff;
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 14px;
  color: #000000;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: #462fea;
  }
`;

export const CanvasArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 672px;
  height: 620px;
  border-radius: 12px;
  border: 1.5px solid #d6d6d6;
  background-color: #f9f8fe;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
`;

export const EmptyBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 364px;
  height: 217px;
  cursor: pointer;
  text-align: center;
  user-select: none;
`;

export const EmptyIcon = styled.img`
  width: 210px;
  height: auto;
  display: block;
`;

export const EmptyTitle = styled.h3`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 18px;
  color: #000000;
  margin: 16px 0 8px 0;
  white-space: nowrap;
`;

export const EmptyDesc = styled.p`
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 13px;
  color: #828282;
  margin: 0;
  line-height: 1.5;
  white-space: nowrap;
`;

export const ScrollViewport = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;

  ${({ $device }) =>
    $device === "desktop"
      ? css`
          width: 660px;
          height: 371px;
        `
      : css`
          width: 214px;
          height: 463px;
        `}
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  cursor: ${({ $isAddingPin }) => ($isAddingPin ? "crosshair" : "default")};

  img {
    width: 100%;
    height: auto;
    display: block;
    user-select: none;
    pointer-events: none;
  }
`;

export const PinSticker = styled.div`
  position: absolute;
  top: ${({ y }) => y}px;
  left: ${({ x }) => x}px;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #462fea;
  color: #ffffff;
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  user-select: none;
  z-index: 10;
  box-shadow: ${({ $isFocused }) =>
    $isFocused
      ? "0 0 0 2px #52C41A, 2px 2px 4px rgba(0, 0, 0, 0.25)"
      : "1px 1px 3px rgba(0, 0, 0, 0.2)"};

  &:active {
    cursor: grabbing;
  }
`;

export const ChangeImageButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;
  background-color: #ffffff;
  border: 1.5px solid #462fea;
  color: #462fea;
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  z-index: 20;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #f8f7ff;
  }
`;

export const BottomButtonGroup = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  gap: 10px;
  z-index: 20;
`;

export const AddPinButton = styled.button`
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;
  background-color: #ffffff;
  border: 1.5px solid #1c57d7;
  color: #1c57d7;
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;

  ${({ $isAddingPin }) =>
    $isAddingPin &&
    css`
      background-color: #1c57d7;
      color: #ffffff;
    `}

  &:hover {
    opacity: 0.9;
  }
`;

export const DeletePinButton = styled.button`
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;
  background-color: #ffffff;
  border: 1.5px solid #ff0000;
  color: #ff0000;
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #fff5f5;
  }
`;
