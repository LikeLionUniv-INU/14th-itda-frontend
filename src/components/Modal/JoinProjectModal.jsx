import React, { useState, useRef, useEffect } from "react";
import BaseModal from "./BaseModal";
import { joinTeam } from "../../services/teamApi";
import * as S from "./JoinProjectModal.styles";

function JoinProjectModal({ isOpen, onClose, onSuccess }) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOpen]);

  const handleInputChange = (e, index) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!value) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setErrorMessage("");

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
      setErrorMessage("");
      inputRefs.current[5].focus();
    }
  };

  // 5. 팀 참여 API 연동 (POST /api/teams/join)
  const handleJoinSubmit = async () => {
    const inviteCode = code.join("");
    if (inviteCode.length !== 6 || isLoading) return;

    try {
      setIsLoading(true);
      const res = await joinTeam({ inviteCode });

      // 참여 성공 시 처리 (팀 상세로 이동 또는 콜백 호출)
      handleCloseAll();
      if (onSuccess) {
        onSuccess(res.data);
      } else if (res.data?.teamProjectId) {
        window.location.href = `/teams/${res.data.teamProjectId}`;
      }
    } catch (error) {
      // 404, 409 등 백엔드 에러 메시지 바인딩
      setErrorMessage(error.message || "존재하지 않는 초대 코드입니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAll = () => {
    setCode(["", "", "", "", "", ""]);
    setErrorMessage("");
    onClose?.();
  };

  const isAllEntered = code.every((char) => char !== "") && !isLoading;

  return (
    <BaseModal isOpen={isOpen} onClose={handleCloseAll} width="480px">
      <S.ContentWrapper>
        <S.CloseButton onClick={handleCloseAll}>✕</S.CloseButton>
        <S.Title>팀 프로젝트 참여</S.Title>
        <S.Description>팀 리더에게 받은 초대 코드를 입력하세요.</S.Description>

        <S.CodeInputGroup onPaste={handlePaste}>
          {code.map((char, index) => (
            <S.SingleInput
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={char}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={errorMessage ? "error" : ""}
            />
          ))}
        </S.CodeInputGroup>

        {errorMessage && <S.ErrorText>{errorMessage}</S.ErrorText>}

        <S.ButtonGroup>
          <S.CancelButton onClick={handleCloseAll}>취소</S.CancelButton>
          <S.SubmitButton onClick={handleJoinSubmit} disabled={!isAllEntered}>
            {isLoading ? "참여 중..." : "참여하기"}
          </S.SubmitButton>
        </S.ButtonGroup>
      </S.ContentWrapper>
    </BaseModal>
  );
}

export default JoinProjectModal;
