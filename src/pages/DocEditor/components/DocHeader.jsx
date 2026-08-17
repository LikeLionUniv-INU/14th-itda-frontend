import React from "react";
import Button from "../../../components/Button";
import * as S from "./DocHeader.styles";

const BackArrowIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DocHeader = ({
  docName = "스토리보드",
  version = 1,
  mode = "create",
  updatedAt,
  onBack,
  onTempSave,
  onSave,
}) => {
  const getTitleText = () => {
    if (mode === "edit") {
      return `${docName} Version.${version} 수정`;
    }
    return `${docName}_Version.${version}`;
  };

  return (
    <S.HeaderContainer>
      <S.LeftSection>
        <S.BackButton type="button" onClick={onBack}>
          <BackArrowIcon />
        </S.BackButton>
        <S.Title>{getTitleText()}</S.Title>
      </S.LeftSection>

      <S.RightSection>
        {updatedAt && <S.UpdateTime>업데이트 : {updatedAt}</S.UpdateTime>}
        {mode !== "view" && (
          <S.ButtonBox>
            <Button variant="secondary" onClick={onTempSave}>
              임시저장
            </Button>
            <Button variant="primary" onClick={onSave}>
              저장
            </Button>
          </S.ButtonBox>
        )}
      </S.RightSection>
    </S.HeaderContainer>
  );
};

export default DocHeader;
