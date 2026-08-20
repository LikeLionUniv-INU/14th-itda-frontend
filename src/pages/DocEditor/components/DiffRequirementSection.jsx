import React, { useState } from "react";
import * as S from "./DiffRequirementSection.styles";

const ROLES = ["공통", "기획", "프론트", "백엔드", "디자인"];

export default function DiffRequirementSection({
  requirements = {},
  focusedPinId,
  activeRole: externalActiveRole,
  onChangeRole,
  onFocusPin,
}) {
  const [internalActiveRole, setInternalActiveRole] = useState("공통");
  const activeRole = externalActiveRole || internalActiveRole;

  const currentList = requirements[activeRole] || [];

  const handleTabChange = (role) => {
    if (onChangeRole) {
      onChangeRole(role);
    } else {
      setInternalActiveRole(role);
    }
  };

  return (
    <S.Container>
      <S.Title>요구사항 작성</S.Title>

      <S.TabList>
        {ROLES.map((role) => (
          <S.TabItem
            key={role}
            active={activeRole === role}
            onClick={() => handleTabChange(role)}
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
            currentList.map((row, index) => {
              const isFocused = focusedPinId === row.id;

              if (row.type === "modified") {
                return (
                  <S.ModifiedRowContainer
                    key={row.reqId || `${row.id}_${index}`}
                    isFocused={isFocused}
                    onClick={() => onFocusPin?.(row.id)}
                  >
                    <S.ColNoCell>
                      <S.PinBadge>{row.number}</S.PinBadge>
                    </S.ColNoCell>
                    <S.RightContentWrapper>
                      <S.SubRow bgColor="#FFEAEA" isFirst>
                        <S.ColItemCell textColor="#FF0000">
                          {row.prevItem || "-"}
                        </S.ColItemCell>
                        <S.ColDetailCell textColor="#FF0000">
                          {row.prevDetail || "-"}
                        </S.ColDetailCell>
                      </S.SubRow>
                      <S.SubRow bgColor="#EFFFE9">
                        <S.ColItemCell textColor="#1D6621">
                          {row.currItem || "-"}
                        </S.ColItemCell>
                        <S.ColDetailCell textColor="#1D6621">
                          {row.currDetail || "-"}
                        </S.ColDetailCell>
                      </S.SubRow>
                    </S.RightContentWrapper>
                  </S.ModifiedRowContainer>
                );
              }

              const isAdded = row.type === "added";
              return (
                <S.StandardRow
                  key={row.reqId || `${row.id}_${index}`}
                  bgColor={isAdded ? "#E9F5FF" : "#FFFFFF"}
                  isFocused={isFocused}
                  onClick={() => onFocusPin?.(row.id)}
                >
                  <S.ColNoCell>
                    <S.PinBadge>{row.number}</S.PinBadge>
                  </S.ColNoCell>
                  <S.ColItemCell textColor={isAdded ? "#0066CC" : "#000000"}>
                    {row.currItem || "-"}
                  </S.ColItemCell>
                  <S.ColDetailCell textColor={isAdded ? "#0066CC" : "#000000"}>
                    {row.currDetail || "-"}
                  </S.ColDetailCell>
                </S.StandardRow>
              );
            })
          )}
        </S.TableBody>
      </S.TableWrapper>
    </S.Container>
  );
}
