import styled from "styled-components";
import DocBridge로고 from "../assets/image/DocBridge로고.png";

export const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 80px;
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #eee;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  height: 100%;
`;

export const Logo = styled.div`
  background-image: url(${DocBridge로고});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 150px;
  height: 40px;
  cursor: pointer;
`;

export const Nav = styled.nav`
  display: flex;
  gap: 24px;
  height: 100%;
`;

export const NavItem = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
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
  gap: 6px;
  background: #2c35eb;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
`;

export const OutlineButton = styled.button`
  background: #fff;
  color: #2c35eb;
  border: 1px solid #2c35eb;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #666;
`;

export const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e0e7ff;
  color: #2c35eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

export const Content = styled.main`
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const SectionHeader = styled.div`
  h3 {
    font-size: 18px;
    font-weight: bold;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;

  th,
  td {
    padding: 14px 20px;
    text-align: left;
    font-size: 14px;
  }
  th {
    background: #f8f9fa;
    color: #666;
    font-weight: 500;
  }
  td {
    border-top: 1px solid #f0f0f0;
  }
  .doc-name {
    font-weight: bold;
  }
`;

export const EmptyContainer = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  h4 {
    font-size: 16px;
    font-weight: bold;
    margin-top: 16px;
    margin-bottom: 6px;
  }

  p {
    font-size: 13px;
    color: #888;
    margin-bottom: 20px;
  }
`;

export const ActionButton = styled.button`
  background: #2c35eb;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
`;
