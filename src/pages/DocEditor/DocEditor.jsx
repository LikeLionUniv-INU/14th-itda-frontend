import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import DocHeader from "./components/DocHeader";
import PageNavigator from "./components/PageNavigator";
import ScreenInfoForm from "./components/ScreenInfoForm";
import WireframeCanvas from "./components/WireframeCanvas";
import RequirementSection from "./components/RequirementSection";
import SaveFlowModals from "../../components/Modal/SaveFlowModals";
import * as S from "./DocEditor.styles";

const INITIAL_ROLES = ["공통", "기획", "프론트", "백엔드", "디자인"];

export default function DocEditorPage() {
  const navigate = useNavigate();

  const [pages, setPages] = useState([
    {
      pageId: 1,
      screenName: "",
      screenId: "",
      imageUrl: "",
      device: "desktop",
      pins: [],
      requirements: {
        공통: [],
        기획: [],
        프론트: [],
        백엔드: [],
        디자인: [],
      },
    },
  ]);

  const [activePageIndex, setActivePageIndex] = useState(0);
  const [focusedPinId, setFocusedPinId] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, step: "exit" });

  const currentPage = pages[activePageIndex] || {};

  const handleUpdatePage = (updatedField) => {
    setPages((prev) =>
      prev.map((p, idx) =>
        idx === activePageIndex ? { ...p, ...updatedField } : p,
      ),
    );
  };

  const handleAddPin = ({ x, y }) => {
    const currentPins = currentPage.pins || [];
    const newPinId = Date.now();
    const newPinNumber = currentPins.length + 1;
    const newPin = { id: newPinId, number: newPinNumber, x, y };
    const newReqItem = {
      id: newPinId,
      number: newPinNumber,
      item: "",
      detail: "",
    };

    const updatedRequirements = { ...(currentPage.requirements || {}) };
    INITIAL_ROLES.forEach((role) => {
      updatedRequirements[role] = [
        ...(updatedRequirements[role] || []),
        { ...newReqItem },
      ];
    });

    handleUpdatePage({
      pins: [...currentPins, newPin],
      requirements: updatedRequirements,
    });
    setFocusedPinId(newPin.id);
  };

  const handleUpdatePinPos = (pinId, { x, y }) => {
    const updatedPins = (currentPage.pins || []).map((p) =>
      p.id === pinId ? { ...p, x, y } : p,
    );
    handleUpdatePage({ pins: updatedPins });
  };

  const handleDeletePin = (pinId) => {
    const filteredPins = (currentPage.pins || [])
      .filter((p) => p.id !== pinId)
      .map((p, idx) => ({ ...p, number: idx + 1 }));

    const updatedRequirements = { ...(currentPage.requirements || {}) };
    INITIAL_ROLES.forEach((role) => {
      updatedRequirements[role] = (updatedRequirements[role] || [])
        .filter((r) => r.id !== pinId)
        .map((r, idx) => ({ ...r, number: idx + 1 }));
    });

    handleUpdatePage({ pins: filteredPins, requirements: updatedRequirements });
    setFocusedPinId(null);
  };

  const handleUpdateRequirement = (
    role,
    reqId,
    field,
    value,
    syncAll = false,
  ) => {
    const updatedRequirements = { ...(currentPage.requirements || {}) };
    const targetRoles = syncAll ? INITIAL_ROLES : [role];

    targetRoles.forEach((r) => {
      const list = updatedRequirements[r] || [];
      const exists = list.some((item) => item.id === reqId);

      if (exists) {
        updatedRequirements[r] = list.map((item) => {
          if (item.id !== reqId) return item;
          if (field === "all") return { ...item, ...value };
          return { ...item, [field]: value };
        });
      } else {
        const targetPin = (currentPage.pins || []).find((p) => p.id === reqId);
        const newNumber = targetPin ? targetPin.number : list.length + 1;
        const newItem =
          field === "all"
            ? { id: reqId, number: newNumber, ...value }
            : {
                id: reqId,
                number: newNumber,
                item: "",
                detail: "",
                [field]: value,
              };
        updatedRequirements[r] = [...list, newItem];
      }
    });

    handleUpdatePage({ requirements: updatedRequirements });
  };

  return (
    <S.PageLayout>
      <S.ContentContainer>
        <S.HeaderWrapper>
          <DocHeader
            docName="스토리보드"
            currVersion={1}
            mode="create"
            onBack={() => setModalState({ isOpen: true, step: "exit" })}
            onTempSave={() => alert("임시저장되었습니다.")}
            onSave={() =>
              setModalState({ isOpen: true, step: "complete_confirm" })
            }
          />
        </S.HeaderWrapper>

        <S.MainSection>
          <S.LeftColumn>
            <S.PageNavWrapper>
              <PageNavigator
                pages={pages}
                activePageIndex={activePageIndex}
                onSelectPage={(index) => {
                  setActivePageIndex(index);
                  setFocusedPinId(null);
                }}
                onAddPage={() => {
                  setPages([
                    ...pages,
                    {
                      pageId: Date.now(),
                      screenName: "",
                      screenId: "",
                      imageUrl: "",
                      device: "desktop",
                      pins: [],
                      requirements: {
                        공통: [],
                        기획: [],
                        프론트: [],
                        백엔드: [],
                        디자인: [],
                      },
                    },
                  ]);
                  setActivePageIndex(pages.length);
                }}
              />
            </S.PageNavWrapper>

            <S.LeftBox>
              <ScreenInfoForm
                screenName={currentPage.screenName}
                screenId={currentPage.screenId}
                onChangeScreenName={(name) =>
                  handleUpdatePage({ screenName: name })
                }
                onChangeScreenId={(id) => handleUpdatePage({ screenId: id })}
              />
              <S.Divider />
              <WireframeCanvas
                imageUrl={currentPage.imageUrl}
                device={currentPage.device}
                pins={currentPage.pins}
                focusedPinId={focusedPinId}
                onChangeDevice={(device) => handleUpdatePage({ device })}
                onUploadImage={(imageUrl) => handleUpdatePage({ imageUrl })}
                onAddPin={handleAddPin}
                onUpdatePinPos={handleUpdatePinPos}
                onFocusPin={(id) => setFocusedPinId(id)}
                onDeletePin={handleDeletePin}
              />
            </S.LeftBox>
          </S.LeftColumn>

          <S.RightColumn>
            <S.RightBox>
              <RequirementSection
                mode="create"
                requirements={currentPage.requirements || {}}
                focusedPinId={focusedPinId}
                onUpdateRequirement={handleUpdateRequirement}
                onFocusPin={(id) => setFocusedPinId(id)}
              />
            </S.RightBox>
          </S.RightColumn>
        </S.MainSection>
      </S.ContentContainer>

      <SaveFlowModals
        isOpen={modalState.isOpen}
        currentStep={modalState.step}
        docName="스토리보드_Version1"
        onClose={() => setModalState({ isOpen: false, step: "exit" })}
        onConfirmExit={() => {
          setModalState({ isOpen: false, step: "exit" });
          navigate(-1);
        }}
        onNextStep={(nextStep) =>
          setModalState({ isOpen: true, step: nextStep })
        }
        onFinalSave={() => {
          setModalState({ isOpen: false, step: "exit" });
          alert("스토리보드가 성공적으로 저장되었습니다!");
        }}
      />
    </S.PageLayout>
  );
}
