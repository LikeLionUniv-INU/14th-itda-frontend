import React, { useState } from "react";
import BaseModal from "./BaseModal";
import LanguageSelect from "../LanguageSelect";
import { createTeam } from "../../api/teamApi";
import * as S from "./CreateProjectModal.styles";

function CreateProjectModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1: 생성 폼, 2: 초대코드 노출
  const [projectName, setProjectName] = useState("");
  const [language, setLanguage] = useState("ko"); // 기본값 한국어 코드
  const [showError, setShowError] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [createdTeamData, setCreatedTeamData] = useState(null);

  if (!isOpen) return null;

  // 프로젝트 생성 버튼 클릭 핸들러 (실제 API 연동)
  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      setShowError(true);
      return;
    }

    try {
      setIsLoading(true);
      // 백엔드 프로젝트(팀) 생성 API 호출
      const response = await createTeam({
        name: projectName.trim(),
        defaultLanguage: language,
      });

      const resData = response?.data?.data || response?.data || response;
      const code =
        resData?.inviteCode ||
        resData?.code ||
        Math.random().toString(36).substring(2, 8).toUpperCase();

      setCreatedTeamData(resData);
      setInviteCode(code);
      setStep(2); // 2단계 초대코드 화면으로 이동
    } catch (error) {
      console.error("프로젝트 생성 실패:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "프로젝트 생성 중 오류가 발생했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
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
    if (createdTeamData && onSuccess) {
      onSuccess(createdTeamData);
    }
    setStep(1);
    setProjectName("");
    setLanguage("ko");
    setShowError(false);
    setInviteCode("");
    setCreatedTeamData(null);
    onClose?.();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleCloseAll} width="400px">
      <S.ContentWrapper>
        {/* --- STEP 1: 새 프로젝트 생성 --- */}
        {step === 1 && (
          <div>
            <S.Title>새 프로젝트 생성</S.Title>

            <S.FormGroup>
              <S.Label>프로젝트 이름</S.Label>
              <S.Input
                type="text"
                placeholder="프로젝트 이름을 입력하세요."
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                  if (e.target.value.trim()) setShowError(false);
                }}
              />
              {showError && (
                <S.ErrorText>프로젝트 이름을 입력해주세요.</S.ErrorText>
              )}
            </S.FormGroup>

            <S.FormGroup>
              <S.Label>기본언어</S.Label>
              <LanguageSelect
                value={language}
                onChange={(val) => setLanguage(val)}
                height="42px"
              />
            </S.FormGroup>

            <S.ButtonGroup>
              <S.CancelButton type="button" onClick={handleCloseAll}>
                취소
              </S.CancelButton>
              <S.SubmitButton
                type="button"
                onClick={handleCreateProject}
                disabled={!projectName.trim() || isLoading}
              >
                {isLoading ? "생성 중..." : "프로젝트 생성"}
              </S.SubmitButton>
            </S.ButtonGroup>
          </div>
        )}

        {/* --- STEP 2: 초대 코드 노출 --- */}
        {step === 2 && (
          <div>
            <S.Title style={{ textAlign: "center" }}>팀 초대 코드</S.Title>
            <S.SubDescription>
              팀원들에게 아래 코드를 공유하여 프로젝트에 초대하세요.
            </S.SubDescription>

            <S.InviteCodeBox>{inviteCode}</S.InviteCodeBox>

            <S.ExpireInfo>ⓘ 이 코드는 7일 후 만료됩니다.</S.ExpireInfo>

            <S.ButtonGroup>
              <S.CancelButton type="button" onClick={handleCloseAll}>
                닫기
              </S.CancelButton>
              <S.SubmitButton type="button" onClick={handleCopyCode}>
                복사하기
              </S.SubmitButton>
            </S.ButtonGroup>
          </div>
        )}
      </S.ContentWrapper>
    </BaseModal>
  );
}

export default CreateProjectModal;
