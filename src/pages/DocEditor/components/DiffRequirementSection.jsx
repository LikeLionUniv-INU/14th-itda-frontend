import React, { useState } from "react";
import * as S from "./DiffRequirementSection.styles";

const ROLES = ["공통", "기획", "프론트", "백엔드", "디자인"];

export default function DiffRequirementSection({
  requirements = {},
  focusedPinId,
  onFocusPin,
}) {
  const [activeRole, setActiveRole] = useState("공통");
  const currentList = requirements[activeRole] || [];

  return (
    <S.Container>
      <S.Title>요구사항 작성</S.Title>

      {/* 1. 상단 직무별 탭 */}
      <S.TabList>
        {ROLES.map((role) => (
          <S.TabItem
            key={role}
            active={activeRole === role}
            onClick={() => setActiveRole(role)}
          >
            {role}
          </S.TabItem>
        ))}
      </S.TabList>

      {/* 2. 상단 범례 3색 동그라미 */}
      <S.LegendRow>
        <S.LegendItem>
          <S.LegendCircle color="#FFC2C2" />
          <S.LegendLabel>변경 전</S.LegendLabel>
        </S.LegendItem>
        <S.LegendItem>
          <S.LegendCircle color="#B2FF97" />
          <S.LegendLabel>변경 후</S.LegendLabel>
        </S.LegendItem>
        <S.LegendItem>
          <S.LegendCircle color="#9ED2FE" />
          <S.LegendLabel>추가사항</S.LegendLabel>
        </S.LegendItem>
      </S.LegendRow>

      {/* 3. 요구사항 테이블 */}
      <S.TableWrapper>
        <S.TableHeader>
          <S.ColNoHeader>No.</S.ColNoHeader>
          <S.ColItemHeader>항목</S.ColItemHeader>
          <S.ColDetailHeader>요구사항</S.ColDetailHeader>
        </S.TableHeader>

        <S.TableBody>
          {currentList.length === 0 ? (
            <S.EmptyRow>등록된 요구사항이 없습니다.</S.EmptyRow>
          ) : (
            currentList.map((row) => {
              const isFocused = focusedPinId === row.id;

              if (row.type === "modified") {
                return (
                  <S.ModifiedRowContainer
                    key={row.id}
                    isFocused={isFocused}
                    onClick={() => onFocusPin?.(row.id)}
                  >
                    <S.ColNoCell>
                      <S.PinBadge>{row.number}</S.PinBadge>
                    </S.ColNoCell>
                    <S.RightContentWrapper>
                      <S.SubRow bgColor="#FFEAEA" isFirst>
                        <S.ColItemCell textColor="#FF0000">
                          {row.prevItem}
                        </S.ColItemCell>
                        <S.ColDetailCell textColor="#FF0000">
                          {row.prevDetail}
                        </S.ColDetailCell>
                      </S.SubRow>
                      <S.SubRow bgColor="#EFFFE9">
                        <S.ColItemCell textColor="#1D6621">
                          {row.currItem}
                        </S.ColItemCell>
                        <S.ColDetailCell textColor="#1D6621">
                          {row.currDetail}
                        </S.ColDetailCell>
                      </S.SubRow>
                    </S.RightContentWrapper>
                  </S.ModifiedRowContainer>
                );
              }

              const isAdded = row.type === "added";
              return (
                <S.StandardRow
                  key={row.id}
                  bgColor={isAdded ? "#E9F5FF" : "#FFFFFF"}
                  isFocused={isFocused}
                  onClick={() => onFocusPin?.(row.id)}
                >
                  <S.ColNoCell>
                    <S.PinBadge>{row.number}</S.PinBadge>
                  </S.ColNoCell>
                  <S.ColItemCell>{row.currItem}</S.ColItemCell>
                  <S.ColDetailCell>{row.currDetail}</S.ColDetailCell>
                </S.StandardRow>
              );
            })
          )}
        </S.TableBody>
      </S.TableWrapper>
    </S.Container>
  );
}
