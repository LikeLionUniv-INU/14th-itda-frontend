import styled from "styled-components";
import { NavLink, Link } from "react-router-dom";
import DocBridge로고 from "../assets/image/DocBridge로고.png";

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

export const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
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

export const MenuItem = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: #000000;
  text-decoration: none; /* 링크 밑줄 제거 */
  padding: 0 4px;
  height: 100%;
  box-sizing: border-box;

  &.active {
    font-weight: bold;
    color: #2c35eb;
    border-bottom: 2px solid #2c35eb;
  }
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
  cursor: pointer;
`;
