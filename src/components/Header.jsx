import React from "react";
import { Bell, Plus } from "lucide-react";
import * as S from "./Header.styles";

export default function Header({ showNav = true, onCreateProject }) {
  return (
    <S.Header>
      <S.HeaderLeft>
        <S.LogoLink>
          <S.Logo />
        </S.LogoLink>
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
        <S.PrimaryButton onClick={onCreateProject}>
          프로젝트 생성 <Plus size={16} />
        </S.PrimaryButton>
        <S.OutlineButton>프로젝트 입장</S.OutlineButton>
        <S.IconButton>
          <Bell size={20} />
        </S.IconButton>
        <S.Avatar>S</S.Avatar>
      </S.HeaderRight>
    </S.Header>
  );
}
