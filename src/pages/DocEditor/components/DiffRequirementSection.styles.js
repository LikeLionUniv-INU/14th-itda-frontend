import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Title = styled.h3`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 18px;
  color: #462fea;
  margin: 0 0 16px 0;
`;

export const TabList = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 14px;
`;

export const TabItem = styled.div`
  flex: 1;
  text-align: center;
  padding: 10px 0;
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 14px;
  color: ${({ active }) => (active ? "#462FEA" : "#777777")};
  border-bottom: ${({ active }) => (active ? "2.5px solid #462FEA" : "none")};
  cursor: pointer;
`;

export const LegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 14px;
  padding-left: 2px;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const LegendCircle = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;

export const LegendLabel = styled.span`
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 12px;
  color: #333333;
`;

export const TableWrapper = styled.div`
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

export const TableHeader = styled.div`
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

export const ColNoHeader = styled.div`
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #d6d6d6;
  flex-shrink: 0;
`;

export const ColItemHeader = styled.div`
  width: 110px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #d6d6d6;
  flex-shrink: 0;
`;

export const ColDetailHeader = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 12px;
`;

export const TableBody = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const EmptyRow = styled.div`
  padding: 40px 0;
  text-align: center;
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 13px;
  color: #828282;
`;

export const StandardRow = styled.div`
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

export const ModifiedRowContainer = styled.div`
  display: flex;
  align-items: stretch;
  border: 1.5px solid #aff5b3;
  box-sizing: border-box;
  cursor: pointer;
  background-color: #ffffff;
  width: 100%;
`;

export const ColNoCell = styled.div`
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #d6d6d6;
  flex-shrink: 0;
  background-color: inherit;
`;

export const PinBadge = styled.div`
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

export const RightContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const SubRow = styled.div`
  display: flex;
  align-items: stretch;
  background-color: ${({ bgColor }) => bgColor};
  min-height: 50px;
  box-sizing: border-box;
  border-bottom: ${({ isFirst }) => (isFirst ? "1px solid #D6D6D6" : "none")};
`;

export const ColItemCell = styled.div`
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

export const ColDetailCell = styled.div`
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
