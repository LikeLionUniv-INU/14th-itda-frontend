import styled from "styled-components";
import popup from "../../assets/image/popup.svg";
import projecticon from "../../assets/image/project icon.svg";

export const PageWrapper = styled.div`
  background-color: #f8f9fa;
  min-height: 100vh;
  font-family: sans-serif;
`;

export const Content = styled.main`
  max-width: 1000px;
  margin: 32px auto;
  padding: 0 10px;
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

export const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 40px;
`;

export const ProjectCard = styled.div`
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.1s ease;

  h4 {
    font-size: 15px;
    margin-bottom: 6px;
  }
  .langs {
    font-size: 12px;
    color: #666;
    margin-bottom: 16px;
  }
  .time {
    font-size: 11px;
    color: #999;
  }
`;

export const AvatarGroup = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
`;

export const MiniAvatar = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: #f3f4f6;
  color: #4f46e5;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
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
