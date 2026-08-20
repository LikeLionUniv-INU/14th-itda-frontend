import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModal";
import LanguageSelect from "../LanguageSelect";
import * as S from "./SaveFlowModals.styles";

import BangImg from "../../assets/image/bang.svg";
import CheckImg from "../../assets/image/check.svg";
import GlobalImg from "../../assets/image/Global.svg";

import { getTeamDetail } from "../../api/teamApi";

export default function SaveFlowModals({
  isOpen,
  currentStep,
  teamId,
  docName = "스토리보드_Version1",
  onClose,
  onConfirmExit,
  onNextStep,
  onFinalSave,
}) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !teamId) return;

    const fetchMembers = async () => {
      try {
        setLoading(true);
        const res = await getTeamDetail(teamId);
        const resData = res?.data?.data || res?.data || {};

        const memberList =
          resData.members ||
          resData.teamMembers ||
          (Array.isArray(resData) ? resData : []);

        const formattedMembers = memberList.map((m, index) => {
          const fullName =
            m.name ||
            m.nickname ||
            m.username ||
            `${m.lastName || ""} ${m.firstName || ""}`.trim() ||
            `팀원 ${index + 1}`;

          const userLang =
            m.language ||
            m.targetLanguage ||
            m.defaultLanguage ||
            resData.defaultLanguage ||
            "ko";

          // 백엔드 명세서 규격: userId를 정확한 숫자로 보장
          const memberId = Number(m.userId || m.id || m.memberId || index + 1);

          return {
            id: memberId,
            userId: memberId,
            name: fullName,
            checked: true,
            language: userLang,
            targetLanguage: userLang,
          };
        });

        setMembers(formattedMembers);
      } catch (error) {
        console.error("팀 멤버 목록 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [isOpen, teamId]);

  const isAllChecked = members.length > 0 && members.every((m) => m.checked);

  const handleToggleAll = () => {
    const nextState = !isAllChecked;
    setMembers(members.map((m) => ({ ...m, checked: nextState })));
  };

  const handleToggleMember = (id) => {
    setMembers(
      members.map((m) => (m.id === id ? { ...m, checked: !m.checked } : m)),
    );
  };

  const handleChangeLanguage = (id, language) => {
    setMembers(
      members.map((m) =>
        m.id === id ? { ...m, language, targetLanguage: language } : m,
      ),
    );
  };

  const handleComplete = () => {
    // 체크된 멤버만 필터링하여 전달
    const checkedMembers = members.filter((m) => m.checked);
    onFinalSave(checkedMembers);
  };

  const modalWidth = currentStep === "language_select" ? "504px" : "424px";

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} width={modalWidth}>
      <S.ContentWrapper>
        {/* 1. 나가기 경고 모달 */}
        {currentStep === "exit" && (
          <S.ModalContent>
            <S.ModalIcon src={BangImg} alt="나가기 경고" />
            <S.ModalTitle>정말 나가시겠습니까?</S.ModalTitle>
            <S.ModalDesc>
              아직 저장되지 않은 사항에 대해서는{"\n"}삭제됩니다.
            </S.ModalDesc>
            <S.ButtonGroup>
              <S.CancelBtn onClick={onClose}>취소</S.CancelBtn>
              <S.ActionBtn onClick={onConfirmExit}>나가기</S.ActionBtn>
            </S.ButtonGroup>
          </S.ModalContent>
        )}

        {/* 2. 저장 확인 모달 */}
        {currentStep === "complete_confirm" && (
          <S.ModalContent>
            <S.ModalIcon src={CheckImg} alt="작성 완료 확인" />
            <S.ModalTitle>
              {docName}
              {"\n"}문서 작성을 완료할까요?
            </S.ModalTitle>
            <S.ModalDesc>
              저장된 내용은 언제든지 수정할 수 있습니다.
            </S.ModalDesc>
            <S.ButtonGroup>
              <S.CancelBtn onClick={onClose}>취소</S.CancelBtn>
              <S.ActionBtn onClick={() => onNextStep("translate_intro")}>
                작성완료
              </S.ActionBtn>
            </S.ButtonGroup>
          </S.ModalContent>
        )}

        {/* 3. 번역 안내 모달 */}
        {currentStep === "translate_intro" && (
          <S.ModalContent>
            <S.ModalIcon src={GlobalImg} alt="번역 안내" />
            <S.ModalTitle>
              우리 팀원들의 국적에 맞추어{"\n"}자동으로 번역된 버전으로 번역을
              해드릴게요!
            </S.ModalTitle>
            <S.ModalDesc>
              번역은 선택한 언어로 자동 생성되며,{"\n"}추후에도 변경할 수
              있습니다.
            </S.ModalDesc>
            <S.ButtonGroup>
              <S.CancelBtn onClick={onClose}>취소</S.CancelBtn>
              <S.ActionBtn onClick={() => onNextStep("language_select")}>
                다음
              </S.ActionBtn>
            </S.ButtonGroup>
          </S.ModalContent>
        )}

        {/* 4. 팀 국적 및 언어 선택 모달 */}
        {currentStep === "language_select" && (
          <S.LangModalContent>
            <S.LangTitle>팀 국적 및 사용 언어 현황</S.LangTitle>
            <S.LangDesc>
              번역할 언어를 선택해주세요. (복수 선택 가능){"\n"}선택한 언어로
              스토리보드가 번역된 버전이 같이 공유됩니다.
            </S.LangDesc>

            {loading ? (
              <div
                style={{
                  padding: "40px 0",
                  textAlign: "center",
                  color: "#6b7280",
                }}
              >
                팀원 목록을 불러오는 중...
              </div>
            ) : members.length === 0 ? (
              <div
                style={{
                  padding: "30px 0",
                  textAlign: "center",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                등록된 팀원이 없습니다.
              </div>
            ) : (
              <S.ListContainer>
                <S.ListItem isHeader onClick={handleToggleAll}>
                  <S.Checkbox
                    type="checkbox"
                    checked={isAllChecked}
                    onChange={handleToggleAll}
                  />
                  <S.MemberName>전체선택</S.MemberName>
                </S.ListItem>

                {members.map((m) => (
                  <S.ListItem key={m.id}>
                    <S.Checkbox
                      type="checkbox"
                      checked={m.checked}
                      onChange={() => handleToggleMember(m.id)}
                    />
                    <S.MemberName>{m.name}</S.MemberName>
                    <LanguageSelect
                      width="140px"
                      height="36px"
                      value={m.language}
                      onChange={(val) => handleChangeLanguage(m.id, val)}
                    />
                  </S.ListItem>
                ))}
              </S.ListContainer>
            )}

            <S.ButtonGroup>
              <S.CancelBtn onClick={onClose}>취소</S.CancelBtn>
              <S.ActionBtn onClick={handleComplete}>선택 완료</S.ActionBtn>
            </S.ButtonGroup>
          </S.LangModalContent>
        )}
      </S.ContentWrapper>
    </BaseModal>
  );
}
