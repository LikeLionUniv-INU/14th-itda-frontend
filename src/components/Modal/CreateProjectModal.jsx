// src/components/Modal/CreateProjectModal.jsx
import { useState } from "react";
import styled from "styled-components";

function CreateProjectModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: 생성 폼, 2: 초대코드 노출
  const [projectName, setProjectName] = useState("");
  const [language, setLanguage] = useState("한국어");
  const [showError, setShowError] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  if (!isOpen) return null;

  // 프로젝트 생성 버튼 클릭 핸들러
  const handleCreateProject = () => {
    if (!projectName.trim()) {
      setShowError(true);
      return;
    }

    // [백엔드 연동 전 임시 로직] 6자리 영문 대문자/숫자 조합 생성
    const mockCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setInviteCode(mockCode);

    // 2단계(초대코드 노출)로 이동
    setStep(2);
  };

  // 클립보드 복사 기능
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      alert("초대 코드가 클립보드에 복사되었습니다!");
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  // 모달 닫기 및 상태 초기화
  const handleCloseAll = () => {
    setStep(1);
    setProjectName("");
    setLanguage("한국어");
    setShowError(false);
    setInviteCode("");
    onClose();
  };

  return (
    <Overlay onClick={handleCloseAll}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleCloseAll}>✕</CloseButton>

        {/* --- STEP 1: 새 프로젝트 생성 --- */}
        {step === 1 && (
          <div>
            <Title>새 프로젝트 생성</Title>

            <FormGroup>
              <Label>프로젝트 이름</Label>
              <Input
                type="text"
                placeholder="프로젝트 이름을 입력하세요."
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                  if (e.target.value.trim()) setShowError(false);
                }}
              />
              {showError && (
                <ErrorText>프로젝트 이름을 입력해주세요.</ErrorText>
              )}
            </FormGroup>

            <FormGroup>
              <Label>기본언어</Label>
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="한국어">한국어</option>
                <option value="English">English</option>
                <option value="日本語">日本語</option>
              </Select>
            </FormGroup>

            <ButtonGroup>
              <CancelButton onClick={handleCloseAll}>취소</CancelButton>
              <SubmitButton
                onClick={handleCreateProject}
                disabled={!projectName.trim()}
              >
                프로젝트 생성
              </SubmitButton>
            </ButtonGroup>
          </div>
        )}

        {/* --- STEP 2: 초대 코드 노출 --- */}
        {step === 2 && (
          <div>
            <Title style={{ textAlign: "center" }}>팀 초대 코드</Title>
            <SubDescription>
              팀원들에게 아래 코드를 공유하여 프로젝트에 초대하세요.
            </SubDescription>

            <InviteCodeBox>{inviteCode}</InviteCodeBox>

            <ExpireInfo>ⓘ 이 코드는 7일 후 만료됩니다.</ExpireInfo>

            <ButtonGroup>
              <CancelButton onClick={handleCloseAll}>닫기</CancelButton>
              <SubmitButton onClick={handleCopyCode}>복사하기</SubmitButton>
            </ButtonGroup>
          </div>
        )}
      </ModalContainer>
    </Overlay>
  );
}

export default CreateProjectModal;

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
  background-color: #fdf5f5; /* 와이어프레임 연분홍 톤 */
  border-radius: 16px;
  padding: 32px 24px 24px 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #333;
`;

const Title = styled.h2`
  margin: 0 0 20px 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: #111;
`;

const SubDescription = styled.p`
  font-size: 0.85rem;
  color: #666;
  text-align: center;
  margin: 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  background-color: #fff;

  &:focus {
    border-color: #4f22e2;
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
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
  gap: 8px;
  margin-top: 24px;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 10px;
  border: 1px solid #4f22e2;
  background-color: transparent;
  color: #4f22e2;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  flex: 1;
  padding: 10px;
  border: none;
  background-color: #4f22e2;
  color: #fff;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const InviteCodeBox = styled.div`
  background-color: #efe8f4;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  font-size: 1.8rem;
  font-weight: bold;
  letter-spacing: 6px;
  color: #111;
  margin: 16px 0;
`;

const ExpireInfo = styled.p`
  font-size: 0.8rem;
  color: #555;
  text-align: center;
  margin-bottom: 20px;
`;
