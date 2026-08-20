import styled from "styled-components";
import { NavLink } from "react-router-dom";
import DocBridge from "../assets/image/DocBridge.svg";

export const Header = styled.header`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
`;

export const HeaderInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
  box-sizing: border-box;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  height: 100%;
`;

export const Logo = styled.div`
  background-image: url(${DocBridge});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 150px;
  height: 40px;
`;

export const Nav = styled.nav`
  display: flex;
  gap: 12px;
  height: 100%;
`;

export const MenuItem = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: #000000;
  text-decoration: none;
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
  gap: 28px;
`;

export const ProjectCreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #4548f6;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
`;

export const ProjectEnterButton = styled.button`
  background: #ffffff;
  color: #4548f6;
  border: 1px solid #4548f6;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
`;

export const DocCreateButton = styled.button`
  background: #ffffff;
  color: #4548f6;
  border: 1px solid #4548f6;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
`;

export const ExitButton = styled.button`
  background: #4548f6;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
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

export const LogoutButton = styled.button`
  background: #dcdcdc;
  color: #ffffff;
  border: 1px solid #dcdcdc;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
`;
