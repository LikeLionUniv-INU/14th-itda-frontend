import styled from "styled-components";

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 492px;
  box-sizing: border-box;
`;

export const TitleBox = styled.div`
  display: flex;
  align-items: center;
  width: 492px;
  height: 34px;
`;

export const Title = styled.h2`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 20px;
  color: #462fea;
  margin: 0;
  line-height: 1;
`;

export const InputGroupRow = styled.div`
  display: flex;
  gap: 16px;
  width: 492px;
  height: 73px;
`;

export const FieldWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 73px;
`;

export const Label = styled.label`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 16px;
  color: #000000;
  line-height: 1;
`;

export const Input = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid #d6d6d6;
  background-color: #ffffff;
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 14px;
  color: #000000;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s ease-in-out;

  &::placeholder {
    color: #828282;
    font-family: "Pretendard-Regular", sans-serif;
  }

  &:focus:not(:read-only) {
    border-color: #462fea;
  }

  &:read-only {
    cursor: default;
  }
`;
