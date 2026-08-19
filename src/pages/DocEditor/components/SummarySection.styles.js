import styled from "styled-components";

/* 전체 외곽 컨테이너 (1201px) */
export const OuterContainer = styled.div`
  width: 1201px;
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid #b6b6b6;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Title = styled.h2`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 20px;
  color: #462fea;
  margin: 0;
`;

/* 내부 테이블 영역 (1158px, 개수에 맞춰 자연스럽게 늘어남) */
export const TableContainer = styled.div`
  width: 1158px;
  height: fit-content;
  max-height: 240px;
  border-radius: 12px;
  border: 1px solid #d6d6d6;
  background-color: #ffffff;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

export const TableHeader = styled.div`
  display: flex;
  align-items: center;
  min-height: 37px;
  background-color: #f4f4fc;
  border-bottom: 1px solid #d6d6d6;
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 13px;
  color: #000000;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 5;
  flex-shrink: 0;
`;

export const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  min-height: 37px;
  border-bottom: 1px solid #eaeaea;
  box-sizing: border-box;
  cursor: pointer;
  background-color: ${({ isSelected }) => (isSelected ? "#E5DDFF" : "#FFFFFF")};
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background-color: ${({ isSelected }) => (isSelected ? "#E5DDFF" : "#F9F8FE")};
  }

  &:last-child {
    border-bottom: none;
  }
`;

/* 테이블 열 비율 */
export const ColPage = styled.div`
  width: 130px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 13px;
  color: #000000;
`;

export const ColNo = styled.div`
  width: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 13px;
  color: #000000;
`;

export const ColItem = styled.div`
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 13px;
  color: #000000;
`;

export const ColPreview = styled.div`
  flex: 1;
  padding: 0 16px;
  box-sizing: border-box;
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 13px;
  color: #000000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ColAuthor = styled.div`
  width: 130px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 13px;
  color: #000000;
`;

export const ColDate = styled.div`
  width: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 13px;
  color: #000000;
`;

/* 수정사항이 없을 때 (높이 152px) */
export const EmptyBox = styled.div`
  width: 1158px;
  height: 152px;
  border-radius: 12px;
  border: 1px solid #d6d6d6;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
`;

export const EmptyMessage = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 14px;
  color: #828282;
`;
