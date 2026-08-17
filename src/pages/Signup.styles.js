import styled from "styled-components";
import DocBridge로고 from "../assets/image/DocBridge로고.svg";

export const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f0f1fd;
  font-family:
    "Pretendard",
    -apple-system,
    BlinkMacSystemFont,
    system-ui,
    Roboto,
    sans-serif;
`;

export const LeftSection = styled.div`
  flex: 1;
  padding: 60px 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const MainTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #000000;
  line-height: 1.3;
  margin-bottom: 20px;

  span {
    color: #2942f1;
  }
`;

export const SubDescription = styled.p`
  font-size: 15px;
  color: #828282;
  line-height: 1.5;
  margin-bottom: 40px;
`;

export const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
`;

export const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

export const FeatureIconBox = styled.div`
  width: 48px;
  height: 48px;
  background-color: #ffffff;
  border-radius: 8px;
  flex-shrink: 0;
`;

export const FeatureText = styled.div`
  display: flex;
  flex-direction: column;

  strong {
    font-size: 16px;
    font-weight: 700;
    color: #000000;
    margin-bottom: 4px;
  }

  span {
    font-size: 13px;
    color: #828282;
  }
`;

export const MapGraphic = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
`;

export const RightSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 480px;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const LogoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;

  h2 {
    font-size: 26px;
    font-weight: 800;
    color: #2942f1;
  }
`;

export const CardTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 6px;
`;

export const CardSubtitle = styled.p`
  font-size: 14px;
  color: #828282;
  margin-bottom: 28px;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 13px;
    font-weight: 600;
    color: #000000;
  }
`;

export const RowGroup = styled.div`
  display: flex;
  gap: 12px;

  > div {
    flex: 1;
  }
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 14px;
    color: #b6b6b6;
    pointer-events: none;
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 44px;
  padding: ${(props) => (props.hasIcon ? "0 14px 0 42px" : "0 14px")};
  border: 1px solid ${(props) => (props.hasError ? "#F52727" : "#DCDCDC")};
  border-radius: 8px;
  font-size: 14px;
  color: #000000;
  background-color: #ffffff;
  outline: none;

  &:focus {
    border-color: ${(props) => (props.hasError ? "#F52727" : "#2942F1")};
  }

  &::placeholder {
    color: #b6b6b6;
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 44px;
  padding: 0 14px 0 42px;
  border: 1px solid ${(props) => (props.hasError ? "#F52727" : "#DCDCDC")};
  border-radius: 8px;
  font-size: 13px;
  color: ${(props) => (props.value ? "#000000" : "#B6B6B6")};
  background-color: #ffffff;
  outline: none;
  appearance: none;
  cursor: pointer;

  &:focus {
    border-color: ${(props) => (props.hasError ? "#F52727" : "#2942F1")};
  }
`;

export const ErrorText = styled.span`
  font-size: 12px;
  color: #f52727;
  margin-top: 2px;
`;

export const SubmitButton = styled.button`
  width: 100%;
  height: 48px;
  background-color: ${(props) => (props.disabled ? "#B6B6B6" : "#2942F1")};
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  margin-top: 12px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.disabled ? "#B6B6B6" : "#3138E7")};
  }

  &:active {
    background-color: ${(props) => (props.disabled ? "#B6B6B6" : "#4253E2")};
  }
`;
