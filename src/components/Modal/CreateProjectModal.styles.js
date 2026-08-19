import styled from "styled-components";

export const ContentWrapper = styled.div`
  position: relative;
  background-color: #fdf5f5;
  padding: 32px 24px 24px 24px;
  width: 100%;
  box-sizing: border-box;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #333;
`;

export const Title = styled.h2`
  margin: 0 0 20px 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: #111;
`;

export const SubDescription = styled.p`
  font-size: 0.85rem;
  color: #666;
  text-align: center;
  margin: 0;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
`;

export const Label = styled.label`
  font-size: 0.85rem;
  font-weight: bold;
  color: #333;
`;

export const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  background-color: #fff;

  &:focus {
    border-color: #4f22e2;
  }
`;

export const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  background-color: #fff;
`;

export const ErrorText = styled.span`
  color: #e53e3e;
  font-size: 0.75rem;
  margin-top: 2px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 24px;
`;

export const CancelButton = styled.button`
  flex: 1;
  padding: 10px;
  border: 1px solid #4f22e2;
  background-color: transparent;
  color: #4f22e2;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
`;

export const SubmitButton = styled.button`
  flex: 1;
  padding: 10px;
  border: none;
  background-color: #4f22e2;
  color: #fff;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const InviteCodeBox = styled.div`
  background-color: #efe8f4;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  font-size: 1.8rem;
  font-weight: bold;
  letter-spacing: 6px;
  color: #111;
  margin: 16px 0;
`;

export const ExpireInfo = styled.p`
  font-size: 0.8rem;
  color: #555;
  text-align: center;
  margin-bottom: 20px;
`;
