import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DocHeader from "./components/DocHeader";
import PageNavigator from "./components/PageNavigator";
import ScreenInfoForm from "./components/ScreenInfoForm";
import WireframeCanvas from "./components/WireframeCanvas";
import RequirementSection from "./components/RequirementSection";
import SaveFlowModals from "../../components/Modal/SaveFlowModals";
import {
  createDocument,
  autoSaveDocument,
  requestTranslation,
  uploadWireframePipeline,
} from "../../api/documentApi";
import * as S from "./DocEditor.styles";

const INITIAL_ROLES = ["공통", "기획", "프론트", "백엔드", "디자인"];

export default function DocEditorPage() {
  const navigate = useNavigate();
  const { teamId, docId } = useParams();

  const [docName, setDocName] = useState("스토리보드");
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

  // 이미지 업로드 처리 (파일 객체 전달 시 백엔드 파이프라인 연동)
  const handleUploadImage = async (fileOrUrl) => {
    if (typeof fileOrUrl === "string") {
      handleUpdatePage({ imageUrl: fileOrUrl });
      return;
    }
    try {
      if (docId) {
        const uploadedUrl = await uploadWireframePipeline(
          docId,
          1,
          currentPage.pageId,
          fileOrUrl,
        );
        handleUpdatePage({ imageUrl: uploadedUrl });
      } else {
        const localUrl = URL.createObjectURL(fileOrUrl);
        handleUpdatePage({ imageUrl: localUrl });
      }
    } catch (err) {
      console.error("이미지 업로드 실패:", err);
      const localUrl = URL.createObjectURL(fileOrUrl);
      handleUpdatePage({ imageUrl: localUrl });
    }
  };

  // API 전송용 Payload 빌더
  const buildSavePayload = (summaryText = "최초 생성") => ({
    name: docName,
    teamId: teamId || null,
    status: "IN_PROGRESS",
    changeSummary: summaryText,
    pages: pages.map((p, idx) => ({
      pageNumber: idx + 1,
      screenName: p.screenName,
      screenId: p.screenId,
      pins: (p.pins || []).map((pin) => {
        const pinReqs = [];
        INITIAL_ROLES.forEach((role) => {
          const found = (p.requirements?.[role] || []).find(
            (r) => r.id === pin.id,
          );
          if (found && (found.item || found.detail)) {
            pinReqs.push({
              tabType: role,
              itemName: found.item,
              content: found.detail,
              isRequired: found.isRequired || false,
            });
          }
        });
        return {
          pinNumber: pin.number,
          tabType: "공통",
          xCoordinate: pin.x,
          yCoordinate: pin.y,
          requirements: pinReqs,
        };
      }),
    })),
  });

  // 임시저장 API 연동
  const handleTempSave = async () => {
    try {
      if (docId) {
        await autoSaveDocument(docId, 1, buildSavePayload("임시저장"));
        alert("임시저장되었습니다.");
      } else {
        alert("임시저장되었습니다.");
      }
    } catch (e) {
      console.error("임시저장 실패:", e);
      alert(e.message || "임시저장 실패");
    }
  };

  // 최종 저장 및 번역 요청 API 연동
  const handleFinalSave = async (selectedMembers = []) => {
    try {
      let currentDocId = docId;
      if (!currentDocId) {
        const res = await createDocument(teamId, buildSavePayload("최초 생성"));
        const data = res?.data || res;
        currentDocId = data?.documentId || data?.id;
      }

      const translations = (selectedMembers || [])
        .filter((m) => m.checked)
        .map((m) => ({ userId: m.id, targetLanguage: m.language }));

      if (currentDocId && translations.length > 0) {
        await requestTranslation(currentDocId, 1, translations);
      }

      setModalState({ isOpen: false, step: "exit" });
      alert("스토리보드가 성공적으로 저장되었습니다!");
      navigate(-1);
    } catch (e) {
      console.error("저장 실패:", e);
      alert(e.message || "저장에 실패했습니다.");
    }
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
            docName={docName}
            currVersion={1}
            mode="create"
            onBack={() => setModalState({ isOpen: true, step: "exit" })}
            onTempSave={handleTempSave}
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
                onUploadImage={handleUploadImage}
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
        docName={`${docName}_Version1`}
        onClose={() => setModalState({ isOpen: false, step: "exit" })}
        onConfirmExit={() => {
          setModalState({ isOpen: false, step: "exit" });
          navigate(-1);
        }}
        onNextStep={(nextStep) =>
          setModalState({ isOpen: true, step: nextStep })
        }
        onFinalSave={handleFinalSave}
      />
    </S.PageLayout>
  );
}
