import React from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./DocHeader.styles";

export default function DocHeader({
  docName = "스토리보드",
  prevVersion = 1,
  currVersion = 2,
  updatedAt = "2026.06.30. 20:30:37",
}) {
  const navigate = useNavigate();

  return (
    <S.HeaderContainer>
      {/* [<-] 뒤로가기 버튼 */}
      <S.LeftArea onClick={() => navigate("/team-project-main")}>
        <S.BackArrow viewBox="0 0 24 24" fill="none">
          <path
            d="M19 12H5M5 12L12 19M5 12L12 5"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </S.BackArrow>
        <S.DocTitle>
          {docName} Version.{currVersion}
        </S.DocTitle>
      </S.LeftArea>

      {/* 우측: 업데이트 일시 및 버전 배지 */}
      <S.RightArea>
        {updatedAt && <S.UpdateText>업데이트 : {updatedAt}</S.UpdateText>}
        <S.VersionBadgeGroup>
          {prevVersion !== undefined && (
            <>
              <S.PrevVersionBadge>Version.{prevVersion}</S.PrevVersionBadge>
              <S.ArrowIcon viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </S.ArrowIcon>
            </>
          )}
          <S.CurrVersionBadge>Version.{currVersion}</S.CurrVersionBadge>
        </S.VersionBadgeGroup>
      </S.RightArea>
    </S.HeaderContainer>
  );
}
