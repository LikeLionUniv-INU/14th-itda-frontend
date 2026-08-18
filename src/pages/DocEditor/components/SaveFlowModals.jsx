import React, { useState, useMemo } from "react";
import styled from "styled-components";
import ISO6391 from "iso-639-1"; // 👈 iso-639-1 라이브러리 import

// 에셋 import
import BangImg from "../../../assets/image/bang.svg";
import CheckImg from "../../../assets/image/check.svg";
import GlobalImg from "../../../assets/image/Global.svg";

export default function SaveFlowModals({
  isOpen,
  currentStep, // 'exit' | 'complete_confirm' | 'translate_intro' | 'language_select'
  docName = "스토리보드_Version1",
  onClose,
  onConfirmExit,
  onNextStep,
  onFinalSave,
}) {
  // iso-639-1로 전 세계 언어의 원어(Native Name) 목록 불러오기
  const languageOptions = useMemo(() => {
    const nativeNames = ISO6391.getAllNativeNames(); // ['한국어', 'English', '日本語', 'Español', ...]

    // 자주 쓰이는 주요 언어를 맨 위에 우선 배치
    const priorityLangs = [
      "한국어",
      "English",
      "日本語",
      "Tiếng Việt",
      "中文",
      "Español",
      "Français",
      "Deutsch",
    ];
    const otherLangs = nativeNames
      .filter((lang) => !priorityLangs.includes(lang))
      .sort((a, b) => a.localeCompare(b));

    return [...priorityLangs, ...otherLangs];
  }, []);

  // 팀원 언어 선택 목록 state
  const [members, setMembers] = useState([
    { id: 1, name: "김민수", checked: true, language: "한국어" },
    { id: 2, name: "John smith", checked: true, language: "English" },
    { id: 3, name: "일본어 이름", checked: true, language: "日本語" },
    { id: 4, name: "중국어 이름", checked: false, language: "中文" },
    { id: 5, name: "베트남 이름", checked: false, language: "Tiếng Việt" },
  ]);

  if (!isOpen) return null;

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
    setMembers(members.map((m) => (m.id === id ? { ...m, language } : m)));
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        {/* 1. 나가기 경고 모달 */}
        {currentStep === "exit" && (
          <ModalContent>
            <ModalIcon src={BangImg} alt="나가기 경고" />
            <ModalTitle>정말 나가시겠습니까?</ModalTitle>
            <ModalDesc>
              아직 저장되지 않은 사항에 대해서는{"\n"}삭제됩니다.
            </ModalDesc>
            <ButtonGroup>
              <CancelBtn onClick={onClose}>취소</CancelBtn>
              <ActionBtn onClick={onConfirmExit}>나가기</ActionBtn>
            </ButtonGroup>
          </ModalContent>
        )}

        {/* 2. 저장 확인 모달 */}
        {currentStep === "complete_confirm" && (
          <ModalContent>
            <ModalIcon src={CheckImg} alt="작성 완료 확인" />
            <ModalTitle>
              {docName}
              {"\n"}문서 작성을 완료할까요?
            </ModalTitle>
            <ModalDesc>저장된 내용은 언제든지 수정할 수 있습니다.</ModalDesc>
            <ButtonGroup>
              <CancelBtn onClick={onClose}>취소</CancelBtn>
              <ActionBtn onClick={() => onNextStep("translate_intro")}>
                작성완료
              </ActionBtn>
            </ButtonGroup>
          </ModalContent>
        )}

        {/* 3. 번역 안내 모달 */}
        {currentStep === "translate_intro" && (
          <ModalContent>
            <ModalIcon src={GlobalImg} alt="번역 안내" />
            <ModalTitle>
              우리 팀원들의 국적에 맞추어{"\n"}자동으로 번역된 버전으로 번역을
              해드릴게요!
            </ModalTitle>
            <ModalDesc>
              번역은 선택한 언어로 자동 생성되며,{"\n"}추후에도 변경할 수
              있습니다.
            </ModalDesc>
            <ButtonGroup>
              <CancelBtn onClick={onClose}>취소</CancelBtn>
              <ActionBtn onClick={() => onNextStep("language_select")}>
                다음
              </ActionBtn>
            </ButtonGroup>
          </ModalContent>
        )}

        {/* 4. 팀 국적 및 언어 선택 모달 */}
        {currentStep === "language_select" && (
          <LangModalContent>
            <LangTitle>팀 국적 및 사용 언어 현황</LangTitle>
            <LangDesc>
              번역할 언어를 선택해주세요. (복수 선택 가능){"\n"}선택한 언어로
              스토리보드가 번역된 버전이 같이 공유됩니다.
            </LangDesc>

            <ListContainer>
              <ListItem isHeader onClick={handleToggleAll}>
                <Checkbox
                  type="checkbox"
                  checked={isAllChecked}
                  onChange={handleToggleAll}
                />
                <MemberName>전체선택</MemberName>
              </ListItem>

              {members.map((m) => (
                <ListItem key={m.id}>
                  <Checkbox
                    type="checkbox"
                    checked={m.checked}
                    onChange={() => handleToggleMember(m.id)}
                  />
                  <MemberName>{m.name}</MemberName>
                  <SelectBox
                    value={m.language}
                    onChange={(e) => handleChangeLanguage(m.id, e.target.value)}
                  >
                    {languageOptions.map((lang, idx) => (
                      <option key={`${lang}-${idx}`} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </SelectBox>
                </ListItem>
              ))}
            </ListContainer>

            <ButtonGroup>
              <CancelBtn onClick={onClose}>취소</CancelBtn>
              <ActionBtn onClick={() => onFinalSave(members)}>
                선택 완료
              </ActionBtn>
            </ButtonGroup>
          </LangModalContent>
        )}
      </ModalContainer>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 36px 32px 28px 32px;
  box-sizing: border-box;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 360px;
`;

const ModalIcon = styled.img`
  width: 56px;
  height: 56px;
  margin-bottom: 20px;
  display: block;
`;

const ModalTitle = styled.h3`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 18px;
  color: #000000;
  line-height: 1.4;
  margin: 0 0 10px 0;
  white-space: pre-line;
`;

const ModalDesc = styled.p`
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 13px;
  color: #777777;
  line-height: 1.5;
  margin: 0 0 28px 0;
  white-space: pre-line;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

const CancelBtn = styled.button`
  flex: 1;
  height: 44px;
  border-radius: 8px;
  border: 1.5px solid #8777f8;
  background-color: #ffffff;
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 14px;
  color: #462fea;
  cursor: pointer;
`;

const ActionBtn = styled.button`
  flex: 1;
  height: 44px;
  border-radius: 8px;
  border: none;
  background-color: #462fea;
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 14px;
  color: #ffffff;
  cursor: pointer;
`;

const LangModalContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 440px;
`;

const LangTitle = styled.h3`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 18px;
  color: #000000;
  margin: 0 0 8px 0;
`;

const LangDesc = styled.p`
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 13px;
  color: #777777;
  line-height: 1.4;
  margin: 0 0 20px 0;
  white-space: pre-line;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  padding: 8px 12px;
  margin-bottom: 24px;
  gap: 8px;
  max-height: 260px;
  overflow-y: auto;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 6px;
  border-bottom: ${({ isHeader }) => (isHeader ? "1px solid #EEEEEE" : "none")};
  cursor: ${({ isHeader }) => (isHeader ? "pointer" : "default")};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #462fea;
  cursor: pointer;
`;

const MemberName = styled.span`
  flex: 1;
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 14px;
  color: #222222;
`;

const SelectBox = styled.select`
  height: 32px;
  padding: 0 10px;
  border-radius: 6px;
  border: 1px solid #d6d6d6;
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 13px;
  outline: none;
  background-color: #ffffff;
  max-width: 160px;
`;
