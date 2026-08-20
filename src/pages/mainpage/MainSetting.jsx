import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Lock, Mail, Trash2, ChevronRight } from "lucide-react";
import Header from "../../components/Header";
import LanguageSelect from "../../components/LanguageSelect";
import {
  getMyInfoApi,
  updateProfileApi,
  getPresignedUrlApi,
  updateProfileImageApi,
  changePasswordApi,
  changeEmailApi,
  deleteAccountApi,
} from "../../api/user";
import * as S from "./MainSetting.styles";

// 국가 옵션 리스트 (Signup.jsx와 동일)
const COUNTRY_OPTIONS = [
  { code: "KR", label: "대한민국" },
  { code: "US", label: "미국" },
  { code: "JP", label: "일본" },
  { code: "CN", label: "중국" },
  { code: "VN", label: "베트남" },
  { code: "ID", label: "인도네시아" },
  { code: "GB", label: "영국" },
  { code: "FR", label: "프랑스" },
  { code: "DE", label: "독일" },
  { code: "ES", label: "스페인" },
];

export default function MainSetting({
  onNavigate,
  onCreateProject,
  onJoinProject,
}) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    country: "KR",
    language: "ko",
    bio: "",
    initial: "",
    profileImageUrl: "",
  });

  // 내 정보 조회
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await getMyInfoApi();
      const userData = response.data?.data || response.data || response;

      if (userData) {
        const fullName =
          `${userData.lastName || ""}${userData.firstName || ""}`.trim() ||
          "사용자";
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          name: fullName,
          email: userData.email || "",
          country: userData.country || "KR",
          language: userData.language || "ko",
          bio: userData.bio || "",
          initial: userData.initial || userData.lastName?.charAt(0) || "U",
          profileImageUrl: userData.profileImageUrl || "",
        });
      }
    } catch (error) {
      console.error("내 정보를 불러오는 데 실패했습니다.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 10-1. 프로필 정보 수정
  const handleUpdateProfile = async () => {
    const nameRegex = /^[a-zA-Z]+$/;
    if (
      !nameRegex.test(formData.firstName) ||
      !nameRegex.test(formData.lastName)
    ) {
      alert("이름은 영문자만 입력 가능합니다.");
      return;
    }
    if (formData.bio && formData.bio.length > 500) {
      alert("자기소개는 500자 이내로 입력해주세요.");
      return;
    }

    try {
      await updateProfileApi({
        firstName: formData.firstName,
        lastName: formData.lastName,
        country: formData.country,
        language: formData.language,
        bio: formData.bio || null,
      });
      alert("프로필 정보가 수정되었습니다.");
      fetchUserData();
    } catch (error) {
      alert(error.response?.data?.message || "프로필 수정 실패");
    }
  };

  // 10-2. 프로필 이미지 변경 (S3 Presigned URL 방식)
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Step 1. Presigned URL 발급
      const res = await getPresignedUrlApi({
        fileName: file.name,
        contentType: file.type,
      });
      const { presignedUrl, fileUrl } = res.data?.data || res.data;

      // Step 2. S3에 직접 업로드
      await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      // Step 3. 이미지 URL 저장 API 호출
      await updateProfileImageApi({ profileImageUrl: fileUrl });
      alert("프로필 이미지가 변경되었습니다.");
      fetchUserData();
    } catch (error) {
      console.error(error);
      alert("이미지 업로드 실패");
    }
  };

  // 10-3. 비밀번호 변경
  const handleChangePassword = async () => {
    const currentPassword = prompt("현재 비밀번호를 입력해주세요.");
    if (!currentPassword) return;

    const newPassword = prompt(
      "새 비밀번호를 입력해주세요 (8~16자 영문+숫자).",
    );
    if (!newPassword) return;

    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    if (!passRegex.test(newPassword)) {
      alert("8~16자의 영문, 숫자 조합으로 입력해주세요.");
      return;
    }

    try {
      await changePasswordApi({ currentPassword, newPassword });
      alert("비밀번호가 정상적으로 변경되었습니다.");
    } catch (error) {
      alert(error.response?.data?.message || "비밀번호 변경 실패");
    }
  };

  // 10-4. 이메일 변경
  const handleChangeEmail = async () => {
    const password = prompt("비밀번호를 입력해주세요.");
    if (!password) return;

    const newEmail = prompt("새로운 이메일을 입력해주세요.");
    if (!newEmail) return;

    try {
      await changeEmailApi({ password, newEmail });
      alert("이메일이 변경되었습니다. 다시 로그인해 주세요.");
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "이메일 변경 실패");
    }
  };

  // 10-5. 회원 탈퇴
  const handleDeleteAccount = async () => {
    if (!window.confirm("정말로 탈퇴하시겠습니까? 데이터는 영구 삭제됩니다.")) {
      return;
    }

    const password = prompt("확인을 위해 비밀번호를 입력해주세요.");
    if (!password) return;

    try {
      await deleteAccountApi({ password });
      alert("회원 탈퇴가 완료되었습니다.");
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "회원 탈퇴 실패");
    }
  };

  if (loading) {
    return <S.PageWrapper>로딩 중...</S.PageWrapper>;
  }

  return (
    <S.PageWrapper>
      <Header
        activeTab="setting"
        showNav={true}
        userName={formData.name}
        userInitial={formData.initial}
        onNavigate={onNavigate}
        onCreateProject={onCreateProject}
        onJoinProject={onJoinProject}
      />

      <S.Container>
        <S.MainContent>
          {/* 내 정보 영역 */}
          <S.SectionCard>
            <S.SectionTitle>내 정보</S.SectionTitle>

            <S.ProfileFlex>
              {/* 프로필 이미지 박스 */}
              <S.AvatarCard>
                <S.AvatarCircle>
                  {formData.profileImageUrl ? (
                    <img
                      src={formData.profileImageUrl}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    formData.initial || "U"
                  )}
                </S.AvatarCircle>

                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleImageChange}
                />

                <S.ChangePhotoButton
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera size={14} color="#4253E2" />
                  <span>사진 변경</span>
                </S.ChangePhotoButton>
              </S.AvatarCard>

              {/* 폼 입력 레이아웃 */}
              <S.FormGrid>
                <S.Row>
                  <S.InputGroup>
                    <label>이름 (영문)</label>
                    <S.Input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleChange("firstName", e.target.value)
                      }
                    />
                  </S.InputGroup>
                  <S.InputGroup>
                    <label>성 (영문)</label>
                    <S.Input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                    />
                  </S.InputGroup>
                </S.Row>

                <S.Row>
                  <S.InputGroup>
                    <label>이메일</label>
                    <S.Input type="email" value={formData.email} disabled />
                  </S.InputGroup>
                </S.Row>

                <S.Row>
                  {/* 국적 드롭다운 (COUNTRY_OPTIONS 적용) */}
                  <S.InputGroup>
                    <label>국적</label>
                    <S.Select
                      value={formData.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                    >
                      {COUNTRY_OPTIONS.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label}
                        </option>
                      ))}
                    </S.Select>
                  </S.InputGroup>

                  {/* 사용 언어 드롭다운 (LanguageSelect 적용) */}
                  <S.InputGroup>
                    <label>사용 언어</label>
                    <LanguageSelect
                      value={formData.language}
                      onChange={(val) => handleChange("language", val)}
                      height="46px"
                    />
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

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "12px",
                  }}
                >
                  <button
                    type="button"
                    onClick={handleUpdateProfile}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#4253E2",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    프로필 저장
                  </button>
                </div>
              </S.FormGrid>
            </S.ProfileFlex>
          </S.SectionCard>

          {/* 계정 관리 영역 */}
          <S.SectionCard>
            <S.SectionTitle>계정 관리</S.SectionTitle>

            <S.AccountBox>
              <S.AccountRow
                onClick={handleChangePassword}
                style={{ cursor: "pointer" }}
              >
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

              <S.AccountRow
                onClick={handleChangeEmail}
                style={{ cursor: "pointer" }}
              >
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

              <S.AccountRow
                $isDanger={true}
                onClick={handleDeleteAccount}
                style={{ cursor: "pointer" }}
              >
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
