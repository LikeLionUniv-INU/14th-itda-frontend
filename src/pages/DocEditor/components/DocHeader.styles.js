import styled from "styled-components";

export const HeaderContainer = styled.div`
  width: 1200px;
  height: 61px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
`;

export const LeftArea = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
`;

export const BackArrow = styled.svg`
  width: 24px;
  height: 24px;
`;

export const DocTitle = styled.h1`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 22px;
  color: #000000;
  margin: 0;
`;

export const RightArea = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const UpdateText = styled.span`
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 13px;
  color: #666666;
`;

export const VersionBadgeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PrevVersionBadge = styled.div`
  height: 32px;
  padding: 0 14px;
  border-radius: 6px;
  border: 1px solid #d6d6d6;
  background-color: #ffffff;
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 13px;
  color: #555555;
  display: flex;
  align-items: center;
`;

export const ArrowIcon = styled.svg`
  width: 16px;
  height: 16px;
`;

export const CurrVersionBadge = styled.div`
  height: 32px;
  padding: 0 14px;
  border-radius: 6px;
  background-color: #462fea;
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 13px;
  color: #ffffff;
  display: flex;
  align-items: center;
`;
