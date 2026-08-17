import React from "react";
import * as S from "./ScreenInfoForm.styles";

const ScreenInfoForm = ({
  screenName = "",
  screenId = "",
  onChangeScreenName,
  onChangeScreenId,
  isReadOnly = false,
}) => {
  const handleNameChange = (e) => {
    if (e.target.value.length <= 12 && onChangeScreenName) {
      onChangeScreenName(e.target.value);
    }
  };

  const handleIdChange = (e) => {
    if (e.target.value.length <= 12 && onChangeScreenId) {
      onChangeScreenId(e.target.value);
    }
  };

  return (
    <S.FormContainer>
      <S.TitleBox>
        <S.Title>화면 정보</S.Title>
      </S.TitleBox>

      <S.InputGroupRow>
        <S.FieldWrapper>
          <S.Label>화면 이름</S.Label>
          <S.Input
            type="text"
            placeholder="화면 이름을 입력해주세요"
            value={screenName}
            onChange={handleNameChange}
            readOnly={isReadOnly}
            maxLength={12}
          />
        </S.FieldWrapper>

        <S.FieldWrapper>
          <S.Label>화면 ID</S.Label>
          <S.Input
            type="text"
            placeholder="예)SIGN_UP_001"
            value={screenId}
            onChange={handleIdChange}
            readOnly={isReadOnly}
            maxLength={12}
          />
        </S.FieldWrapper>
      </S.InputGroupRow>
    </S.FormContainer>
  );
};

export default ScreenInfoForm;
