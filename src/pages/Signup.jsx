import React, { useState } from "react";
import { Mail, Lock, Globe, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signupApi } from "../api/auth";
import LanguageSelect from "../components/LanguageSelect";
import * as S from "./Signup.styles";
import globe from "../assets/image/globe.svg";
import robot from "../assets/image/robot.svg";
import people from "../assets/image/people.svg";
import manage from "../assets/image/manage.svg";

// 국가 옵션 리스트 (ISO-2 국가 코드)
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

const Signup = ({ onNavigateToLogin }) => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [country, setCountry] = useState("KR");
  const [language, setLanguage] = useState("ko");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  // 유효성 검사 함수들
  const isEnglishOnly = (text) => /^[A-Za-z]+$/.test(text);
  const validateEmail = (text) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
  const validatePassword = (text) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(text);

  // 이름 검증
  const handleFirstNameBlur = () => {
    if (firstName && !isEnglishOnly(firstName)) {
      setFirstNameError("영어 이름으로 작성해주세요.");
    } else {
      setFirstNameError("");
    }
  };

  const handleLastNameBlur = () => {
    if (lastName && !isEnglishOnly(lastName)) {
      setLastNameError("영어 이름으로 작성해주세요.");
    } else {
      setLastNameError("");
    }
  };

  // 이메일 검증
  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
    } else {
      setEmailError("");
    }
  };

  // 비밀번호 검증 (8~16자 영문, 숫자 조합)
  const handlePasswordBlur = () => {
    if (password && !validatePassword(password)) {
      setPasswordError("8~16자의 영문, 숫자 조합으로 입력해주세요.");
    } else {
      setPasswordError("");
    }
  };

  // 비밀번호 확인 검증
  const handleConfirmBlur = () => {
    if (passwordConfirm && password !== passwordConfirm) {
      setConfirmError("비밀번호가 일치하지 않습니다.");
    } else {
      setConfirmError("");
    }
  };

  // 회원가입 버튼 활성화 조건
  const isFormValid =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    passwordConfirm.trim() !== "" &&
    country !== "" &&
    language !== "" &&
    isEnglishOnly(firstName) &&
    isEnglishOnly(lastName) &&
    validateEmail(email) &&
    validatePassword(password) &&
    password === passwordConfirm;

  // 회원가입 제출 함수 (API 연동)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const response = await signupApi({
        firstName,
        lastName,
        email,
        password,
        country,
        language,
      });

      alert(
        response.data?.message ||
          response.message ||
          "회원가입이 완료되었습니다!",
      );

      // 성공 시 로그인 페이지로 이동
      if (onNavigateToLogin) {
        onNavigateToLogin();
      } else {
        navigate("/");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "회원가입 처리 중 오류가 발생했습니다.";
      alert(errorMessage);
    }
  };

  return (
    <S.Container>
      <S.MainWrapper>
        <S.LeftSection>
                  <S.MainTitle>
                    언어의 경계를 넘어
                    <br />
                    모두의 이해를 잇다
                    <br />
                    <span>하나의 협업으로</span>
                  </S.MainTitle>
                  <S.SubDescription>
                    하나의 문서만 작성하세요.
                    <br />
                    변경사항은 자동으로 동기화되고,
                    <br />
                    글로벌 팀은 언제나 같은 내용을 이해합니다.
                  </S.SubDescription>
        
                  <S.FeatureList>
                    <S.FeatureItem>
                      <S.FeatureIconBox>
                        <img src={globe} />
                      </S.FeatureIconBox>
                      <S.FeatureText>
                        <strong>글로벌 협업</strong>
                        <span>팀원의 언어에 맞춰 동일한 문서를 제공합니다.</span>
                      </S.FeatureText>
                    </S.FeatureItem>
                    <S.FeatureItem>
                      <S.FeatureIconBox>
                        <img src={robot} />
                      </S.FeatureIconBox>
                      <S.FeatureText>
                        <strong>AI 자동 동기화</strong>
                        <span>
                          수정된 내용만 번역하여 모든 언어 문서를 최신 상태로
                          유지합니다.
                        </span>
                      </S.FeatureText>
                    </S.FeatureItem>
                    <S.FeatureItem>
                      <S.FeatureIconBox>
                        <img src={people} />
                      </S.FeatureIconBox>
                      <S.FeatureText>
                        <strong>팀 협업</strong>
                        <span>모든 팀원이 자신의 언어로 같은 내용을 이해합니다.</span>
                      </S.FeatureText>
                    </S.FeatureItem>
                    <S.FeatureItem>
                      <S.FeatureIconBox>
                        <img src={manage} />
                      </S.FeatureIconBox>
                      <S.FeatureText>
                        <strong>버전 관리</strong>
                        <span>추가·수정된 내용을 한눈에 비교하고 관리합니다.</span>
                      </S.FeatureText>
                    </S.FeatureItem>
                  </S.FeatureList>
                  <S.MapGraphic />
                </S.LeftSection>

        <S.RightSection>
          <S.Card>
            <S.Logo />
            <S.CardTitle>계정을 생성하세요</S.CardTitle>
            <S.CardSubtitle>
              워크스페이스를 만들고 협업을 시작하세요.
            </S.CardSubtitle>

            <S.Form onSubmit={handleSubmit}>
              <S.InputGroup>
                <label>이름 (영어)</label>
                <S.RowGroup>
                  <div>
                    <S.InputWrapper>
                      <User size={18} />
                      <S.Input
                        type="text"
                        placeholder="이름을 입력해 주세요"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        onBlur={handleFirstNameBlur}
                        $hasError={!!firstNameError}
                        $hasIcon
                      />
                    </S.InputWrapper>
                    {firstNameError && (
                      <S.ErrorText>{firstNameError}</S.ErrorText>
                    )}
                  </div>
                  <div>
                    <S.InputWrapper>
                      <User size={18} />
                      <S.Input
                        type="text"
                        placeholder="성을 입력해 주세요"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        onBlur={handleLastNameBlur}
                        $hasError={!!lastNameError}
                        $hasIcon
                      />
                    </S.InputWrapper>
                    {lastNameError && (
                      <S.ErrorText>{lastNameError}</S.ErrorText>
                    )}
                  </div>
                </S.RowGroup>
              </S.InputGroup>

              <S.InputGroup>
                <label>이메일</label>
                <S.InputWrapper>
                  <Mail size={18} />
                  <S.Input
                    type="text"
                    placeholder="이메일을 입력하세요."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleEmailBlur}
                    $hasError={!!emailError}
                    $hasIcon
                  />
                </S.InputWrapper>
                {emailError && <S.ErrorText>{emailError}</S.ErrorText>}
              </S.InputGroup>

              <S.InputGroup>
                <label>비밀번호</label>
                <S.InputWrapper>
                  <Lock size={18} />
                  <S.Input
                    type="password"
                    placeholder="비밀번호를 입력해주세요."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={handlePasswordBlur}
                    $hasError={!!passwordError}
                    $hasIcon
                  />
                </S.InputWrapper>
                {passwordError && <S.ErrorText>{passwordError}</S.ErrorText>}
              </S.InputGroup>

              <S.InputGroup>
                <label>비밀번호 확인</label>
                <S.InputWrapper>
                  <Lock size={18} />
                  <S.Input
                    type="password"
                    placeholder="비밀번호를 다시 입력해주세요"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    onBlur={handleConfirmBlur}
                    $hasError={!!confirmError}
                    $hasIcon
                  />
                </S.InputWrapper>
                {confirmError && <S.ErrorText>{confirmError}</S.ErrorText>}
              </S.InputGroup>

              <S.RowGroup>
                <S.InputGroup>
                  <label>국적</label>
                  <S.InputWrapper>
                    <Globe size={18} />
                    <S.Select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      $hasIcon
                    >
                      {COUNTRY_OPTIONS.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label}
                        </option>
                      ))}
                    </S.Select>
                  </S.InputWrapper>
                </S.InputGroup>

                <S.InputGroup>
                  <label>사용 언어</label>
                  <LanguageSelect
                    value={language}
                    onChange={(val) => setLanguage(val)}
                    height="46px"
                  />
                </S.InputGroup>
              </S.RowGroup>

              <S.FooterLink>
                이미 계정이 있으신가요?
                <button type="button" onClick={() => navigate("/")}>
                  로그인
                </button>
              </S.FooterLink>

              <S.SubmitButton type="submit" disabled={!isFormValid}>
                회원가입
              </S.SubmitButton>
            </S.Form>
          </S.Card>
        </S.RightSection>
      </S.MainWrapper>
    </S.Container>
  );
};

export default Signup;
