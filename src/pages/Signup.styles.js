import styled, { createGlobalStyle } from "styled-components";
import DocBridge from "../assets/image/DocBridge.svg";
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
  justify-content: flex-start;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 460px;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0px 15px 35px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Logo = styled.div`
  background-image: url(${DocBridge});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 180px;
  height: 44px;
  margin-bottom: 20px;
`;

export const CardTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 6px;
  letter-spacing: -0.5px;
`;

export const CardSubtitle = styled.p`
  font-size: 14px;
  color: #828282;
  margin-bottom: 24px;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 13px;
    font-weight: 600;
    color: #000000;
    letter-spacing: -0.2px;
  }
`;

export const RowGroup = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;

  > div {
    flex: 1;
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
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #b6b6b6;
    width: 18px;
    height: 18px;
    pointer-events: none;
    z-index: 2;
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 44px;
  padding: ${(props) => (props.$hasIcon ? "0 14px 0 48px" : "0 14px")};
  border: 1px solid ${(props) => (props.$hasError ? "#F52727" : "#E2E8F0")};
  border-radius: 8px;
  font-size: 13px;
  color: #000000;
  background-color: #ffffff;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${(props) => (props.$hasError ? "#F52727" : "#2942F1")};
    box-shadow: 0 0 0 3px
      ${(props) => (props.$hasError ? "rgba(245, 39, 39, 0.1)" : "rgba(41, 66, 241, 0.08)")};
  }

  &::placeholder {
    color: #b6b6b6;
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 44px;
  padding: ${(props) => (props.$hasIcon ? "0 30px 0 48px" : "0 30px 0 14px")};
  border: 1px solid ${(props) => (props.$hasError ? "#F52727" : "#E2E8F0")};
  border-radius: 8px;
  font-size: 13px;
  color: ${(props) => (props.value ? "#000000" : "#B6B6B6")};
  background-color: #ffffff;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.2s;

  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%20B6B6B6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;

  &:focus {
    border-color: ${(props) => (props.$hasError ? "#F52727" : "#2942F1")};
    box-shadow: 0 0 0 3px
      ${(props) => (props.$hasError ? "rgba(245, 39, 39, 0.1)" : "rgba(41, 66, 241, 0.08)")};
  }
`;

export const ErrorText = styled.span`
  font-size: 12px;
  color: #f52727;
  margin-top: 2px;
  display: block;
`;

export const FooterLink = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #828282;

  button {
    background: none;
    border: none;
    color: #2942f1;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    font-size: 13px;

    &:hover {
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
  margin-top: 10px;
  transition:
    background-color 0.2s,
    transform 0.1s;

  &:hover:not(:disabled) {
    background-color: #3138e7;
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`;
