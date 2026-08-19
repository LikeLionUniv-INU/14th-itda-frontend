import styled from "styled-components";

export const ContentWrapper = styled.div`
  padding: 36px 28px 28px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

export const IconImage = styled.img`
  width: 64px;
  height: 64px;
  object-fit: contain;
  margin-bottom: 20px;
`;

export const Title = styled.h2`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 20px;
  color: #000000;
  margin: 0 0 10px 0;
  line-height: 1.3;
  text-align: center;
  white-space: pre-line;
`;

export const Description = styled.p`
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 14px;
  color: #828282;
  margin: 0 0 28px 0;
  line-height: 1.5;
  text-align: center;
  white-space: pre-line;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

export const SubButton = styled.button`
  flex: 1;
  height: 44px;
  border-radius: 8px;
  background-color: #ffffff;
  border: 1.5px solid #462fea;
  color: #462fea;
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 15px;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #f8f7ff;
  }
`;

export const MainButton = styled.button`
  flex: 1;
  height: 44px;
  border-radius: 8px;
  background-color: #462fea;
  border: none;
  color: #ffffff;
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 15px;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #3b25cb;
  }
`;
