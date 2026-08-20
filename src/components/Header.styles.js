import styled from "styled-components";
import { NavLink } from "react-router-dom";
import DocBridge로고 from "../assets/image/DocBridge로고.svg";

// 1. 헤더 전체 배경 바 (화면 전체 너비로 흰색 배경 유지)
export const Header = styled.header`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
`;

// 2. 내부 콘텐츠 영역 (본문과 동일한 max-width를 주어 양 끝 정렬)
export const HeaderInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
  box-sizing: border-box;
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
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 150px;
  height: 40px;
`;

// 카테고리바 (홈, 프로젝트, 문서, 설정)
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

// 오른쪽 영역
export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
`;

// 메인: 프로젝트 생성 버튼
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

// 메인: 프로젝트 입장 버튼
export const ProjectEnterButton = styled.button`
  background: #ffffff;
  color: #4548f6;
  border: 1px solid #4548f6;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
`;

// 팀프로젝트: 문서 생성 버튼
export const DocCreateButton = styled.button`
  background: #ffffff;
  color: #4548f6;
  border: 1px solid #4548f6;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
`;

// 팀프로젝트: 나가기 버튼
export const ExitButton = styled.button`
  background: #4548f6;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
`;

// 프로필
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