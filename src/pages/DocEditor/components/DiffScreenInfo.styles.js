import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Title = styled.h3`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 16px;
  color: #4548f6;
  margin: 0 0 12px 0;
`;

export const LabelRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
`;

export const ScreenNameLabel = styled.span`
  width: 320px;
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 14px;
  color: #000000;
`;

export const ScreenIdLabel = styled.span`
  flex: 1;
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 14px;
  color: #000000;
`;

export const DiffGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InputRow = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
`;

export const ScreenNameBox = styled.div`
  width: 320px;
  height: 44px;
  border-radius: 10px;
  padding: 0 14px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 13px;

  border: 1px solid
    ${({ isPrev, isCurr }) =>
      isPrev ? "#FFAEAE" : isCurr ? "#AFF5B3" : "#D6D6D6"};
  background-color: ${({ isPrev, isCurr }) =>
    isPrev ? "#FFEAEA" : isCurr ? "#EFFFE9" : "#FFFFFF"};
  color: ${({ isPrev, isCurr }) =>
    isPrev ? "#FF0000" : isCurr ? "#1D6621" : "#000000"};
`;

export const ScreenIdBox = styled.div`
  flex: 1;
  height: 44px;
  border-radius: 10px;
  padding: 0 14px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 13px;

  border: 1px solid
    ${({ isPrev, isCurr }) =>
      isPrev ? "#FFAEAE" : isCurr ? "#AFF5B3" : "#D6D6D6"};
  background-color: ${({ isPrev, isCurr }) =>
    isPrev ? "#FFEAEA" : isCurr ? "#EFFFE9" : "#FFFFFF"};
  color: ${({ isPrev, isCurr }) =>
    isPrev ? "#FF0000" : isCurr ? "#1D6621" : "#000000"};
`;
