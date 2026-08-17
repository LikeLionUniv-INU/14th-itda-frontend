import React from "react";
import { Bell, Plus } from "lucide-react";
import * as S from "./Header.styles";

export default function Header({ showNav = true, onCreateProject }) {
  return (
    <S.Header>
      <S.HeaderLeft>
        <S.Logo />
        {showNav && (
          <S.Nav>
            <S.MenuItem to="/home">홈</S.MenuItem>
            <S.MenuItem to="/project">프로젝트</S.MenuItem>
            <S.MenuItem to="/doc">문서</S.MenuItem>
            <S.MenuItem to="/setting">설정</S.MenuItem>
          </S.Nav>
        )}
      </S.HeaderLeft>

      <S.HeaderRight>
        <S.ProjectCreateButton onClick={onCreateProject}>
          프로젝트 생성 <Plus size={16} />
        </S.ProjectCreateButton>
        <S.ProjectEnterButton>프로젝트 입장</S.ProjectEnterButton>
        <S.Avatar>0</S.Avatar>
      </S.HeaderRight>
    </S.Header>
  );
}
