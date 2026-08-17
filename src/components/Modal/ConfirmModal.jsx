import React from "react";
import * as S from "./ConfirmModal.styles";

const ConfirmModal = ({
  isOpen = false,
  imageSrc,
  title,
  description,
  cancelText = "취소",
  confirmText = "확인",
  onClose,
  onConfirm,
  width,
}) => {
  if (!isOpen) return null;

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalContainer width={width} onClick={(e) => e.stopPropagation()}>
        {imageSrc && <S.IconImage src={imageSrc} alt="모달 아이콘" />}
        {title && <S.Title>{title}</S.Title>}
        {description && <S.Description>{description}</S.Description>}

        <S.ButtonGroup>
          {cancelText && (
            <S.SubButton type="button" onClick={onClose}>
              {cancelText}
            </S.SubButton>
          )}
          {confirmText && (
            <S.MainButton
              type="button"
              onClick={() => {
                onConfirm?.();
                onClose?.();
              }}
            >
              {confirmText}
            </S.MainButton>
          )}
        </S.ButtonGroup>
      </S.ModalContainer>
    </S.ModalOverlay>
  );
};

export default ConfirmModal;
