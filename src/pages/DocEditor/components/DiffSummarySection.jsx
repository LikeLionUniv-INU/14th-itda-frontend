import React from "react";
import * as S from "./DiffSummarySection.styles";

export default function DiffSummarySection({
  summaryList = [],
  checkedIds = [],
  selectedSummaryId,
  onSelectSummary,
}) {
  const totalCount = summaryList.length;
  const checkedCount = checkedIds.length;
  const uncheckedCount = totalCount - checkedCount;

  return (
    <S.Container>
      <S.TitleRow>
        <S.Title>수정사항 요약</S.Title>
        <S.BadgeGroup>
          <S.Badge color="#462FEA">수정사항 {totalCount}</S.Badge>
          <S.Badge color="#1D6621">확인 {checkedCount}</S.Badge>
          <S.Badge color="#FF0000">미확인 {uncheckedCount}</S.Badge>
        </S.BadgeGroup>
      </S.TitleRow>

      <S.TableContainer>
        <S.TableHeader>
          <S.ColPage>페이지</S.ColPage>
          <S.ColNo>No.</S.ColNo>
          <S.ColItem>항목</S.ColItem>
          <S.ColPreview style={{ textAlign: "center" }}>
            수정 내용 미리보기
          </S.ColPreview>
          <S.ColAuthor>수정자</S.ColAuthor>
          <S.ColDate>수정일</S.ColDate>
        </S.TableHeader>

        <S.TableBody>
          {summaryList.map((item) => {
            const isSelected = selectedSummaryId === item.id;
            const isChecked = checkedIds.includes(item.id);

            return (
              <S.Row
                key={item.id}
                isSelected={isSelected}
                isChecked={isChecked}
                onClick={() => onSelectSummary?.(item)}
              >
                <S.ColPage>{item.pageName}</S.ColPage>
                <S.ColNo>{item.number}</S.ColNo>
                <S.ColItem>{item.itemName || "-"}</S.ColItem>
                <S.ColPreview>{item.previewContent || "-"}</S.ColPreview>
                <S.ColAuthor>{item.author}</S.ColAuthor>
                <S.ColDate>{item.date}</S.ColDate>
              </S.Row>
            );
          })}
        </S.TableBody>
      </S.TableContainer>
    </S.Container>
  );
}
