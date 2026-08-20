import React from "react";
import * as S from "./DiffScreenInfo.styles";

export default function DiffScreenInfo({
  prevScreenName = "",
  prevScreenId = "",
  currScreenName = "",
  currScreenId = "",
  isModified = false,
}) {
  return (
    <S.Container>
      <S.Title>화면 정보</S.Title>

      <S.LabelRow>
        <S.ScreenNameLabel>화면 이름</S.ScreenNameLabel>
        <S.ScreenIdLabel>ID</S.ScreenIdLabel>
      </S.LabelRow>

      {isModified ? (
        <S.DiffGroup>
          <S.InputRow>
            <S.ScreenNameBox isPrev>{prevScreenName || "-"}</S.ScreenNameBox>
            <S.ScreenIdBox isPrev>{prevScreenId || "-"}</S.ScreenIdBox>
          </S.InputRow>
          <S.InputRow>
            <S.ScreenNameBox isCurr>{currScreenName || "-"}</S.ScreenNameBox>
            <S.ScreenIdBox isCurr>{currScreenId || "-"}</S.ScreenIdBox>
          </S.InputRow>
        </S.DiffGroup>
      ) : (
        <S.InputRow>
          <S.ScreenNameBox>{currScreenName || "-"}</S.ScreenNameBox>
          <S.ScreenIdBox>{currScreenId || "-"}</S.ScreenIdBox>
        </S.InputRow>
      )}
    </S.Container>
  );
}
