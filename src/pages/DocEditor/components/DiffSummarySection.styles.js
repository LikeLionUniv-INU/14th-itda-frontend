import styled from "styled-components";

export const Container = styled.div`
  width: 1200px;
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid #b6b6b6;
  padding: 20px 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const Title = styled.h2`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 18px;
  color: #462fea;
  margin: 0;
`;

export const BadgeGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 6px;
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 12px;
  color: ${({ color }) => color};
  background-color: ${({ color }) =>
    color === "#462FEA"
      ? "#F4F2FF"
      : color === "#1D6621"
        ? "#EFFFE9"
        : "#FFEAEA"};
  border: 1px solid ${({ color }) => color}40;
`;

export const TableContainer = styled.div`
  width: 100%;
  max-height: 200px;
  border-radius: 10px;
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
  min-height: 36px;
  background-color: #f4f4fc;
  border-bottom: 1px solid #d6d6d6;
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 13px;
  color: #000000;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 5;
`;

export const TableBody = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  min-height: 36px;
  border-bottom: 1px solid #eaeaea;
  cursor: pointer;
  background-color: ${({ isSelected, isChecked }) =>
    isSelected ? "#E5DDFF" : isChecked ? "#EFFFE9" : "#FFFFFF"};
  transition: background-color 0.15s;

  &:last-child {
    border-bottom: none;
  }
`;

export const ColPage = styled.div`
  width: 130px;
  display: flex;
  justify-content: center;
  font-size: 13px;
`;

export const ColNo = styled.div`
  width: 80px;
  display: flex;
  justify-content: center;
  font-size: 13px;
`;

export const ColItem = styled.div`
  width: 140px;
  display: flex;
  justify-content: center;
  font-size: 13px;
`;

export const ColPreview = styled.div`
  flex: 1;
  padding: 0 16px;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ColAuthor = styled.div`
  width: 120px;
  display: flex;
  justify-content: center;
  font-size: 13px;
`;

export const ColDate = styled.div`
  width: 130px;
  display: flex;
  justify-content: center;
  font-size: 13px;
`;
