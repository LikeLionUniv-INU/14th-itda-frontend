// src/components/Modal/CreateDocumentModal.jsx
import React, { useState } from "react";
import styled from "styled-components";
import DocIcon from "../../assets/image/DocIcon.svg";

function CreateDocumentModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [docName, setDocName] = useState("");
  const [language, setLanguage] = useState("한국어");
  const [version, setVersion] = useState("1");
  const [versionError, setVersionError] = useState("");

  if (!isOpen) return null;

  // 1단계: 문서 유형 선택 핸들러
  const handleSelectType = (typeName) => {
    setSelectedType(typeName);
    setStep(2);
  };

  // 2단계: 버전 입력 검증 핸들러 (숫자만 허용)
  const handleVersionChange = (e) => {
    const val = e.target.value;
    setVersion(val);

    if (!val.trim()) {
      setVersionError("");
      return;
    }

    // 숫자가 아닌 값이 들어왔을 때
    if (!/^\d+$/.test(val)) {
      setVersionError("숫자로 입력해주세요.");
    } else {
      setVersionError("");
    }
  };

  // 2단계: 생성 버튼 클릭 핸들러
  const handleCreateSubmit = () => {
    if (!docName.trim() || versionError || !version.trim()) return;
    setStep(3);
  };

  // 모달 전체 초기화 후 닫기
  const handleCloseAll = () => {
    setStep(1);
    setSelectedType("");
    setDocName("");
    setLanguage("한국어");
    setVersion("1");
    setVersionError("");
    onClose();
  };

  // 생성 버튼 활성화 조건: 문서 이름 존재 + 버전 오류 없음 + 버전 값 존재
  const isFormValid =
    docName.trim().length > 0 && version.trim().length > 0 && !versionError;

  return (
    <Overlay onClick={handleCloseAll}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleCloseAll}>✕</CloseButton>

        {/* ================= STEP 1: 문서 유형 선택 ================= */}
        {step === 1 && (
          <div>
            <Title>문서 유형 선택</Title>
            <SubTitle>생성할 문서의 유형을 선택하세요.</SubTitle>

            <OptionList>
              {/* 활성화 카드: 스토리보드 */}
              <OptionCard active onClick={() => handleSelectType("스토리보드")}>
                <CardIconBox />
                <CardContent>
                  <CardTitle active>스토리보드</CardTitle>
                  <CardDesc>
                    서비스의 화면 흐름과 인터렉션을 시각적으로 설계합니다.
                  </CardDesc>
                </CardContent>
                <ArrowIcon>❯</ArrowIcon>
              </OptionCard>

              {/* 활성화 카드: 기능 명세서 */}
              <OptionCard
                active
                onClick={() => handleSelectType("기능 명세서")}
              >
                <CardIconBox />
                <CardContent>
                  <CardTitle active>기능 명세서</CardTitle>
                  <CardDesc>서비스의 기능과 요구사항을 정리합니다.</CardDesc>
                </CardContent>
                <ArrowIcon>❯</ArrowIcon>
              </OptionCard>

              {/* 비활성화 카드 1 */}
              <OptionCard>
                <CardIconBox />
                <CardContent>
                  <CardTitle>화면 설계서</CardTitle>
                  <CardDesc>화면 구성과 흐름을 설계합니다.</CardDesc>
                </CardContent>
                <DisabledBadge>추후 업데이트</DisabledBadge>
              </OptionCard>

              {/* 비활성화 카드 2 */}
              <OptionCard>
                <CardIconBox />
                <CardContent>
                  <CardTitle>API 명세서</CardTitle>
                  <CardDesc>API 명세 및 데이터 구조를 정의합니다.</CardDesc>
                </CardContent>
                <DisabledBadge>추후 업데이트</DisabledBadge>
              </OptionCard>

              {/* 비활성화 카드 3 */}
              <OptionCard>
                <CardIconBox />
                <CardContent>
                  <CardTitle>서비스 소개서</CardTitle>
                  <CardDesc>서비스에 대한 데이터 구조를 정의합니다.</CardDesc>
                </CardContent>
                <DisabledBadge>추후 업데이트</DisabledBadge>
              </OptionCard>
            </OptionList>
          </div>
        )}

        {/* ================= STEP 2: 기본 정보 입력 ================= */}
        {step === 2 && (
          <div>
            <Title>기본 정보 입력</Title>
            <SubTitle>문서의 기본 정보를 입력하세요.</SubTitle>

            <FormGroup>
              <Label>문서 이름</Label>
              <Input
                type="text"
                maxLength={10}
                placeholder="예) 회원 관리 기능 명세서"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>언어</Label>
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="한국어">한국어</option>
                <option value="English">English</option>
                <option value="日本語">日本語</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>버전</Label>
              <Input
                type="text"
                placeholder="숫자로 입력해주세요."
                value={version}
                onChange={handleVersionChange}
                className={versionError ? "error" : ""}
              />
              {versionError && <ErrorText>{versionError}</ErrorText>}
            </FormGroup>

            <ButtonGroup>
              <CancelButton onClick={handleCloseAll}>취소</CancelButton>
              <SubmitButton
                onClick={handleCreateSubmit}
                disabled={!isFormValid}
              >
                생성
              </SubmitButton>
            </ButtonGroup>
          </div>
        )}

        {/* ================= STEP 3: 문서 생성 완료 ================= */}
        {step === 3 && (
          <CenterContainer>
            <Title style={{ textAlign: "left", width: "100%" }}>
              문서 생성 완료
            </Title>

            {/* DocIcon.svg 이미지 출력 */}
            <IconWrapper>
              <img src={DocIcon} alt="문서 생성 완료" />
            </IconWrapper>

            <SuccessMessage>문서가 생성되었습니다!</SuccessMessage>

            <SummaryBox>
              <SummaryRow>
                <span className="key">문서 이름</span>
                <span className="value">{docName}</span>
              </SummaryRow>
              <SummaryRow>
                <span className="key">언어</span>
                <span className="value">{language}</span>
              </SummaryRow>
              <SummaryRow>
                <span className="key">버전</span>
                <span className="value">ver.{version}</span>
              </SummaryRow>
            </SummaryBox>

            {/* 완료 버튼 (높이 42px) */}
            <CompleteButton onClick={handleCloseAll}>완료</CompleteButton>
          </CenterContainer>
        )}
      </ModalContainer>
    </Overlay>
  );
}

