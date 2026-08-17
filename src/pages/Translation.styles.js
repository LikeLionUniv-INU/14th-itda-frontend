import styled, { keyframes } from "styled-components";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #FFFCFC;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: sans-serif;
`;

export const CenterContainer = styled.div`
  width: 100%;
  max-width: 960px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  position: relative;
`;

export const SparkleIconWrapper = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: #F0F1FD;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

export const SparkleIcon = styled.div`
  width: 32px;
  height: 32px;
  background-color: #2942F1;
  clip-path: polygon(
    50% 0%, 63% 37%, 100% 50%, 63% 63%,
    50% 100%, 37% 63%, 0% 50%, 37% 37%
  );
`;

export const Title = styled.h2`
  font-size: 22px;
  font-weight: 800;
  color: #000000;
  margin-bottom: 8px;
`;

export const SubTitle = styled.p`
  font-size: 14px;
  color: #828282;
  margin-bottom: 32px;
`;

export const ProgressSection = styled.div`
  width: 100%;
  max-width: 640px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 40px;
`;

export const ProgressBarTrack = styled.div`
  flex: 1;
  height: 14px;
  background-color: #DCDCDC;
  border-radius: 10px;
  overflow: hidden;
`;

export const ProgressBarFill = styled.div`
  height: 100%;
  width: ${(props) => props.$percentage}%;
  background-color: #4253E2;
  border-radius: 10px;
  transition: width 0.4s ease-in-out;
`;

export const ProgressText = styled.span`
  font-size: 18px;
  font-weight: 800;
  color: #000000;
  width: 48px;
`;

export const CardsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  justify-content: center;
`;

export const CardGrid = styled.div`
  display: flex;
  gap: 20px;
`;

export const LangCard = styled.div`
  width: 220px;
  height: 270px;
  background-color: #FFFFFF;
  border: 1px solid #DCDCDC;
  border-radius: 16px;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
`;

export const FlagCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: #F0F1FD;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

export const FlagEmoji = styled.span`
  font-size: 38px;
  line-height: 1;
`;

export const LangName = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 12px;
`;

export const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 16px;

  ${(props) =>
    props.$status === "COMPLETED" &&
    `
    background-color: #D1E7DD;
    color: #0F5132;
  `}

  ${(props) =>
    props.$status === "IN_PROGRESS" &&
    `
    background-color: #F0F1FD;
    color: #4253E2;
  `}

  ${(props) =>
    props.$status === "WAITING" &&
    `
    background-color: #FCE8E6;
    color: #F52727;
  `}

  .spinner {
    display: inline-block;
    animation: ${spin} 2s linear infinite;
  }
`;

export const DescriptionText = styled.p`
  font-size: 11px;
  color: #828282;
  text-align: center;
  line-height: 1.4;
  word-break: keep-all;
`;

export const NavButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: ${(props) => (props.disabled ? "#DCDCDC" : "#B6B6B6")};
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  padding: 8px;

  &:hover {
    color: ${(props) => (props.disabled ? "#DCDCDC" : "#000000")};
  }
`;

export const ToastMessage = styled.div`
  position: absolute;
  bottom: -20px;
  background-color: #3138E7;
  color: #FFFFFF;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;