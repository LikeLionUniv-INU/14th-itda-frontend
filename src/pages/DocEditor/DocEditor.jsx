import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

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
  const location = useLocation();
  const { teamId: paramTeamId, docId: paramDocId } = useParams();

  // 1. TeamProject에서 전달받은 문서 정보 (state 우선 처리)
  const passedState = location.state || {};
  const teamId = paramTeamId || passedState.teamId;
  const docId = paramDocId || passedState.docId;
  const docName = passedState.name || "스토리보드";
  const docVersion = passedState.version || 1;

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

  const currentPage = pages[activePageIndex] || pages[0] || {};

  const handleUpdatePage = (updatedField) => {
    setPages((prev) =>
      prev.map((p, idx) =>
        idx === activePageIndex ? { ...p, ...updatedField } : p,
      ),
    );
  };

  // 이미지 업로드 처리
  const handleUploadImage = async (fileOrUrl) => {
    if (typeof fileOrUrl === "string") {
      handleUpdatePage({ imageUrl: fileOrUrl });
      return;
    }
    try {
      if (docId) {
        const uploadedUrl = await uploadWireframePipeline(
          docId,
          docVersion,
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

  // Payload 빌더 (5개 직무 탭 각각 분리하여 생성)
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
              isRequired: false,
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

  // 임시저장
  const handleTempSave = async () => {
    try {
      if (docId) {
        await autoSaveDocument(docId, docVersion, buildSavePayload("임시저장"));
      }
      alert("임시저장되었습니다.");
    } catch (e) {
      console.error("임시저장 실패:", e);
      alert(e.message || "임시저장 실패");
    }
  };

  // 최종 저장 및 번역 요청
  const handleFinalSave = async (selectedMembers = []) => {
    try {
      let currentDocId = docId;
      if (!currentDocId && teamId) {
        const res = await createDocument(teamId, buildSavePayload("최초 생성"));
        const data = res?.data || res;
        currentDocId = data?.documentId || data?.id;
      }

      const translations = (selectedMembers || [])
        .filter((m) => m.checked)
        .map((m) => ({ userId: m.id, targetLanguage: m.language }));

      if (currentDocId && translations.length > 0) {
        await requestTranslation(currentDocId, docVersion, translations);
      }

      setModalState({ isOpen: false, step: "exit" });
      alert("문서가 성공적으로 저장되었습니다!");
      navigate(teamId ? `/teamp/${teamId}` : -1);
    } catch (e) {
      console.error("저장 실패:", e);
      alert(e.message || "저장에 실패했습니다.");
    }
  };

  // 핀 추가 시 각 직무 탭에 슬롯 생성 (초기값 빈 문자열)
  const handleAddPin = ({ x, y }) => {
    const currentPins = currentPage.pins || [];
    const newPinId = Date.now();
    const newPinNumber = currentPins.length + 1;
    const newPin = { id: newPinId, number: newPinNumber, x, y };

    const updatedRequirements = { ...(currentPage.requirements || {}) };
    INITIAL_ROLES.forEach((role) => {
      updatedRequirements[role] = [
        ...(updatedRequirements[role] || []),
        {
          id: newPinId,
          number: newPinNumber,
          item: "",
          detail: "",
        },
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

  // 핀 삭제
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

  // 요구사항 직무별 독립 수정 (선택된 role만 개별 수정)
  const handleUpdateRequirement = (role, reqId, field, value) => {
    const updatedRequirements = { ...(currentPage.requirements || {}) };
    const list = updatedRequirements[role] || [];

    updatedRequirements[role] = list.map((item) => {
      if (item.id !== reqId) return item;
      if (field === "all") return { ...item, ...value };
      return { ...item, [field]: value };
    });

    handleUpdatePage({ requirements: updatedRequirements });
  };

  return (
    <S.PageLayout>
      <S.ContentContainer>
        {/* 상단 헤더: 제목 및 임시저장/저장 버튼 노출 */}
        <S.HeaderWrapper>
          <DocHeader
            docName={docName}
            currVersion={docVersion}
            mode="create"
            onBack={() => setModalState({ isOpen: true, step: "exit" })}
            onTempSave={handleTempSave}
            onSave={() =>
              setModalState({ isOpen: true, step: "complete_confirm" })
            }
          />
        </S.HeaderWrapper>

        <S.MainSection>
          {/* 좌측 영역 */}
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

          {/* 우측 요구사항 작성 영역 */}
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

      {/* 저장 및 나가기 모달 플로우 */}
      <SaveFlowModals
        isOpen={modalState.isOpen}
        currentStep={modalState.step}
        docName={`${docName}_Version.${docVersion}`}
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
