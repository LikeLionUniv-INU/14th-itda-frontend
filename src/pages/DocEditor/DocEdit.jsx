import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DocHeader from "./components/DocHeader";
import SummarySection from "./components/SummarySection";
import PageNavigator from "./components/PageNavigator";
import ScreenInfoForm from "./components/ScreenInfoForm";
import WireframeCanvas from "./components/WireframeCanvas";
import RequirementSection from "./components/RequirementSection";
import EditSummaryModal from "../../components/Modal/EditSummaryModal";
import SaveFlowModals from "../../components/Modal/SaveFlowModals";
import {
  getDocumentDetail,
  saveDocument,
  autoSaveDocument,
  requestTranslation,
} from "../../services/documentApi";
import * as S from "./DocEditor.styles";

const INITIAL_ROLES = ["공통", "기획", "프론트", "백엔드", "디자인"];

export default function DocEditPage() {
  const navigate = useNavigate();
  const { docId } = useParams();

  const [documentInfo, setDocumentInfo] = useState({
    name: "스토리보드",
    updatedAt: "",
  });
  const [currentVersion, setCurrentVersion] = useState(1);
  const [pages, setPages] = useState([]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [focusedPinId, setFocusedPinId] = useState(null);
  const [selectedSummaryId, setSelectedSummaryId] = useState(null);
  const [summaryList, setSummaryList] = useState([]);
  const [isEditSummaryOpen, setIsEditSummaryOpen] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, step: "exit" });
  const [newVersionInfo, setNewVersionInfo] = useState({
    version: 1,
    description: "",
  });

  // 1. 문서 상세 조회 (API)
  const fetchDoc = useCallback(async () => {
    if (!docId) return;
    try {
      const res = await getDocumentDetail(docId, currentVersion);
      const data = res.data;
      setDocumentInfo({ name: data.name, updatedAt: data.updatedAt });
      setCurrentVersion(data.version);

      if (data.pages?.length > 0) {
        const formattedPages = data.pages.map((p) => {
          const reqMap = {
            공통: [],
            기획: [],
            프론트: [],
            백엔드: [],
            디자인: [],
          };
          const pins = (p.pins || []).map((pin) => {
            (pin.requirements || []).forEach((r) => {
              const tab = r.tabType || "공통";
              if (reqMap[tab]) {
                reqMap[tab].push({
                  id: pin.id,
                  reqId: r.id,
                  number: pin.pinNumber,
                  item: r.itemName || "",
                  detail: r.content || "",
                  isRequired: r.isRequired || false,
                });
              }
            });
            return {
              id: pin.id,
              number: pin.pinNumber,
              x: pin.xCoordinate,
              y: pin.yCoordinate,
            };
          });
          return {
            pageId: p.id,
            screenName: p.screenName || "",
            screenId: p.screenId || "",
            imageUrl: p.wireframeImages?.[0]?.imageUrl || "",
            device: "desktop",
            pins,
            requirements: reqMap,
          };
        });
        setPages(formattedPages);
      }
    } catch (e) {
      alert(e.message || "문서 조회 실패");
    }
  }, [docId, currentVersion]);

  useEffect(() => {
    fetchDoc();
  }, [fetchDoc]);

  // 2. 서버 전송용 Payload 빌더
  const buildSavePayload = (summaryText) => ({
    status: "IN_PROGRESS",
    changeSummary: summaryText || "",
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

  // 3. 임시 저장 (API)
  const handleTempSave = async () => {
    try {
      await autoSaveDocument(
        docId,
        currentVersion,
        buildSavePayload("임시저장"),
      );
      alert("임시저장되었습니다.");
    } catch (e) {
      alert(e.message || "임시저장 실패");
    }
  };

  // 4. 최종 저장 & 번역 완료 (API)
  const handleFinalSaveWithTranslate = async (selectedMembers) => {
    try {
      await saveDocument(
        docId,
        currentVersion,
        buildSavePayload(newVersionInfo.description),
      );
      const translations = (selectedMembers || [])
        .filter((m) => m.checked)
        .map((m) => ({ userId: m.id, targetLanguage: m.language }));

      if (translations.length > 0) {
        await requestTranslation(docId, currentVersion, translations);
      }
      setModalState({ isOpen: false, step: "exit" });
      alert(
        `스토리보드 Version.${currentVersion} 저장 및 번역 요청이 완료되었습니다.`,
      );
      navigate(-1);
    } catch (e) {
      alert(e.message || "저장 실패");
    }
  };

  const currentPage = pages[activePageIndex] || {};

  const handleUpdatePage = (updatedField) => {
    setPages((prev) =>
      prev.map((p, i) =>
        i === activePageIndex ? { ...p, ...updatedField } : p,
      ),
    );
  };

  const handleAddPin = ({ x, y }) => {
    const currentPins = currentPage.pins || [];
    const newPinId = Date.now();
    const newPinNumber = currentPins.length + 1;
    const newPin = { id: newPinId, number: newPinNumber, x, y };
    const updatedReqs = { ...(currentPage.requirements || {}) };
    INITIAL_ROLES.forEach((role) => {
      updatedReqs[role] = [
        ...(updatedReqs[role] || []),
        {
          id: newPinId,
          number: newPinNumber,
          item: "",
          detail: "",
          isRequired: false,
        },
      ];
    });
    handleUpdatePage({
      pins: [...currentPins, newPin],
      requirements: updatedReqs,
    });
    setFocusedPinId(newPin.id);
  };

  const handleDeletePin = (pinId) => {
    const filteredPins = (currentPage.pins || [])
      .filter((p) => p.id !== pinId)
      .map((p, i) => ({ ...p, number: i + 1 }));
    const updatedReqs = { ...(currentPage.requirements || {}) };
    INITIAL_ROLES.forEach((role) => {
      updatedReqs[role] = (updatedReqs[role] || [])
        .filter((r) => r.id !== pinId)
        .map((r, i) => ({ ...r, number: i + 1 }));
    });
    handleUpdatePage({ pins: filteredPins, requirements: updatedReqs });
    setSummaryList((prev) => prev.filter((s) => s.pinId !== pinId));
    setFocusedPinId(null);
  };

  const handleUpdateRequirement = (
    role,
    reqId,
    field,
    value,
    syncAll = false,
  ) => {
    const updatedReqs = { ...(currentPage.requirements || {}) };
    const targetRoles = syncAll ? INITIAL_ROLES : [role];
    targetRoles.forEach((r) => {
      updatedReqs[r] = (updatedReqs[r] || []).map((item) => {
        if (item.id !== reqId) return item;
        return field === "all"
          ? { ...item, ...value }
          : { ...item, [field]: value };
      });
    });
    handleUpdatePage({ requirements: updatedReqs });
  };

  return (
    <S.PageLayout>
      <S.ContentContainer>
        <S.HeaderWrapper>
          <DocHeader
            docName={documentInfo.name}
            currVersion={currentVersion}
            mode="edit"
            updatedAt={documentInfo.updatedAt}
            onBack={() => setModalState({ isOpen: true, step: "exit" })}
            onTempSave={handleTempSave}
            onSave={() => setIsEditSummaryOpen(true)}
          />
        </S.HeaderWrapper>

        <SummarySection
          summaryList={summaryList}
          selectedSummaryId={selectedSummaryId}
          onSelectSummary={(item) => {
            setSelectedSummaryId(item.id);
            if (item.pageIndex !== undefined)
              setActivePageIndex(item.pageIndex);
            if (item.pinId) setFocusedPinId(item.pinId);
          }}
        />

        <S.MainSection>
          <S.LeftColumn>
            <S.PageNavWrapper>
              <PageNavigator
                pages={pages}
                activePageIndex={activePageIndex}
                onSelectPage={(i) => {
                  setActivePageIndex(i);
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
                onChangeScreenName={(screenName) =>
                  handleUpdatePage({ screenName })
                }
                onChangeScreenId={(screenId) => handleUpdatePage({ screenId })}
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
                onUpdatePinPos={(pinId, pos) => {
                  const updatedPins = (currentPage.pins || []).map((p) =>
                    p.id === pinId ? { ...p, ...pos } : p,
                  );
                  handleUpdatePage({ pins: updatedPins });
                }}
                onFocusPin={(id) => setFocusedPinId(id)}
                onDeletePin={handleDeletePin}
              />
            </S.LeftBox>
          </S.LeftColumn>

          <S.RightColumn>
            <S.RightBox>
              <RequirementSection
                mode="edit"
                requirements={currentPage.requirements || {}}
                focusedPinId={focusedPinId}
                onUpdateRequirement={handleUpdateRequirement}
                onFocusPin={(id) => setFocusedPinId(id)}
              />
            </S.RightBox>
          </S.RightColumn>
        </S.MainSection>
      </S.ContentContainer>

      <EditSummaryModal
        isOpen={isEditSummaryOpen}
        currentVersion={currentVersion}
        summaryList={summaryList}
        onClose={() => setIsEditSummaryOpen(false)}
        onSubmit={({ version, description }) => {
          setNewVersionInfo({ version, description });
          setIsEditSummaryOpen(false);
          setModalState({ isOpen: true, step: "language_select" });
        }}
      />

      <SaveFlowModals
        isOpen={modalState.isOpen}
        currentStep={modalState.step}
        docName={`${documentInfo.name}_Version${currentVersion}`}
        onClose={() => setModalState({ isOpen: false, step: "exit" })}
        onConfirmExit={() => {
          setModalState({ isOpen: false, step: "exit" });
          navigate(-1);
        }}
        onNextStep={(step) => setModalState({ isOpen: true, step })}
        onFinalSave={handleFinalSaveWithTranslate}
      />
    </S.PageLayout>
  );
}
