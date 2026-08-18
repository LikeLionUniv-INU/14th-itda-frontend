import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import DocHeader from "./components/DocHeader";
import PageNavigator from "./components/PageNavigator";
import ScreenInfoForm from "./components/ScreenInfoForm";
import WireframeCanvas from "./components/WireframeCanvas";
import RequirementSection from "./components/RequirementSection";
import SaveFlowModals from "./components/SaveFlowModals";

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

  const [modalState, setModalState] = useState({
    isOpen: false,
    step: "exit",
  });

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
      isModified: false,
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

    handleUpdatePage({
      pins: filteredPins,
      requirements: updatedRequirements,
    });
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
    <PageLayout>
      <ContentContainer>
        <HeaderWrapper>
          <DocHeader
            docName="스토리보드"
            version={1}
            mode="create"
            onBack={() => setModalState({ isOpen: true, step: "exit" })}
            onTempSave={() => alert("임시저장되었습니다.")}
            onSave={() =>
              setModalState({ isOpen: true, step: "complete_confirm" })
            }
          />
        </HeaderWrapper>

        <MainSection>
          {/* 좌측 (712px × 854px) */}
          <LeftColumn>
            <PageNavWrapper>
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
            </PageNavWrapper>

            <LeftBox>
              <ScreenInfoForm
                screenName={currentPage.screenName}
                screenId={currentPage.screenId}
                onChangeScreenName={(name) =>
                  handleUpdatePage({ screenName: name })
                }
                onChangeScreenId={(id) => handleUpdatePage({ screenId: id })}
              />
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
            </LeftBox>
          </LeftColumn>

          {/* 우측 (468px × 854px) */}
          <RightColumn>
            <RightBox>
              <RequirementSection
                mode="create"
                requirements={currentPage.requirements || {}}
                focusedPinId={focusedPinId}
                onUpdateRequirement={handleUpdateRequirement}
                onFocusPin={(id) => setFocusedPinId(id)}
              />
            </RightBox>
          </RightColumn>
        </MainSection>
      </ContentContainer>

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
    </PageLayout>
  );
}

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  padding: 40px 0 80px 0;
  box-sizing: border-box;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  width: 1200px;
`;

const HeaderWrapper = styled.div`
  width: 1200px;
  height: 61px;
  display: flex;
  align-items: center;
`;

const MainSection = styled.div`
  display: flex;
  width: 1200px;
  justify-content: space-between;
  align-items: flex-end;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 712px;
`;

const PageNavWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
`;

/* 712px × 854px 고정 박스 */
const LeftBox = styled.div`
  width: 712px;
  height: 854px;
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid #b6b6b6;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 468px;
`;

/* 468px × 854px 고정 박스 */
const RightBox = styled.div`
  width: 468px;
  height: 854px;
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid #b6b6b6;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;
