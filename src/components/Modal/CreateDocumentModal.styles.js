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
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  font-weight: bold;
  color: #0a0a0a;
`;

export const SubTitle = styled.p`
  font-size: 0.85rem;
  color: #666;
  margin: 0 0 20px 0;
`;

/* 1단계 스타일 */
export const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const OptionCard = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid ${(props) => (props.active ? "#2703f1" : "#e5e5e5")};
  background-color: ${(props) => (props.active ? "#f3f0ff" : "#ffffff")};
  border-radius: 12px;
  cursor: ${(props) => (props.active ? "pointer" : "default")};
  transition: all 0.2s ease;

  ${(props) =>
    props.active &&
    `
    &:hover {
      box-shadow: 0 4px 12px rgba(39, 3, 241, 0.15);
    }
  `}
`;

export const CardIconBox = styled.div`
  width: 40px;
  height: 40px;
  background-color: #e0e0e0;
  border-radius: 6px;
  margin-right: 12px;
  flex-shrink: 0;
`;

export const CardContent = styled.div`
  flex: 1;
`;

export const CardTitle = styled.div`
  font-size: 0.95rem;
  font-weight: bold;
  color: ${(props) => (props.active ? "#2703f1" : "#0a0a0a")};
  margin-bottom: 2px;
`;

export const CardDesc = styled.div`
  font-size: 0.75rem;
  color: #777;
`;

export const ArrowIcon = styled.div`
  color: #2703f1;
  font-weight: bold;
  font-size: 1.1rem;
`;

export const DisabledBadge = styled.span`
  font-size: 0.7rem;
  color: #888;
  background-color: #eee;
  padding: 4px 8px;
  border-radius: 4px;
`;

/* 2단계 스타일 */
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
`;

export const Label = styled.label`
  font-size: 0.85rem;
  font-weight: bold;
  color: #0a0a0a;
`;

export const Input = styled.input`
  padding: 12px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #0a0a0a;
  outline: none;
  background-color: #fff;

  &:focus {
    border-color: #2703f1;
  }

  &.error {
    border-color: #e53e3e;
  }
`;

export const Select = styled.select`
  padding: 12px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #0a0a0a;
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
  gap: 12px;
  margin-top: 28px;
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

export const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const IconWrapper = styled.div`
  margin: 16px 0;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 90px;
    height: 90px;
    object-fit: contain;
  }
`;

export const SuccessMessage = styled.h3`
  font-size: 1.15rem;
  font-weight: bold;
  color: #0a0a0a;
  margin: 0 0 20px 0;
`;

export const SummaryBox = styled.div`
  width: 100%;
  background-color: #f1f1fd;
  border-radius: 12px;
  padding: 16px 20px;
  box-sizing: border-box;
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.85rem;

  &:last-child {
    margin-bottom: 0;
  }

  .key {
    color: #666;
  }

  .value {
    color: #0a0a0a;
    font-weight: bold;
  }
`;

export const CompleteButton = styled.button`
  width: 100%;
  height: 42px;
  border: none;
  background-color: #2703f1;
  color: #fff;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;
