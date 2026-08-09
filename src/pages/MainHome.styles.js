import styled from "styled-components";
import DocBridge로고 from "../assets/image/DocBridge로고.png";

export const PageWrapper = styled.div`
  background-color: #f8f9fa;
  min-height: 100vh;
  font-family: sans-serif;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 80px;
  background: #fff;
  border-bottom: 1px solid #eee;
`;

// 로고 이미지 + 카테고리바
export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  height: 100%;
`;

// 로고 이미지
export const Logo = styled.div`
  background-image: url(${DocBridge로고});
  background-size: contain; /* 이미지 비율을 유지 */
  background-repeat: no-repeat; /* 이미지 반복 X */
  background-position: center; /* 가운데 정렬 */
  width: 150px;
  height: 40px;
`;

// 카테고리바 (홈, 프로젝트, 문서, 설정)
export const Nav = styled.nav`
  display: flex;
  gap: 24px;
  height: 100%;
`;
export const NavItem = styled.span`
  font-size: 15px;
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};
  color: ${(props) => (props.$active ? "#2C35EB" : "#000000")};
  border-bottom: ${(props) => (props.$active ? "2px solid #2C35EB" : "2px solid transparent")};
  padding: 0 4px;
  height: 100%;
  box-sizing: border-box;
  cursor: pointer;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
`;

export const OutlineButton = styled.button`
  background-color: white;
  color: #4f46e5;
  border: 1px solid #4f46e5;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
`;

export const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #e0e7ff;
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
`;

export const Content = styled.main`
  max-width: 1000px;
  margin: 30px auto;
  padding: 0 20px;
`;

export const Banner = styled.div`
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  border-radius: 12px;
  padding: 30px 40px;
  margin-bottom: 40px;
`;

export const BannerText = styled.div`
  h2 {
    font-size: 22px;
    margin-bottom: 10px;
    color: #1e1b4b;
  }
  p {
    font-size: 14px;
    color: #4338ca;
    line-height: 1.5;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  h3 {
    font-size: 18px;
    color: #111;
  }
`;

export const MoreLink = styled.a`
  font-size: 13px;
  color: #888;
  text-decoration: none;
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
    background-color: #f9fafb;
    color: #6b7280;
    font-weight: 500;
  }

  td {
    border-top: 1px solid #f3f4f6;
    color: #374151;
  }

  .doc-name {
    font-weight: 600;
    text-decoration: underline;
    cursor: pointer;
  }
`;
