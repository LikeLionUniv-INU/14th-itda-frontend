import React, { useState } from "react";
import BaseModal from "./BaseModal";
import * as S from "./EditSummaryModal.styles";

export default function EditSummaryModal({
  isOpen,
  currentVersion = "1",
  summaryList = [],
  onClose,
  onSubmit,
}) {
  const [version, setVersion] = useState("");
  const [description, setDescription] = useState("");
  const [versionError, setVersionError] = useState("");

  const handleVersionChange = (e) => {
    const val = e.target.value;
    setVersion(val);

    if (!val.trim()) {
      setVersionError("");
      return;
    }

    if (!/^\d+$/.test(val)) {
      setVersionError("숫자로만 입력해주세요.");
    } else if (String(val) === String(currentVersion)) {
      setVersionError("기존 버전이랑 동일하게 입력하셨습니다.");
    } else {
      setVersionError("");
    }
  };

  const handleCloseAll = () => {
    setVersion("");
    setDescription("");
    setVersionError("");
    onClose?.();
  };

  const handleSubmit = () => {
    if (!version.trim() || versionError) return;
    onSubmit?.({
      version,
      description,
      summaryList,
    });
  };

  const isFormValid = version.trim().length > 0 && !versionError;

  return (
    <BaseModal isOpen={isOpen} onClose={handleCloseAll} width="909px">
      <S.ContentWrapper>
        <S.Title>변경사항 정리</S.Title>
        <S.SubTitle>
          이번 수정에서 반영한 내용을 정리하고 버전을 등록합니다.
        </S.SubTitle>

        {/* 1. 버전 정보 입력 */}
        <S.FormGroup>
          <S.Label>
            버전 정보 <span className="guide-text">(필수)</span>
          </S.Label>
          <S.Input
            type="text"
            placeholder="예) 1"
            value={version}
            onChange={handleVersionChange}
            className={versionError ? "error" : ""}
          />
          {versionError && <S.ErrorText>{versionError}</S.ErrorText>}
        </S.FormGroup>

        {/* 2. 변경사항 설명 */}
        <S.FormGroup>
          <S.Label>
            변경사항 설명 <span className="guide-text">(선택)</span>
          </S.Label>
          <S.TextareaWrapper>
            <S.Textarea
              placeholder="변경사항에 대해서 정리해서 작성해주세요."
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <S.CharCount>{description.length}/1000</S.CharCount>
          </S.TextareaWrapper>
        </S.FormGroup>

        {/* 3. 변경사항 항목 (845 x 222 규격 전용 테이블) */}
        <S.TableSection>
          <S.TableTitle>
            변경사항 항목 <span>({summaryList.length})</span>
          </S.TableTitle>
          <S.TableContainer>
            <S.TableHeader>
              <span className="col-page">페이지</span>
              <span className="col-no">No.</span>
              <span className="col-sec">항목</span>
              <span className="col-desc">수정 내용 미리보기</span>
            </S.TableHeader>
            <S.TableBody>
              {summaryList.length === 0 ? (
                <S.EmptyRow>수정된 변경사항이 없습니다.</S.EmptyRow>
              ) : (
                summaryList.map((item, idx) => (
                  <S.TableRow key={item.id || idx}>
                    <span className="col-page">
                      {item.pageName || item.page || "-"}
                    </span>
                    <span className="col-no">
                      {item.number || item.pinNumber || item.no || "-"}
                    </span>
                    <span className="col-sec">
                      {item.itemName || item.item || item.section || "-"}
                    </span>
                    <span className="col-desc">
                      {item.previewContent ||
                        item.content ||
                        item.previewText ||
                        item.text ||
                        "-"}
                    </span>
                  </S.TableRow>
                ))
              )}
            </S.TableBody>
          </S.TableContainer>
        </S.TableSection>

        {/* 4. 하단 버튼 영역 */}
        <S.ButtonGroup>
          <S.CancelButton onClick={handleCloseAll}>취소</S.CancelButton>
          <S.SubmitButton onClick={handleSubmit} disabled={!isFormValid}>
            수정완료
          </S.SubmitButton>
        </S.ButtonGroup>
      </S.ContentWrapper>
    </BaseModal>
  );
}
