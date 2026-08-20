import React, { useState, useRef } from "react";
import ConfirmModal from "../../../components/Modal/ConfirmModal";
import * as S from "./WireframeCanvas.styles";
import UploadFolderIcon from "../../../assets/image/Image.svg";
import DeleteIcon from "../../../assets/image/delete.svg";

const WireframeCanvas = ({
  imageUrl,
  device = "desktop",
  pins = [],
  focusedPinId,
  isReadOnly = false,
  onChangeDevice,
  onUploadImage,
  onAddPin,
  onUpdatePinPos,
  onFocusPin,
  onDeletePin,
}) => {
  const fileInputRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const [isAddingPin, setIsAddingPin] = useState(false);
  const [draggingPinId, setDraggingPinId] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const focusedPin = pins.find((p) => p.id === focusedPinId);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onUploadImage) {
      const tempUrl = URL.createObjectURL(file);
      onUploadImage(tempUrl, file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && onUploadImage) {
      const tempUrl = URL.createObjectURL(file);
      onUploadImage(tempUrl, file);
    }
  };

  const handleCanvasClick = (e) => {
    if (!isAddingPin || !imageWrapperRef.current) return;
    const rect = imageWrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      onAddPin?.({ x, y });
      setIsAddingPin(false);
    }
  };

  const handlePinMouseDown = (e, pinId) => {
    e.stopPropagation();
    onFocusPin?.(pinId);
    setDraggingPinId(pinId);
  };

  const handleMouseMove = (e) => {
    if (draggingPinId === null || !imageWrapperRef.current) return;
    const rect = imageWrapperRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    onUpdatePinPos?.(draggingPinId, { x, y });
  };

  const handleMouseUp = () => {
    if (draggingPinId !== null) {
      setDraggingPinId(null);
    }
  };

  const handleDeleteClick = () => {
    if (!focusedPinId) {
      setIsAlertModalOpen(true);
      return;
    }
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (focusedPinId) {
      onDeletePin?.(focusedPinId);
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <S.Container onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg"
        style={{ display: "none" }}
      />

      <S.HeaderRow>
        <S.Title>와이어프레임</S.Title>
        <S.SelectBox
          value={device}
          onChange={(e) => onChangeDevice?.(e.target.value)}
          disabled={isReadOnly}
        >
          <option value="desktop">데스크탑</option>
          <option value="mobile">모바일</option>
        </S.SelectBox>
      </S.HeaderRow>

      <S.CanvasArea onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
        {!imageUrl ? (
          <S.EmptyBox
            onClick={() => !isReadOnly && fileInputRef.current?.click()}
          >
            <S.EmptyIcon src={UploadFolderIcon} alt="업로드 아이콘" />
            <S.EmptyTitle>와이어프레임 이미지를 추가해주세요.</S.EmptyTitle>
            <S.EmptyDesc>
              이미지 파일을 드래그하거나 클릭으로 업로드 할 수 있습니다.
              <br />
              권장 형식: PNG, JPG, JPEG (최대 7MB)
            </S.EmptyDesc>
          </S.EmptyBox>
        ) : (
          <>
            {!isReadOnly && (
              <S.ChangeImageButton
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                이미지 변경
              </S.ChangeImageButton>
            )}

            <S.ScrollViewport $device={device}>
              <S.ImageWrapper
                ref={imageWrapperRef}
                $isAddingPin={isAddingPin}
                onClick={handleCanvasClick}
              >
                <img src={imageUrl} alt="와이어프레임" />
                {pins.map((pin) => (
                  <S.PinSticker
                    key={pin.id}
                    x={pin.x}
                    y={pin.y}
                    $isFocused={pin.id === focusedPinId}
                    onMouseDown={(e) => handlePinMouseDown(e, pin.id)}
                  >
                    {pin.number}
                  </S.PinSticker>
                ))}
              </S.ImageWrapper>
            </S.ScrollViewport>

            {!isReadOnly && (
              <S.BottomButtonGroup>
                <S.AddPinButton
                  type="button"
                  $isAddingPin={isAddingPin}
                  onClick={() => setIsAddingPin((prev) => !prev)}
                >
                  {isAddingPin ? "클릭하여 배치" : "핀 추가"}
                </S.AddPinButton>
                <S.DeletePinButton type="button" onClick={handleDeleteClick}>
                  핀 삭제
                </S.DeletePinButton>
              </S.BottomButtonGroup>
            )}
          </>
        )}
      </S.CanvasArea>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        imageSrc={DeleteIcon}
        title={`${focusedPin?.number}번 핀을 삭제할까요?`}
        description={`${focusedPin?.number}번 핀으로 작성된\n요구사항도 함께 삭제됩니다.`}
        cancelText="취소"
        confirmText="삭제"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <ConfirmModal
        isOpen={isAlertModalOpen}
        imageSrc={DeleteIcon}
        title="삭제할 핀을 선택해주세요"
        description="삭제하고자 하는 핀을 먼저 선택하고 다시 눌러주세요."
        confirmText="확인"
        cancelText={null}
        onClose={() => setIsAlertModalOpen(false)}
        onConfirm={() => setIsAlertModalOpen(false)}
      />
    </S.Container>
  );
};

export default WireframeCanvas;
