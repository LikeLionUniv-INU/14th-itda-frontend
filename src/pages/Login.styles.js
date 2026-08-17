import styled from "styled-components";

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
  max-width: 460px;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 48px 40px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const LogoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;

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
  margin-bottom: 8px;
`;

export const CardSubtitle = styled.p`
  font-size: 14px;
  color: #828282;
  margin-bottom: 32px;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 13px;
    font-weight: 600;
    color: #000000;
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
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 14px 0 42px;
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

export const ErrorText = styled.span`
  font-size: 12px;
  color: #f52727;
  margin-top: 2px;
`;

export const FooterLink = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #828282;
  margin-top: -8px;

  button {
    background: none;
    border: none;
    color: #2942f1;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    font-size: 12px;

    &:hover {
      color: #3138e7;
      text-decoration: underline;
    }
  }
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
  margin-top: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.disabled ? "#B6B6B6" : "#3138E7")};
  }

  &:active {
    background-color: ${(props) => (props.disabled ? "#B6B6B6" : "#4253E2")};
  }
`;
