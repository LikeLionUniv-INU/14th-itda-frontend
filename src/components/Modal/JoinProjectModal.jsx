// src/components/Modal/JoinProjectModal.jsx
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

function JoinProjectModal({ isOpen, onClose }) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [showError, setShowError] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e, index) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!value) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setShowError(false);

    if (index < 5 && value) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!code[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      } else {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");

    if (pasteData.length === 6) {
      const newCode = pasteData.split("");
      setCode(newCode);
      setShowError(false);
      inputRefs.current[5].focus();
    }
  };

  const handleJoinSubmit = () => {
    const fullCode = code.join("");

    if (fullCode.length !== 6 || fullCode !== "AB7K9P") {
      setShowError(true);
    } else {
      alert("프로젝트 참여에 성공했습니다!");
      handleCloseAll();
    }
  };

  const handleCloseAll = () => {
    setCode(["", "", "", "", "", ""]);
    setShowError(false);
    onClose();
  };

  const isAllEntered = code.every((char) => char !== "");

  return (
    <Overlay onClick={handleCloseAll}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleCloseAll}>✕</CloseButton>
        <Title>팀 프로젝트 참여</Title>
        <Description>팀 리더에게 받은 초대 코드를 입력하세요.</Description>

        <CodeInputGroup onPaste={handlePaste}>
          {code.map((char, index) => (
            <SingleInput
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={char}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={showError ? "error" : ""}
            />
          ))}
        </CodeInputGroup>

        {showError && <ErrorText>존재하지 않는 코드입니다.</ErrorText>}

        <ButtonGroup>
          <CancelButton onClick={handleCloseAll}>취소</CancelButton>
          <SubmitButton onClick={handleJoinSubmit} disabled={!isAllEntered}>
            참여하기
          </SubmitButton>
        </ButtonGroup>
      </ModalContainer>
    </Overlay>
  );
}

export default JoinProjectModal;

// ==============================
// styled-components 정의 (수정 부분)
// ==============================
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
  max-width: 480px; /* 64px x 6개 + 간격에 맞춘 모달 너비 */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  text-align: left; /* 👈 전체 왼쪽 정렬 */
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #0a0a0a; /* 👈 #0A0A0A 적용 */
`;

const Title = styled.h2`
  margin: 0 0 12px 0;
  font-size: 1.25rem;
  font-weight: bold;
  color: #0a0a0a; /* 👈 #0A0A0A 적용 */
  text-align: left;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #0a0a0a; /* 👈 #0A0A0A 적용 */
  margin: 0 0 28px 0;
  text-align: left;
`;

const CodeInputGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
`;

const SingleInput = styled.input`
  width: 64px; /* 👈 64px 지정 */
  height: 64px; /* 👈 64px 지정 */
  border: 1px solid #dcdcdc;
  border-radius: 12px;
  background-color: #f7f1f1; /* 이미지 스펙 기반 미세하게 연한 배경 */
  font-size: 1.8rem;
  font-weight: bold;
  color: #0a0a0a; /* 👈 #0A0A0A 적용 */
  text-align: center;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #2703f1; /* 👈 보라색 #2703F1 적용 */
    border-width: 2px;
    background-color: #fff;
  }

  &.error {
    border-color: #e53e3e;
  }
`;

const ErrorText = styled.p`
  color: #e53e3e;
  font-size: 0.8rem;
  text-align: center;
  margin: 8px 0 0 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 32px;
`;

const CancelButton = styled.button`
  flex: 1;
  height: 48px;
  border: 1px solid #2703f1; /* 👈 보라색 #2703F1 적용 */
  background-color: transparent;
  color: #2703f1; /* 👈 보라색 #2703F1 적용 */
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  flex: 1;
  height: 48px;
  border: none;
  background-color: #2703f1; /* 👈 보라색 #2703F1 적용 */
  color: #fff;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;

  &:disabled {
    background-color: #a393f9; /* 비활성화 시 연한 보라 느낌 */
    cursor: not-allowed;
  }
`;
