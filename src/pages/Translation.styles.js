import styled, { keyframes } from "styled-components";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif;
`;

export const CenterContainer = styled.div`
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  position: relative;
`;

export const SparkleIconWrapper = styled.div`
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background-color: #edeaff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

export const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #111111;
  margin: 0 0 8px 0;
`;

export const SubTitle = styled.p`
  font-size: 13px;
  color: #777777;
  margin: 0 0 28px 0;
`;

export const ProgressSection = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 36px;
`;

export const ProgressBarTrack = styled.div`
  flex: 1;
  height: 12px;
  background-color: #e5e7eb;
  border-radius: 20px;
  overflow: hidden;
`;

export const ProgressBarFill = styled.div`
  height: 100%;
  width: ${(props) => props.$percentage}%;
  background-color: #5243e9;
  border-radius: 20px;
  transition: width 0.5s ease-in-out;
`;

export const ProgressText = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #111111;
  width: 48px;
  text-align: right;
`;

export const CardsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  justify-content: center;
`;

export const CardGrid = styled.div`
  display: flex;
  gap: 16px;
`;

export const LangCard = styled.div`
  width: 200px;
  height: 260px;
  background-color: #ffffff;
  border: 1.5px solid #eef0f3;
  border-radius: 16px;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
`;

export const FlagCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 1px solid #edf0f5;
  background-color: #fafbfc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const LangName = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: #111111;
  margin: 0 0 12px 0;
`;

export const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 14px;

  /* 완료 상태: 연두색 */
  ${(props) =>
    props.$status === "COMPLETED" &&
    `
    background-color: #EBF8EE;
    color: #1CA74B;
  `}

  /* 번역 중 상태: 연보라색 */
  ${(props) =>
    props.$status === "IN_PROGRESS" &&
    `
    background-color: #EAE8FC;
    color: #5243E9;
  `}

  /* 대기 중 상태: 연분홍색 */
  ${(props) =>
    props.$status === "WAITING" &&
    `
    background-color: #FEEEEE;
    color: #EB4747;
  `}

  .spinner {
    animation: ${spin} 2s linear infinite;
  }
`;

export const DescriptionText = styled.p`
  font-size: 11px;
  color: #777777;
  text-align: center;
  line-height: 1.45;
  word-break: keep-all;
  margin: 0;
`;

/* 피그마의 깔끔한 삼각형 네비게이션 화살표 */
export const TriangleButton = styled.button`
  background: none;
  border: none;
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  color: ${(props) => (props.disabled ? "#DCDFE4" : "#5243E9")};
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => (props.disabled ? "#DCDFE4" : "#3D2ED4")};
  }
`;

/* 하단 완료 토스트 알림바 (피그마 완벽 일치) */
export const ToastMessage = styled.div`
  position: absolute;
  bottom: -40px;
  width: 100%;
  max-width: 660px;
  background-color: #f2fbf4;
  border: 1px solid #d4f2dc;
  color: #111111;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
