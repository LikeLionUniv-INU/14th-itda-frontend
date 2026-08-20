import styled from "styled-components";
import popup from "../../assets/image/popup.svg";
import projecticon from "../../assets/image/project icon.svg";
import docicon from "../../assets/image/doc icon.svg";

export const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: auto;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 80px 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Banner = styled.div`
  background: linear-gradient(135deg, #efeefe 0%, #e0e7ff 100%);
  border-radius: 12px;
  padding: 30px 40px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

export const BannerText = styled.div`
  h2 {
    font-size: 22px;
    margin-bottom: 10px;
    color: #000000;
  }
  p {
    font-size: 14px;
    color: #5b5858;
    line-height: 1.5;
  }
`;

export const Popup = styled.div`
  background-image: url(${popup});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 40%;
  height: 120px;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 18px;
  color: #111;
  font-weight: bold;
`;

export const MoreLink = styled.a`
  background: none;
  border: none;
  padding: 0;
  font-size: 13px;
  color: #888;
  cursor: pointer;
  display: inline-flex;
  align-items: center;

  &:hover {
    color: #333;
  }
`;

export const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
`;

export const ProjectCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px 20px;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  h4 {
    font-family: "Pretendard-Bold", sans-serif;
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: #111111;
  }
  .langs {
    font-family: "Pretendard-Regular", sans-serif;
    font-size: 13px;
    color: #666666;
    margin: 0 0 20px 0;
  }
`;

export const AvatarGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 14px;
`;

export const MiniAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ $isMore }) => ($isMore ? "#E5E7EB" : "#F0F0FF")};
  color: ${({ $isMore }) => ($isMore ? "#4B5563" : "#462FEA")};
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ffffff;
  margin-right: -4px;
`;

export const CardFooterText = styled.div`
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 12px;
  color: #8a8a8a;
  margin-top: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  th,
  td {
    padding: 12px 16px;
    text-align: left;
    font-size: 13px;
  }

  th {
    background-color: #f3f2fc;
    color: #828282;
    font-weight: 500;
  }

  td {
    border-top: 1px solid #ffffff;
    color: #000000;
  }

  .doc-name {
    font-weight: 600;
    cursor: pointer;
  }
`;

export const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin-bottom: 40px;

  h4 {
    margin: 12px 0 4px 0;
    font-size: 15px;
    font-weight: 700;
    color: #111;
  }

  p {
    font-size: 12px;
    color: #888;
    margin-bottom: 16px;
  }
`;

export const ActionButton = styled.button`
  padding: 8px 18px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #4338ca;
  }
`;

export const ProjectIcon = styled.div`
  background-image: url("${projecticon}");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 80px;
  height: 80px;
  margin-bottom: 12px;
`;

export const DocIcon = styled.div`
  background-image: url("${docicon}");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 80px;
  height: 80px;
  margin-bottom: 12px;
`;

export const NotificationBar = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ebf2ff;
  border: 1px solid #bed8ff;
  border-radius: 12px;
  padding: 16px 24px;
  margin-bottom: 20px; /* 다른 섹션들과의 간격 맞춤 */
`;

export const NotificationLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const NotificationIconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 1px solid #dce8ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2f65f6;
  flex-shrink: 0;
`;

export const NotificationTextContainer = styled.div`
  display: flex;
  flex-direction: column;

  h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #111111;
  }

  p {
    margin: 4px 0 0 0;
    font-size: 12px;
    font-weight: 600;
    color: #666666;
  }
`;

export const NotificationButton = styled.button`
  background-color: #2f65f6;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: #1d4ed8;
  }
`;