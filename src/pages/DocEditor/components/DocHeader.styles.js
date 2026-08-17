import styled from "styled-components";

export const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 1200px;
  height: 45px;
  margin: 0 auto;
  padding: 0 16px;
  background-color: #ffffff;
  box-sizing: border-box;
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 331px;
  height: 45px;
  box-sizing: border-box;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  outline: none;

  svg {
    stroke: #000000;
    transition: stroke 0.2s;
  }

  &:hover svg {
    stroke: #462fea;
  }
`;

export const Title = styled.h1`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin: 0;
  line-height: 1;
  white-space: nowrap;
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  height: 45px;
`;

export const UpdateTime = styled.span`
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 13px;
  color: #828282;
  margin-right: 24px;
  white-space: nowrap;
`;

export const ButtonBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 420px;
  height: 42px;
  gap: 20px;

  & > button {
    width: 200px;
    height: 42px;
    font-family: "Pretendard-SemiBold", sans-serif;
    font-size: 14px;
    border-radius: 6px;
  }
`;
