import React from "react";
import * as S from "./SummarySection.styles";

const SummarySection = ({
  summaryList = [],
  selectedSummaryId,
  onSelectSummary,
}) => {
  return (
    <S.OuterContainer>
      <S.Title>수정사항 요약</S.Title>

      {summaryList.length === 0 ? (
        <S.EmptyBox>
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
          <S.EmptyMessage>아직 수정사항이 없습니다.</S.EmptyMessage>
        </S.EmptyBox>
      ) : (
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

              return (
                <S.Row
                  key={item.id}
                  isSelected={isSelected}
                  onClick={() => onSelectSummary?.(item)}
                >
                  <S.ColPage>{item.pageName || "-"}</S.ColPage>
                  <S.ColNo>{item.number || item.pinNumber || "-"}</S.ColNo>
                  <S.ColItem>{item.itemName || item.item || "-"}</S.ColItem>
                  <S.ColPreview>
                    {item.previewContent || item.content || item.detail || "-"}
                  </S.ColPreview>
                  <S.ColAuthor>{item.author || "본인"}</S.ColAuthor>
                  <S.ColDate>{item.date || item.updatedAt || "-"}</S.ColDate>
                </S.Row>
              );
            })}
          </S.TableBody>
        </S.TableContainer>
      )}
    </S.OuterContainer>
  );
};

export default SummarySection;
