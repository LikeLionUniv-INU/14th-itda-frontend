import React from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./DocHeader.styles";

export default function DocHeader({
  docName = "스토리보드",
  prevVersion = 1,
  currVersion = 1,
  mode = "create", // 'create' | 'edit' | 'compare' | 'view'
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

  const renderTitle = () => {
    const cleanName =
      String(docName)
        .replace(/_?[Vv]ersion\.?\d+/gi, "")
        .trim() || "스토리보드";

    if (mode === "edit") {
      return `${cleanName} Version.${currVersion} 수정`;
    }
    if (mode === "compare") {
      return `${cleanName} Version.${currVersion}`;
    }
    return `${cleanName}_Version.${currVersion}`;
  };

  return (
    <S.HeaderContainer>
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
        <S.DocTitle>{renderTitle()}</S.DocTitle>
      </S.LeftArea>

      <S.RightArea>
        {/* compare (버전 비교 모드) */}
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

        {mode === "view" && updatedAt && (
          <S.UpdateText>업데이트 : {updatedAt}</S.UpdateText>
        )}

        {(mode === "create" || mode === "edit") && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {updatedAt && (
              <S.UpdateText style={{ marginRight: "6px" }}>
                업데이트 : {updatedAt}
              </S.UpdateText>
            )}
            <button
              type="button"
              onClick={onTempSave}
              style={{
                height: "38px",
                padding: "0 18px",
                backgroundColor: "#f3f4f6",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "700",
                color: "#4b5563",
                cursor: "pointer",
              }}
            >
              임시저장
            </button>
            <button
              type="button"
              onClick={onSave}
              style={{
                height: "38px",
                padding: "0 22px",
                backgroundColor: "#462fea",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "700",
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              저장
            </button>
          </div>
        )}
      </S.RightArea>
    </S.HeaderContainer>
  );
}
