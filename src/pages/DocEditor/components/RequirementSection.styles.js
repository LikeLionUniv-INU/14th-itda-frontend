import styled, { css } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 428px;
  box-sizing: border-box;
`;

export const Title = styled.h2`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 20px;
  color: #4548f6;
  margin: 0;
`;

export const TabBar = styled.div`
  display: flex;
  width: 100%;
  height: 44px;
  border-bottom: 1.5px solid #e0e0e0;
  box-sizing: border-box;
`;

export const TabButton = styled.button`
  flex: 1;
  background: none;
  border: none;
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 15px;
  color: ${({ active }) => (active ? "#4548F6" : "#000000")};
  cursor: pointer;
  position: relative;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ active }) =>
    active &&
    css`
      font-family: "Pretendard-Bold", sans-serif;
      &::after {
        content: "";
        position: absolute;
        bottom: -1.5px;
        left: 0;
        width: 100%;
        height: 2.5px;
        background-color: #4548f6;
      }
    `}
`;

export const TableContainer = styled.div`
  width: 100%;
  height: fit-content;
  max-height: 708px;
  border-radius: 12px;
  border: 1px solid #b6b6b6;
  background-color: #ffffff;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

export const TableHeader = styled.div`
  display: flex;
  align-items: stretch;
  min-height: 40px;
  background-color: #f3f2fc;
  border-bottom: 1px solid #b6b6b6;
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 13px;
  color: #000000;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 5;
  flex-shrink: 0;
`;

export const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Row = styled.div`
  display: flex;
  align-items: stretch;
  min-height: 64px;
  border-bottom: 1px solid #b6b6b6;
  box-sizing: border-box;
  background-color: ${({ isModified }) => (isModified ? "#EFFFE9" : "#FFFFFF")};

  &:last-child {
    border-bottom: none;
  }
`;

export const ColNo = styled.div`
  width: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-right: 1px solid #b6b6b6;
  padding: 8px 0;
  box-sizing: border-box;
`;

export const PinBadge = styled.span`
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
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
`;

export const ColItem = styled.div`
  width: 96px;
  padding: 8px;
  box-sizing: border-box;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 13px;
  color: #000000;
  border-right: 1px solid #b6b6b6;
`;

export const ColRequirement = styled.div`
  flex: 1;
  padding: 8px 10px;
  box-sizing: border-box;
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 13px;
  color: #000000;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-all;
  display: flex;
  align-items: center;
`;

export const ColAction = styled.div`
  width: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px;
  flex-shrink: 0;
  border-left: 1px solid #b6b6b6;
  box-sizing: border-box;
`;

export const StyledInput = styled.input`
  width: 100%;
  height: 36px;
  padding: 0 8px;
  border-radius: 6px;
  border: 1.5px solid #8777f8;
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 12px;
  outline: none;
  box-sizing: border-box;
  background-color: #ffffff;
`;

export const StyledTextArea = styled.textarea`
  width: 100%;
  min-height: 52px;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1.5px solid #8777f8;
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 12px;
  outline: none;
  resize: none;
  box-sizing: border-box;
  background-color: #ffffff;
`;

export const ActionButton = styled.button`
  width: 58px;
  height: 26px;
  border-radius: 4px;
  background-color: #ffffff;
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 11px;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  ${({ variant }) =>
    variant === "edit" &&
    css`
      border: 1px solid #4548f6;
      color: #4548f6;
      &:hover {
        background-color: #f8f7ff;
      }
    `}

  ${({ variant }) =>
    variant === "complete" &&
    css`
      border: 1px solid #50bb5e;
      color: #50bb5e;
      &:hover {
        background-color: #f6ffed;
      }
    `}

  ${({ variant }) =>
    variant === "cancel" &&
    css`
      border: 1px solid #ff0000;
      color: #ff0000;
      &:hover {
        background-color: #fff5f5;
      }
    `}
`;

/* 핀이 0개일 때만 나타나는 박스 */
export const EmptyBox = styled.div`
  width: 100%;
  height: 708px;
  border-radius: 12px;
  border: 1px solid #b6b6b6;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
  user-select: none;
`;

export const EmptyIcon = styled.img`
  width: 180px;
  height: auto;
  margin-bottom: 24px;
  display: block;
`;

export const EmptyTitle = styled.h3`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 16px;
  color: #000000;
  line-height: 1.4;
  margin: 0 0 10px 0;
  white-space: pre-line;
`;

export const EmptyDesc = styled.p`
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 13px;
  color: #828282;
  line-height: 1.5;
  margin: 0;
  white-space: pre-line;
`;
