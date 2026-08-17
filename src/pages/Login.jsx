import React, { useState } from "react";
import { Mail, Lock, BookOpen } from "lucide-react";
import * as S from "./Login.styles";

const Login = ({ onNavigateToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // 메일 형식 검증
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

  const handleSubmit = (e) => {
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

    // 비밀번호 오답 로직 처리
    const isPasswordCorrect = true;
    if (!isPasswordCorrect) {
      setPasswordError("알맞은 비밀번호를 입력해주세요.");
      return;
    }

    alert("로그인 성공!");
  };

  // 이메일과 비밀번호 모두 입력되었을 때
  const isFormValid = email.trim() !== "" && password.trim() !== "";

  return (
    <S.Container>
      {/* 좌측 브랜드 안내 영역 */}
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
                수정된 내용만 번역하여 모든 언어 문서를 최신 상태로 유지합니다.
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

      {/* 우측 로그인 폼 카드 */}
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
              <button type="button" onClick={onNavigateToSignup}>
                회원가입
              </button>
            </S.FooterLink>

            <S.SubmitButton type="submit" disabled={!isFormValid}>
              로그인
            </S.SubmitButton>
          </S.Form>
        </S.Card>
      </S.RightSection>
    </S.Container>
  );
};

export default Login;
