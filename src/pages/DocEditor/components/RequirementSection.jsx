import React, { useState } from "react";
import * as S from "./RequirementSection.styles";
import EmptyImg from "../../../assets/image/emptyImg.svg";

const ROLES = ["공통", "기획", "프론트", "백엔드", "디자인"];

const RequirementSection = ({
  mode = "create",
  requirements = {},
  focusedPinId,
  isReadOnly = false,
  onChangeRole,
  onUpdateRequirement,
  onFocusPin,
}) => {
  const [activeRole, setActiveRole] = useState("공통");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ item: "", detail: "" });

  const currentList = requirements[activeRole] || [];

  const handleTabChange = (role) => {
    setActiveRole(role);
    onChangeRole?.(role);
    setEditingId(null);
  };

  const handleInputChange = (id, field, value) => {
    onUpdateRequirement?.(activeRole, id, field, value, activeRole === "공통");
  };

  const handleStartEdit = (req) => {
    setEditingId(req.id);
    setEditForm({
      item: req.item || "",
      detail: req.detail || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ item: "", detail: "" });
  };

  const handleCompleteEdit = (req) => {
    onUpdateRequirement?.(
      activeRole,
      req.id,
      "all",
      {
        item: editForm.item,
        detail: editForm.detail,
        isModified: true,
      },
      activeRole === "공통",
    );
    setEditingId(null);
  };

  return (
    <S.Container>
      <S.Title>요구사항 작성</S.Title>

      <S.TabBar>
        {ROLES.map((role) => (
          <S.TabButton
            key={role}
            active={activeRole === role}
            onClick={() => handleTabChange(role)}
          >
            {role}
          </S.TabButton>
        ))}
      </S.TabBar>

      {currentList.length === 0 ? (
        <S.EmptyBox>
          <S.EmptyIcon src={EmptyImg} alt="요구사항 안내 아이콘" />
          <S.EmptyTitle>
            이미지 위에 핀을 추가하여{"\n"}해당 부분의 설명을 추가해주세요.
          </S.EmptyTitle>
          <S.EmptyDesc>
            좌측 와이어프레임 이미지에 핀을 추가하면{"\n"}여기에 해당 부분에
            대한 요구사항을 작성할 수 있습니다.
          </S.EmptyDesc>
        </S.EmptyBox>
      ) : (
        <S.TableContainer>
          <S.TableHeader>
            <S.ColNo>No.</S.ColNo>
            <S.ColItem>항목</S.ColItem>
            <S.ColRequirement>요구사항</S.ColRequirement>
            {mode === "edit" && !isReadOnly && <S.ColAction>수정</S.ColAction>}
          </S.TableHeader>

          <S.TableBody>
            {currentList.map((req) => {
              const isEditing = editingId === req.id;

              return (
                <S.Row
                  key={req.id}
                  isModified={req.isModified}
                  onClick={() => onFocusPin?.(req.id)}
                >
                  <S.ColNo>
                    <S.PinBadge>{req.number}</S.PinBadge>
                  </S.ColNo>

                  {mode === "create" ? (
                    <>
                      <S.ColItem>
                        <S.StyledInput
                          value={req.item || ""}
                          maxLength={10}
                          placeholder="예) ID 입력"
                          disabled={isReadOnly}
                          onChange={(e) =>
                            handleInputChange(req.id, "item", e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </S.ColItem>
                      <S.ColRequirement>
                        <S.StyledTextArea
                          value={req.detail || ""}
                          maxLength={200}
                          placeholder="요구사항에 대해 입력해주세요."
                          disabled={isReadOnly}
                          onChange={(e) =>
                            handleInputChange(req.id, "detail", e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </S.ColRequirement>
                    </>
                  ) : (
                    <>
                      <S.ColItem>
                        {isEditing ? (
                          <S.StyledInput
                            value={editForm.item}
                            maxLength={10}
                            placeholder="예) ID 입력"
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                item: e.target.value,
                              }))
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          req.item || "-"
                        )}
                      </S.ColItem>

                      <S.ColRequirement>
                        {isEditing ? (
                          <S.StyledTextArea
                            value={editForm.detail}
                            maxLength={200}
                            placeholder="요구사항에 대해 입력해주세요."
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                detail: e.target.value,
                              }))
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          req.detail || "-"
                        )}
                      </S.ColRequirement>

                      {!isReadOnly && (
                        <S.ColAction onClick={(e) => e.stopPropagation()}>
                          {isEditing ? (
                            <>
                              <S.ActionButton
                                variant="complete"
                                onClick={() => handleCompleteEdit(req)}
                              >
                                수정완료
                              </S.ActionButton>
                              <S.ActionButton
                                variant="cancel"
                                onClick={handleCancelEdit}
                              >
                                취소
                              </S.ActionButton>
                            </>
                          ) : (
                            <S.ActionButton
                              variant="edit"
                              onClick={() => handleStartEdit(req)}
                            >
                              수정하기
                            </S.ActionButton>
                          )}
                        </S.ColAction>
                      )}
                    </>
                  )}
                </S.Row>
              );
            })}
          </S.TableBody>
        </S.TableContainer>
      )}
    </S.Container>
  );
};

export default RequirementSection;
