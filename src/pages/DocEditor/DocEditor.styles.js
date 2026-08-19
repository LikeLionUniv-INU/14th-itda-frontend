import styled from "styled-components";

export const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  padding: 40px 0 80px 0;
  box-sizing: border-box;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  width: 1200px;
`;

export const HeaderWrapper = styled.div`
  width: 1200px;
  height: 61px;
  display: flex;
  align-items: center;
`;

export const MainSection = styled.div`
  display: flex;
  width: 1200px;
  justify-content: space-between;
  align-items: flex-end;
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 712px;
`;

export const PageNavWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
`;

export const LeftBox = styled.div`
  width: 712px;
  height: 854px;
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid #b6b6b6;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Divider = styled.hr`
  width: 100%;
  height: 1px;
  border: none;
  background-color: #eaeaea;
  margin: 0;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 468px;
`;

export const RightBox = styled.div`
  width: 468px;
  height: 854px;
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid #b6b6b6;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;
