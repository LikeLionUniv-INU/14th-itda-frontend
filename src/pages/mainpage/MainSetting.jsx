import React, { useState } from "react";
import {
  Home,
  Folder,
  FileText,
  Settings,
  Camera,
  Lock,
  Mail,
  Trash2,
  ChevronRight,
} from "lucide-react";
import Header from "../../components/Header";
import * as S from "./MainSetting.styles";

// 더미 데이터
const DUMMY_USER_DATA = {
  name: "김서연",
  email: "sedd@gmail.com",
  country: "대한민국",
  language: "한국어",
  bio: "언어의 경계를 넘어 더 나은 협업을 만듭니다.",
  profileInitial: "S",
};

export default function MainSetting({
  userData = DUMMY_USER_DATA,
  onNavigate,
  onCreateProject,
  onJoinProject,
}) {
  // 백엔드 연동 전 폼 상태 관리
  const [formData, setFormData] = useState(userData);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <S.PageWrapper>
      <Header
        activeTab="setting"
        showNav={true}
        userName={formData.name}
        onNavigate={onNavigate}
        onCreateProject={onCreateProject}
        onJoinProject={onJoinProject}
      />

      <S.Container>
        {/* 왼쪽 사이드바 카테고리 */}
        <S.Sidebar>
          <S.SidebarTitle>설정</S.SidebarTitle>
          <S.NavList>
            <S.NavItem onClick={() => onNavigate && onNavigate("home")}>
              <Home size={18} color="#828282" />
              <span>홈</span>
            </S.NavItem>
            <S.NavItem onClick={() => onNavigate && onNavigate("project")}>
              <Folder size={18} color="#828282" />
              <span>프로젝트</span>
            </S.NavItem>
            <S.NavItem onClick={() => onNavigate && onNavigate("doc")}>
              <FileText size={18} color="#828282" />
              <span>문서</span>
            </S.NavItem>
            <S.NavItem $active={true}>
              <Settings size={18} color="#3138E7" />
              <span>설정</span>
            </S.NavItem>
          </S.NavList>
        </S.Sidebar>

        {/* 오른쪽 메인 콘텐츠 카드 */}
        <S.MainContent>
          {/* 내 정보 영역 */}
          <S.SectionCard>
            <S.SectionTitle>내 정보</S.SectionTitle>

            <S.ProfileFlex>
              {/* 프로필 이미지 박스 */}
              <S.AvatarCard>
                <S.AvatarCircle>
                  {formData.profileInitial || "S"}
                </S.AvatarCircle>
                <S.ChangePhotoButton>
                  <Camera size={14} color="#4253E2" />
                  <span>사진 변경</span>
                </S.ChangePhotoButton>
              </S.AvatarCard>

              {/* 폼 입력 레이아웃 */}
              <S.FormGrid>
                <S.Row>
                  <S.InputGroup>
                    <label>이름</label>
                    <S.Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  </S.InputGroup>
                  <S.InputGroup>
                    <label>이메일</label>
                    <S.Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </S.InputGroup>
                </S.Row>

                <S.Row>
                  <S.InputGroup>
                    <label>국적</label>
                    <S.Select
                      value={formData.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                    >
                      <option value="대한민국">대한민국</option>
                      <option value="미국">미국</option>
                      <option value="일본">일본</option>
                    </S.Select>
                  </S.InputGroup>
                  <S.InputGroup>
                    <label>사용 언어</label>
                    <S.Select
                      value={formData.language}
                      onChange={(e) => handleChange("language", e.target.value)}
                    >
                      <option value="한국어">한국어</option>
                      <option value="영어">English</option>
                      <option value="일본어">日本語</option>
                    </S.Select>
                  </S.InputGroup>
                </S.Row>

                <S.InputGroup>
                  <label>소개</label>
                  <S.Textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                  />
                </S.InputGroup>
              </S.FormGrid>
            </S.ProfileFlex>
          </S.SectionCard>

          {/* 계정 관리 영역 */}
          <S.SectionCard>
            <S.SectionTitle>계정 관리</S.SectionTitle>

            <S.AccountBox>
              <S.AccountRow>
                <S.AccountLeft>
                  <Lock size={18} color="#828282" />
                  <S.AccountText>
                    <span className="title">비밀번호 변경</span>
                    <span className="desc">
                      계정의 비밀번호를 변경할 수 있습니다.
                    </span>
                  </S.AccountText>
                </S.AccountLeft>
                <ChevronRight size={18} color="#B6B6B6" />
              </S.AccountRow>

              <S.AccountRow>
                <S.AccountLeft>
                  <Mail size={18} color="#828282" />
                  <S.AccountText>
                    <span className="title">이메일 변경</span>
                    <span className="desc">
                      계정에 등록된 이메일을 변경할 수 있습니다.
                    </span>
                  </S.AccountText>
                </S.AccountLeft>
                <ChevronRight size={18} color="#B6B6B6" />
              </S.AccountRow>

              <S.AccountRow $isDanger={true}>
                <S.AccountLeft>
                  <Trash2 size={18} color="#F52727" />
                  <S.AccountText $isDanger={true}>
                    <span className="title">계정 삭제</span>
                    <span className="desc">
                      계정을 삭제하고 모든 데이터를 영구적으로 삭제합니다.
                    </span>
                  </S.AccountText>
                </S.AccountLeft>
                <ChevronRight size={18} color="#B6B6B6" />
              </S.AccountRow>
            </S.AccountBox>
          </S.SectionCard>
        </S.MainContent>
      </S.Container>
    </S.PageWrapper>
  );
}
