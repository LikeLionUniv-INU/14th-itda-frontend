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

      {/* 상단 라벨 */}
      <S.LabelRow>
        <S.ScreenNameLabel>화면 이름</S.ScreenNameLabel>
        <S.ScreenIdLabel>ID</S.ScreenIdLabel>
      </S.LabelRow>

      {/* 변경사항이 있을 때만 2줄(위: 변경 전 빨강, 아래: 변경 후 초록) */}
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
