import styled, { css } from "styled-components";

export const NavigatorContainer = styled.div`
  display: flex;
  align-items: center;
  width: 712px;
  height: 42px;
  box-sizing: border-box;
`;

export const ScrollSection = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  height: 100%;
  min-width: 0;
  gap: 12px;
`;

export const ArrowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 8px;
  background-color: #ffffff;
  border: 1px solid #d6d6d6;
  cursor: ${({ canScroll }) => (canScroll ? "pointer" : "default")};
  outline: none;
  padding: 0;
  flex-shrink: 0;
  transition: all 0.2s ease-in-out;

  ${({ canScroll }) =>
    canScroll &&
    css`
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
    `}

  svg {
    stroke: ${({ canScroll }) => (canScroll ? "#3138E7" : "#D6D6D6")};
  }
`;

export const TabListWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  height: 100%;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const PageTab = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 42px;
  padding: 0 10px;
  border-radius: 8px;
  background-color: #ffffff;
  border: 1.5px solid ${({ active }) => (active ? "#3138E7" : "#D6D6D6")};
  cursor: pointer;
  white-space: nowrap;
  outline: none;
  flex-shrink: 0;
  box-sizing: border-box;
  transition: border-color 0.2s ease-in-out;
`;

export const NumberBox = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 14px;
  background-color: ${({ active }) => (active ? "#3138E7" : "#D6D6D6")};
  color: #ffffff;
`;

export const TabText = styled.span`
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 15px;
  color: ${({ active }) => (active ? "#3138E7" : "#D6D6D6")};
`;

export const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 42px;
  padding: 0 16px;
  margin-left: 16px;
  border-radius: 8px;
  background-color: #ffffff;
  border: 1px solid #d6d6d6;
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 14px;
  color: #000000;
  cursor: pointer;
  outline: none;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #f8f9fa;
  }
`;
