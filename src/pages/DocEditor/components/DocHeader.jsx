import React from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./DocHeader.styles";

export default function DocHeader({
  docName = "스토리보드",
  currVersion = 1,
  prevVersion,
  mode = "create", // 'create' | 'edit' | 'compare'
  updatedAt,
  onBack,
  onTempSave,
  onSave,
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <S.HeaderContainer>
      {/* 1. 좌측: 뒤로가기 버튼 + 타이틀 표기 */}
      <S.LeftArea onClick={handleBack} style={{ cursor: "pointer" }}>
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
          {docName}_Version.{currVersion} {mode === "edit" ? "수정" : ""}
        </S.DocTitle>
      </S.LeftArea>

      {/* 2. 우측: 작성/수정 모드에 따른 버튼 분기 */}
      <S.RightArea>
        {mode === "compare" && (
          <>
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
          </>
        )}

        {(mode === "create" || mode === "edit") && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {updatedAt && mode === "edit" && (
              <S.UpdateText style={{ marginRight: "8px" }}>
                업데이트 : {updatedAt}
              </S.UpdateText>
            )}
            <S.TempSaveButton type="button" onClick={onTempSave}>
              임시저장
            </S.TempSaveButton>
            <S.SaveButton type="button" onClick={onSave}>
              저장
            </S.SaveButton>
          </div>
        )}
      </S.RightArea>
    </S.HeaderContainer>
  );
}
