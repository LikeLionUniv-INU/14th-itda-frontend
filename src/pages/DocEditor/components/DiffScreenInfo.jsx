import React from "react";
import styled from "styled-components";

export default function DiffScreenInfo({
  prevScreenName = "회원가입 페이지",
  prevScreenId = "SIGN_UP_001",
  currScreenName = "회원가입",
  currScreenId = "SIGN_001",
  isModified = true,
}) {
  return (
    <Container>
      <Title>화면 정보</Title>

      {/* 1. 상단 라벨 (화면 이름 / ID) */}
      <LabelRow>
        <ScreenNameLabel>화면 이름</ScreenNameLabel>
        <ScreenIdLabel>ID</ScreenIdLabel>
      </LabelRow>

      {/* 2. 입력 박스 영역 */}
      {isModified ? (
        <DiffGroup>
          {/* 변경 전: 빨간색 글씨 #FF0000, 배경 #FFEAEA, 테두리 #FFAEAE */}
          <InputRow>
            <ScreenNameBox isPrev>{prevScreenName}</ScreenNameBox>
            <ScreenIdBox isPrev>{prevScreenId}</ScreenIdBox>
          </InputRow>
          {/* 변경 후: 초록색 글씨 #1D6621, 배경 #EFFFE9, 테두리 #AFF5B3 */}
          <InputRow>
            <ScreenNameBox isCurr>{currScreenName}</ScreenNameBox>
            <ScreenIdBox isCurr>{currScreenId}</ScreenIdBox>
          </InputRow>
        </DiffGroup>
      ) : (
        /* 변경사항 없을 때 기본 단일 행 */
        <InputRow>
          <ScreenNameBox>{currScreenName}</ScreenNameBox>
          <ScreenIdBox>{currScreenId}</ScreenIdBox>
        </InputRow>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Title = styled.h3`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 16px;
  color: #4548f6;
  margin: 0 0 12px 0;
`;

const LabelRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
`;

const ScreenNameLabel = styled.span`
  width: 320px;
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 14px;
  color: #000000;
`;

const ScreenIdLabel = styled.span`
  flex: 1;
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 14px;
  color: #000000;
`;

const DiffGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InputRow = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
`;

const ScreenNameBox = styled.div`
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

const ScreenIdBox = styled.div`
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
