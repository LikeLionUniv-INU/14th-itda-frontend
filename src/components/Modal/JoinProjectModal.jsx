import React, { useState, useRef, useEffect } from "react";
import BaseModal from "./BaseModal";
import { joinTeam } from "../../api/teamApi";
import * as S from "./JoinProjectModal.styles";

function JoinProjectModal({ isOpen, onClose, onSuccess }) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setCode(["", "", "", "", "", ""]);
      setErrorMessage("");
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 50);
    }
  }, [isOpen]);

  const handleInputChange = (e, index) => {
    const rawValue = e.target.value;
    const value = rawValue.toUpperCase().replace(/[^A-Z0-9]/g, "");

    const char = value.slice(-1);

    const newCode = [...code];
    newCode[index] = char;
    setCode(newCode);
    setErrorMessage("");

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
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
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6);

    if (pasteData.length > 0) {
      const newCode = [...code];
      pasteData.split("").forEach((char, idx) => {
        if (idx < 6) newCode[idx] = char;
      });
      setCode(newCode);
      setErrorMessage("");

      const nextFocusIdx = Math.min(pasteData.length, 5);
      inputRefs.current[nextFocusIdx]?.focus();
    }
  };

  const handleJoinSubmit = async (e) => {
    e?.preventDefault();
    const inviteCode = code.join("");
    if (inviteCode.length !== 6 || isLoading) return;

    try {
      setIsLoading(true);
      const res = await joinTeam({ inviteCode });
      const resultData = res?.data?.data || res?.data || res;

      handleCloseAll();
      if (onSuccess) {
        onSuccess(resultData);
      } else {
        const targetId =
          resultData?.teamId || resultData?.teamProjectId || resultData?.id;
        if (targetId) {
          window.location.href = `/project/${targetId}`;
        }
      }
    } catch (error) {
      console.error("팀 참여 실패:", error);
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "존재하지 않거나 만료된 초대 코드입니다.",
      );
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
        <S.Title>팀 프로젝트 참여</S.Title>
        <S.Description>팀 리더에게 받은 초대 코드를 입력하세요.</S.Description>

        <S.CodeInputGroup onPaste={handlePaste}>
          {code.map((char, index) => (
            <S.SingleInput
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="2"
              value={char}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={errorMessage ? "error" : ""}
            />
          ))}
        </S.CodeInputGroup>

        {errorMessage && <S.ErrorText>{errorMessage}</S.ErrorText>}

        <S.ButtonGroup>
          <S.CancelButton type="button" onClick={handleCloseAll}>
            취소
          </S.CancelButton>
          <S.SubmitButton
            type="button"
            onClick={handleJoinSubmit}
            disabled={!isAllEntered}
          >
            {isLoading ? "참여 중..." : "참여하기"}
          </S.SubmitButton>
        </S.ButtonGroup>
      </S.ContentWrapper>
    </BaseModal>
  );
}

export default JoinProjectModal;
