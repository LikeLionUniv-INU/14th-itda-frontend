import styled from "styled-components";

export const ContentWrapper = styled.div`
  padding: 36px 32px 28px 32px;
  box-sizing: border-box;
  width: 100%;
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 360px;
  margin: 0 auto;
`;

export const ModalIcon = styled.img`
  width: 56px;
  height: 56px;
  margin-bottom: 20px;
  display: block;
`;

export const ModalTitle = styled.h3`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 18px;
  color: #000000;
  line-height: 1.4;
  margin: 0 0 10px 0;
  white-space: pre-line;
`;

export const ModalDesc = styled.p`
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 13px;
  color: #777777;
  line-height: 1.5;
  margin: 0 0 28px 0;
  white-space: pre-line;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

export const CancelBtn = styled.button`
  flex: 1;
  height: 44px;
  border-radius: 8px;
  border: 1.5px solid #8777f8;
  background-color: #ffffff;
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 14px;
  color: #462fea;
  cursor: pointer;
`;

export const ActionBtn = styled.button`
  flex: 1;
  height: 44px;
  border-radius: 8px;
  border: none;
  background-color: #462fea;
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 14px;
  color: #ffffff;
  cursor: pointer;
`;

export const LangModalContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 440px;
  margin: 0 auto;
`;

export const LangTitle = styled.h3`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 18px;
  color: #000000;
  margin: 0 0 8px 0;
`;

export const LangDesc = styled.p`
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 13px;
  color: #777777;
  line-height: 1.4;
  margin: 0 0 20px 0;
  white-space: pre-line;
`;

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  padding: 8px 12px;
  margin-bottom: 24px;
  gap: 8px;
  max-height: 260px;
  overflow-y: auto;
`;

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 6px;
  border-bottom: ${({ isHeader }) => (isHeader ? "1px solid #EEEEEE" : "none")};
  cursor: ${({ isHeader }) => (isHeader ? "pointer" : "default")};
`;

export const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #462fea;
  cursor: pointer;
`;

export const MemberName = styled.span`
  flex: 1;
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 14px;
  color: #222222;
`;

export const SelectBox = styled.select`
  height: 32px;
  padding: 0 10px;
  border-radius: 6px;
  border: 1px solid #d6d6d6;
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 13px;
  outline: none;
  background-color: #ffffff;
  max-width: 160px;
`;
