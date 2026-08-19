import styled from "styled-components";

export const ContentWrapper = styled.div`
  position: relative;
  background-color: #ffffff;
  padding: 32px 28px 28px 28px;
  width: 100%;
  box-sizing: border-box;
  text-align: left;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #0a0a0a;
`;

export const Title = styled.h2`
  margin: 0 0 12px 0;
  font-size: 1.25rem;
  font-weight: bold;
  color: #0a0a0a;
  text-align: left;
`;

export const Description = styled.p`
  font-size: 0.9rem;
  color: #0a0a0a;
  margin: 0 0 28px 0;
  text-align: left;
`;

export const CodeInputGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
`;

export const SingleInput = styled.input`
  width: 64px;
  height: 64px;
  border: 1px solid #dcdcdc;
  border-radius: 12px;
  background-color: #f7f1f1;
  font-size: 1.8rem;
  font-weight: bold;
  color: #0a0a0a;
  text-align: center;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #2703f1;
    border-width: 2px;
    background-color: #fff;
  }

  &.error {
    border-color: #e53e3e;
  }
`;

export const ErrorText = styled.p`
  color: #e53e3e;
  font-size: 0.8rem;
  text-align: center;
  margin: 8px 0 0 0;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 32px;
`;

export const CancelButton = styled.button`
  flex: 1;
  height: 48px;
  border: 1px solid #2703f1;
  background-color: transparent;
  color: #2703f1;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
`;

export const SubmitButton = styled.button`
  flex: 1;
  height: 48px;
  border: none;
  background-color: #2703f1;
  color: #fff;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;

  &:disabled {
    background-color: #a393f9;
    cursor: not-allowed;
  }
`;
