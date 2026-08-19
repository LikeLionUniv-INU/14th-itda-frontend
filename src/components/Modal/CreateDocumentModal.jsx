import React, { useState } from "react";
import BaseModal from "./BaseModal";
import LanguageSelect from "../LanguageSelect";
import DocIcon from "../../assets/image/DocIcon.svg";
import * as S from "./CreateDocumentModal.styles";

function CreateDocumentModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [docName, setDocName] = useState("");
  const [language, setLanguage] = useState("ko");
  const [version, setVersion] = useState("1");
  const [versionError, setVersionError] = useState("");

  const handleSelectType = (typeName) => {
    setSelectedType(typeName);
    setStep(2);
  };

  const handleVersionChange = (e) => {
    const val = e.target.value;
    setVersion(val);
    if (!val.trim()) {
      setVersionError("");
      return;
    }
    if (!/^\d+$/.test(val)) {
      setVersionError("숫자로 입력해주세요.");
    } else {
      setVersionError("");
    }
  };

  const handleCreateSubmit = () => {
    if (!docName.trim() || versionError || !version.trim()) return;
    setStep(3);
  };

  const handleCloseAll = () => {
    setStep(1);
    setSelectedType("");
    setDocName("");
    setLanguage("ko");
    setVersion("1");
    setVersionError("");
    onClose?.();
  };

  const isFormValid =
    docName.trim().length > 0 && version.trim().length > 0 && !versionError;

  return (
    <BaseModal isOpen={isOpen} onClose={handleCloseAll} width="440px">
      <S.ContentWrapper>
        {step === 1 && (
          <div>
            <S.Title>문서 유형 선택</S.Title>
            <S.SubTitle>생성할 문서의 유형을 선택하세요.</S.SubTitle>

            <S.OptionList>
              <S.OptionCard
                active
                onClick={() => handleSelectType("스토리보드")}
              >
                <S.CardIconBox />
                <S.CardContent>
                  <S.CardTitle active>스토리보드</S.CardTitle>
                  <S.CardDesc>
                    서비스의 화면 흐름과 인터렉션을 시각적으로 설계합니다.
                  </S.CardDesc>
                </S.CardContent>
                <S.ArrowIcon>❯</S.ArrowIcon>
              </S.OptionCard>

              <S.OptionCard
                active
                onClick={() => handleSelectType("기능 명세서")}
              >
                <S.CardIconBox />
                <S.CardContent>
                  <S.CardTitle active>기능 명세서</S.CardTitle>
                  <S.CardDesc>
                    서비스의 기능과 요구사항을 정리합니다.
                  </S.CardDesc>
                </S.CardContent>
                <S.ArrowIcon>❯</S.ArrowIcon>
              </S.OptionCard>

              <S.OptionCard>
                <S.CardIconBox />
                <S.CardContent>
                  <S.CardTitle>화면 설계서</S.CardTitle>
                  <S.CardDesc>화면 구성과 흐름을 설계합니다.</S.CardDesc>
                </S.CardContent>
                <S.DisabledBadge>추후 업데이트</S.DisabledBadge>
              </S.OptionCard>

              <S.OptionCard>
                <S.CardIconBox />
                <S.CardContent>
                  <S.CardTitle>API 명세서</S.CardTitle>
                  <S.CardDesc>API 명세 및 데이터 구조를 정의합니다.</S.CardDesc>
                </S.CardContent>
                <S.DisabledBadge>추후 업데이트</S.DisabledBadge>
              </S.OptionCard>

              <S.OptionCard>
                <S.CardIconBox />
                <S.CardContent>
                  <S.CardTitle>서비스 소개서</S.CardTitle>
                  <S.CardDesc>
                    서비스에 대한 데이터 구조를 정의합니다.
                  </S.CardDesc>
                </S.CardContent>
                <S.DisabledBadge>추후 업데이트</S.DisabledBadge>
              </S.OptionCard>
            </S.OptionList>
          </div>
        )}

        {step === 2 && (
          <div>
            <S.Title>기본 정보 입력</S.Title>
            <S.SubTitle>문서의 기본 정보를 입력하세요.</S.SubTitle>

            <S.FormGroup>
              <S.Label>문서 이름</S.Label>
              <S.Input
                type="text"
                maxLength={10}
                placeholder="예) 회원 관리 기능 명세서"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
              />
            </S.FormGroup>

            <S.FormGroup>
              <S.Label>언어</S.Label>
              <LanguageSelect
                value={language}
                onChange={(val) => setLanguage(val)}
                height="44px"
              />
            </S.FormGroup>

            <S.FormGroup>
              <S.Label>버전</S.Label>
              <S.Input
                type="text"
                placeholder="숫자로 입력해주세요."
                value={version}
                onChange={handleVersionChange}
                className={versionError ? "error" : ""}
              />
              {versionError && <S.ErrorText>{versionError}</S.ErrorText>}
            </S.FormGroup>

            <S.ButtonGroup>
              <S.CancelButton onClick={handleCloseAll}>취소</S.CancelButton>
              <S.SubmitButton
                onClick={handleCreateSubmit}
                disabled={!isFormValid}
              >
                생성
              </S.SubmitButton>
            </S.ButtonGroup>
          </div>
        )}

        {step === 3 && (
          <S.CenterContainer>
            <S.Title style={{ textAlign: "left", width: "100%" }}>
              문서 생성 완료
            </S.Title>

            <S.IconWrapper>
              <img src={DocIcon} alt="문서 생성 완료" />
            </S.IconWrapper>

            <S.SuccessMessage>문서가 생성되었습니다!</S.SuccessMessage>

            <S.SummaryBox>
              <S.SummaryRow>
                <span className="key">문서 이름</span>
                <span className="value">{docName}</span>
              </S.SummaryRow>
              <S.SummaryRow>
                <span className="key">언어</span>
                <span className="value">{language}</span>
              </S.SummaryRow>
              <S.SummaryRow>
                <span className="key">버전</span>
                <span className="value">ver.{version}</span>
              </S.SummaryRow>
            </S.SummaryBox>

            <S.CompleteButton onClick={handleCloseAll}>완료</S.CompleteButton>
          </S.CenterContainer>
        )}
      </S.ContentWrapper>
    </BaseModal>
  );
}

export default CreateDocumentModal;
