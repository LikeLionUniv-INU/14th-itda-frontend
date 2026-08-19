import styled, { createGlobalStyle } from "styled-components";
import DocBridge로고 from "../assets/image/DocBridge로고.svg";
import map from "../assets/image/map.svg";


export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #F0F1FD;
    color: #000000;
    overflow: hidden;
  }

  h1, h2, h3, p {
    margin: 0;
  }
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background-color: #f0f1fd;
`;

export const MainWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  padding: 0 40px;
  gap: 40px;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

// LeftSection: 위쪽으로 정렬되도록 align-self 및 높이 조정
export const LeftSection = styled.div`
  flex: 1;
  padding: 0 10px 0 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const MainTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: #000000;
  line-height: 1.35;
  margin-bottom: 16px;
  letter-spacing: -0.5px;

  span {
    color: #2942f1;
  }
`;

export const SubDescription = styled.p`
  font-size: 16px;
  color: #828282;
  line-height: 1.6;
  margin-bottom: 28px;
  letter-spacing: -0.2px;
`;

export const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

export const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

export const FeatureIconBox = styled.div`
  width: 52px;
  height: 52px;
  background-color: #ffffff;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  img {
    width: 30px; 
    height: 30px;
    object-fit: contain;
  }
`;

export const FeatureText = styled.div`
  display: flex;
  flex-direction: column;

  strong {
    font-size: 17px;
    color: #000000;
    margin-bottom: 5px;
    letter-spacing: -0.3px;
  }

  span {
    font-size: 14px;
    color: #828282;
    line-height: 1.4;
  }
`;

export const MapGraphic = styled.div`
  background-image: url(${map});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: left bottom;
  width: 100%;
  max-width: 380px;
  height: 160px;
  flex-shrink: 0;
`;

export const RightSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  height: 600px;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 480px;
  height: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 50px;
  box-shadow: 0px 15px 35px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Logo = styled.div`
  background-image: url(${DocBridge로고});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 180px;
  height: 50px;
  margin-bottom: 30px;
`;

export const CardTitle = styled.h2`
  font-size: 26px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
`;

export const CardSubtitle = styled.p`
  font-size: 15px;
  color: #828282;
  margin-bottom: 30px;
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
    font-size: 14px;
    font-weight: 600;
    color: #000000;
    letter-spacing: -0.2px;
  }
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;

  svg,
  img {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #b6b6b6;
    width: 20px;
    height: 20px;
    pointer-events: none;
    z-index: 1;
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 16px 0 45px;
  border: 1px solid ${(props) => (props.hasError ? "#F52727" : "#DCDCDC")};
  border-radius: 10px;
  font-size: 14px;
  color: #000000;
  background-color: #ffffff;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${(props) => (props.hasError ? "#F52727" : "#2942F1")};
    box-shadow: 0 0 0 3px
      ${(props) => (props.hasError ? "rgba(245, 39, 39, 0.1)" : "rgba(41, 66, 241, 0.08)")};
  }

  &::placeholder {
    color: #b6b6b6;
  }
`;

export const ErrorText = styled.span`
  font-size: 13px;
  color: #f52727;
  margin-top: -2px;
  display: block;
`;

export const FooterLink = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #828282;
  margin-top: -8px;

  button {
    background: none;
    border: none;
    color: #2942f1;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    font-size: 13px;
    transition: color 0.2s;

    &:hover {
      color: #3138e7;
      text-decoration: underline;
    }
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  height: 52px;
  background-color: ${(props) => (props.disabled ? "#B6B6B6" : "#2942F1")};
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  margin-top: 16px;
  transition:
    background-color 0.2s,
    transform 0.1s;

  &:hover:not(:disabled) {
    background-color: #3138e7;
  }

  &:active:not(:disabled) {
    background-color: #4253e2;
    transform: translateY(1px);
  }
`;
