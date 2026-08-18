import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { loginApi } from "../api/auth"; // 작성한 API 모듈 import
import * as S from "./Login.styles";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleEmailBlur = () => {
    if (!email.trim()) {
      setEmailError("이메일을 입력해주세요.");
    } else if (!validateEmail(email)) {
      setEmailError("올바른 이메일 형식이 아닙니다");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordBlur = () => {
    if (!password.trim()) {
      setPasswordError("비밀번호를 입력해주세요");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;

    if (!email.trim()) {
      setEmailError("이메일을 입력해주세요.");
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError("올바른 이메일 형식이 아닙니다");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("비밀번호를 입력해주세요");
      valid = false;
    }

    if (!valid) return;

    // 에러 상태 초기화
    setPasswordError("");
    setEmailError("");
    setIsLoading(true);

    try {
      // 1. 로그인 API 호출
      const response = await loginApi(email, password);

      if (response.success) {
        // 2. 토큰 저장
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        alert(response.message || "로그인 성공!");
        navigate("/"); // 메인 페이지 이동
      }
    } catch (error) {
      // 3. 백엔드 에러 응답 처리
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 401) {
        setPasswordError(message || "알맞은 비밀번호를 입력해주세요.");
      } else if (message) {
        alert(message);
      } else {
        alert("로그인 처리 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = email.trim() !== "" && password.trim() !== "";

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
              <S.FeatureIconBox />
              <S.FeatureText>
                <strong>글로벌 협업</strong>
                <span>팀원의 언어에 맞춰 동일한 문서를 제공합니다.</span>
              </S.FeatureText>
            </S.FeatureItem>
            <S.FeatureItem>
              <S.FeatureIconBox />
              <S.FeatureText>
                <strong>AI 자동 동기화</strong>
                <span>
                  수정된 내용만 번역하여 모든 언어 문서를 최신 상태로
                  유지합니다.
                </span>
              </S.FeatureText>
            </S.FeatureItem>
            <S.FeatureItem>
              <S.FeatureIconBox />
              <S.FeatureText>
                <strong>팀 협업</strong>
                <span>모든 팀원이 자신의 언어로 같은 내용을 이해합니다.</span>
              </S.FeatureText>
            </S.FeatureItem>
            <S.FeatureItem>
              <S.FeatureIconBox />
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
            <S.CardTitle>환영합니다</S.CardTitle>
            <S.CardSubtitle>
              계정에 로그인하여 워크스페이스를 계속 이용하세요.
            </S.CardSubtitle>

            <S.Form onSubmit={handleSubmit}>
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
                    hasError={!!emailError}
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
                    placeholder="비밀번호를 입력하세요."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={handlePasswordBlur}
                    hasError={!!passwordError}
                  />
                </S.InputWrapper>
                {passwordError && <S.ErrorText>{passwordError}</S.ErrorText>}
              </S.InputGroup>

              <S.FooterLink>
                계정이 없으신가요?{" "}
                <button type="button" onClick={() => navigate("/signup")}>
                  회원가입
                </button>
              </S.FooterLink>

              <S.SubmitButton type="submit" disabled={!isFormValid || isLoading}>
                {isLoading ? "로그인 중..." : "로그인"}
              </S.SubmitButton>
            </S.Form>
          </S.Card>
        </S.RightSection>
      </S.MainWrapper>
    </S.Container>
  );
};

export default Login;