import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function DiffHeader({
  docName = "스토리보드",
  prevVersion = 1,
  currVersion = 2,
  updatedAt = "2026.06.30. 20:30:37",
}) {
  const navigate = useNavigate();

  return (
    <HeaderContainer>
      {/* [<-] 버튼 클릭 시 '팀 프로젝트 메인화면'으로 이동 */}
      <LeftArea onClick={() => navigate("/team-project-main")}>
        <BackArrow viewBox="0 0 24 24" fill="none">
          <path
            d="M19 12H5M5 12L12 19M5 12L12 5"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </BackArrow>
        <DocTitle>
          {docName} Version.{currVersion}
        </DocTitle>
      </LeftArea>

      {/* 우측: 최근 업데이트 시간 및 {이전 버전} -> {수정 후 버전} 동적 표시 */}
      <RightArea>
        {updatedAt && <UpdateText>업데이트 : {updatedAt}</UpdateText>}
        <VersionBadgeGroup>
          {prevVersion !== undefined && (
            <>
              <PrevVersionBadge>Version.{prevVersion}</PrevVersionBadge>
              <ArrowIcon viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </ArrowIcon>
            </>
          )}
          <CurrVersionBadge>Version.{currVersion}</CurrVersionBadge>
        </VersionBadgeGroup>
      </RightArea>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  width: 1200px;
  height: 61px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
`;

const LeftArea = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
`;

const BackArrow = styled.svg`
  width: 24px;
  height: 24px;
`;

const DocTitle = styled.h1`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 22px;
  color: #000000;
  margin: 0;
`;

const RightArea = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const UpdateText = styled.span`
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 13px;
  color: #666666;
`;

const VersionBadgeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PrevVersionBadge = styled.div`
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

const ArrowIcon = styled.svg`
  width: 16px;
  height: 16px;
`;

const CurrVersionBadge = styled.div`
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
