import React, { useState } from "react";
import styled from "styled-components";

const ROLES = ["공통", "기획", "프론트", "백엔드", "디자인"];

export default function DiffRequirementSection({
  requirements = {},
  focusedPinId,
  onFocusPin,
}) {
  const [activeRole, setActiveRole] = useState("공통");
  const currentList = requirements[activeRole] || [];

  return (
    <Container>
      <Title>요구사항 작성</Title>

      {/* 1. 상단 직무별 탭 (5등분 균등 분할) */}
      <TabList>
        {ROLES.map((role) => (
          <TabItem
            key={role}
            active={activeRole === role}
            onClick={() => setActiveRole(role)}
          >
            {role}
          </TabItem>
        ))}
      </TabList>

      {/* 2. 상단 범례 3색 동그라미 */}
      <LegendRow>
        <LegendItem>
          <LegendCircle color="#FFC2C2" />
          <LegendLabel>변경 전</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendCircle color="#B2FF97" />
          <LegendLabel>변경 후</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendCircle color="#9ED2FE" />
          <LegendLabel>추가사항</LegendLabel>
        </LegendItem>
      </LegendRow>

      {/* 3. 요구사항 테이블 (개수 맞춤 높이 + 최대 높이 초과 시 스크롤) */}
      <TableWrapper>
        <TableHeader>
          <ColNoHeader>No.</ColNoHeader>
          <ColItemHeader>항목</ColItemHeader>
          <ColDetailHeader>요구사항</ColDetailHeader>
        </TableHeader>

        <TableBody>
          {currentList.length === 0 ? (
            <EmptyRow>등록된 요구사항이 없습니다.</EmptyRow>
          ) : (
            currentList.map((row) => {
              const isFocused = focusedPinId === row.id;

              // 1. 수정된 행 (외곽 초록 테두리 + 상하 2단 분할)
              if (row.type === "modified") {
                return (
                  <ModifiedRowContainer
                    key={row.id}
                    isFocused={isFocused}
                    onClick={() => onFocusPin?.(row.id)}
                  >
                    <ColNoCell>
                      <PinBadge>{row.number}</PinBadge>
                    </ColNoCell>

                    <RightContentWrapper>
                      {/* 상단: 변경 전 (빨간색 #FF0000 / #FFEAEA) */}
                      <SubRow bgColor="#FFEAEA" isFirst>
                        <ColItemCell textColor="#FF0000">
                          {row.prevItem}
                        </ColItemCell>
                        <ColDetailCell textColor="#FF0000">
                          {row.prevDetail}
                        </ColDetailCell>
                      </SubRow>
                      {/* 하단: 변경 후 (초록색 #1D6621 / #EFFFE9) */}
                      <SubRow bgColor="#EFFFE9">
                        <ColItemCell textColor="#1D6621">
                          {row.currItem}
                        </ColItemCell>
                        <ColDetailCell textColor="#1D6621">
                          {row.currDetail}
                        </ColDetailCell>
                      </SubRow>
                    </RightContentWrapper>
                  </ModifiedRowContainer>
                );
              }

              // 2. 추가사항 행 (연파랑 #E9F5FF)
              if (row.type === "added") {
                return (
                  <StandardRow
                    key={row.id}
                    bgColor="#E9F5FF"
                    isFocused={isFocused}
                    onClick={() => onFocusPin?.(row.id)}
                  >
                    <ColNoCell>
                      <PinBadge>{row.number}</PinBadge>
                    </ColNoCell>
                    <ColItemCell>{row.currItem}</ColItemCell>
                    <ColDetailCell>{row.currDetail}</ColDetailCell>
                  </StandardRow>
                );
              }

              // 3. 일반 행 (흰색 #FFFFFF)
              return (
                <StandardRow
                  key={row.id}
                  bgColor="#FFFFFF"
                  isFocused={isFocused}
                  onClick={() => onFocusPin?.(row.id)}
                >
                  <ColNoCell>
                    <PinBadge>{row.number}</PinBadge>
                  </ColNoCell>
                  <ColItemCell>{row.currItem}</ColItemCell>
                  <ColDetailCell>{row.currDetail}</ColDetailCell>
                </StandardRow>
              );
            })
          )}
        </TableBody>
      </TableWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Title = styled.h3`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 18px;
  color: #462fea;
  margin: 0 0 16px 0;
`;

/* 상단 탭 5등분 균등 분할 */
const TabList = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 14px;
`;

const TabItem = styled.div`
  flex: 1;
  text-align: center;
  padding: 10px 0;
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 14px;
  color: ${({ active }) => (active ? "#462FEA" : "#777777")};
  border-bottom: ${({ active }) => (active ? "2.5px solid #462FEA" : "none")};
  cursor: pointer;
`;

const LegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 14px;
  padding-left: 2px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LegendCircle = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;

const LegendLabel = styled.span`
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 12px;
  color: #333333;
`;

/* 테이블 전체 컨테이너: fit-content로 줄어들고, 최대 670px까지 늘어난 뒤 내부 스크롤 */
const TableWrapper = styled.div`
  width: 100%;
  height: fit-content;
  max-height: 670px;
  border-radius: 12px;
  border: 1px solid #d6d6d6;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffffff;
  box-sizing: border-box;
`;

const TableHeader = styled.div`
  display: flex;
  align-items: stretch;
  min-height: 40px;
  background-color: #f6f4fd;
  border-bottom: 1px solid #d6d6d6;
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 13px;
  text-align: center;
  color: #000000;
  flex-shrink: 0;
`;

/* 열 비율: 60px | 110px | flex: 1 */
const ColNoHeader = styled.div`
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #d6d6d6;
  flex-shrink: 0;
`;

const ColItemHeader = styled.div`
  width: 110px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #d6d6d6;
  flex-shrink: 0;
`;

const ColDetailHeader = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 12px;
`;

const TableBody = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const EmptyRow = styled.div`
  padding: 40px 0;
  text-align: center;
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 13px;
  color: #828282;
`;

/* 일반 및 추가 행 */
const StandardRow = styled.div`
  display: flex;
  align-items: stretch;
  border-bottom: 1px solid #d6d6d6;
  background-color: ${({ bgColor }) => bgColor};
  cursor: pointer;
  min-height: 52px;
  box-sizing: border-box;

  &:last-child {
    border-bottom: none;
  }
`;

/* 수정된 2단 행 (외곽 초록 테두리 고정) */
const ModifiedRowContainer = styled.div`
  display: flex;
  align-items: stretch;
  border: 1.5px solid #aff5b3;
  box-sizing: border-box;
  cursor: pointer;
  background-color: #ffffff;
  width: 100%;
`;

const ColNoCell = styled.div`
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #d6d6d6;
  flex-shrink: 0;
  background-color: inherit;
`;

const PinBadge = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #462fea;
  color: #ffffff;
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
`;

const RightContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SubRow = styled.div`
  display: flex;
  align-items: stretch;
  background-color: ${({ bgColor }) => bgColor};
  min-height: 50px;
  box-sizing: border-box;
  border-bottom: ${({ isFirst }) => (isFirst ? "1px solid #D6D6D6" : "none")};
`;

const ColItemCell = styled.div`
  width: 110px;
  text-align: center;
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 13px;
  color: ${({ textColor }) => textColor || "#000000"};
  padding: 10px 6px;
  border-right: 1px solid #d6d6d6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
`;

const ColDetailCell = styled.div`
  flex: 1;
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 13px;
  line-height: 1.45;
  color: ${({ textColor }) => textColor || "#000000"};
  padding: 10px 14px;
  white-space: pre-line;
  display: flex;
  align-items: center;
  box-sizing: border-box;
`;