export default CreateDocumentModal;

/* ==========================================================================
   styled-components 스타일 정의 (#0A0A0A, #2703F1, #F1F1FD 적용)
   ========================================================================== */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  position: relative;
  background-color: #fdf5f5;
  border-radius: 16px;
  padding: 32px 28px 28px 28px;
  width: 90%;
  max-width: 440px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  text-align: left;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #0a0a0a;
`;

const Title = styled.h2`
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  font-weight: bold;
  color: #0a0a0a;
`;

const SubTitle = styled.p`
  font-size: 0.85rem;
  color: #666;
  margin: 0 0 20px 0;
`;

/* 1단계 스타일 */
const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const OptionCard = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid ${(props) => (props.active ? "#2703f1" : "#e5e5e5")};
  background-color: ${(props) => (props.active ? "#f3f0ff" : "#ffffff")};
  border-radius: 12px;
  cursor: ${(props) => (props.active ? "pointer" : "default")};
  transition: all 0.2s ease;

  ${(props) =>
    props.active &&
    `
    &:hover {
      box-shadow: 0 4px 12px rgba(39, 3, 241, 0.15);
    }
  `}
`;

const CardIconBox = styled.div`
  width: 40px;
  height: 40px;
  background-color: #e0e0e0;
  border-radius: 6px;
  margin-right: 12px;
  flex-shrink: 0;
`;

const CardContent = styled.div`
  flex: 1;
`;

const CardTitle = styled.div`
  font-size: 0.95rem;
  font-weight: bold;
  color: ${(props) => (props.active ? "#2703f1" : "#0a0a0a")};
  margin-bottom: 2px;
`;

const CardDesc = styled.div`
  font-size: 0.75rem;
  color: #777;
`;

const ArrowIcon = styled.div`
  color: #2703f1;
  font-weight: bold;
  font-size: 1.1rem;
`;

const DisabledBadge = styled.span`
  font-size: 0.7rem;
  color: #888;
  background-color: #eee;
  padding: 4px 8px;
  border-radius: 4px;
`;

/* 2단계 스타일 */
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: bold;
  color: #0a0a0a;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #0a0a0a;
  outline: none;
  background-color: #fff;

  &:focus {
    border-color: #2703f1;
  }

  &.error {
    border-color: #e53e3e;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #0a0a0a;
  outline: none;
  background-color: #fff;
`;

const ErrorText = styled.span`
  color: #e53e3e;
  font-size: 0.75rem;
  margin-top: 2px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 28px;
`;

const CancelButton = styled.button`
  flex: 1;
  height: 48px;
  border: 1px solid #2703f1;
  background-color: transparent;
  color: #2703f1;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  flex: 1;
  height: 48px;
  border: none;
  background-color: #2703f1;
  color: #fff;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;

  &:disabled {
    background-color: #a393f9;
    cursor: not-allowed;
  }
`;

/* 3단계 스타일 */
const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconWrapper = styled.div`
  margin: 16px 0;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 90px;
    height: 90px;
    object-fit: contain;
  }
`;

const SuccessMessage = styled.h3`
  font-size: 1.15rem;
  font-weight: bold;
  color: #0a0a0a;
  margin: 0 0 20px 0;
`;

const SummaryBox = styled.div`
  width: 100%;
  background-color: #f1f1fd; /* 👈 회색 대신 #F1F1FD 적용 */
  border-radius: 12px;
  padding: 16px 20px;
  box-sizing: border-box;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.85rem;

  &:last-child {
    margin-bottom: 0;
  }

  .key {
    color: #666;
  }

  .value {
    color: #0a0a0a;
    font-weight: bold;
  }
`;

const CompleteButton = styled.button`
  width: 100%;
  height: 42px; /* 👈 완료 버튼 높이 42px 적용 */
  border: none;
  background-color: #2703f1;
  color: #fff;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;
