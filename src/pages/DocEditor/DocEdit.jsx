import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
  uploadWireframePipeline,
} from "../../api/documentApi";
import * as S from "./DocEditor.styles";

const INITIAL_ROLES = ["공통", "기획", "프론트", "백엔드", "디자인"];

const createEmptyPage = (pageNumber = 1) => ({
  pageId: Date.now() + Math.random(),
  pageNumber,
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
});

export default function DocEditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { docId: paramDocId } = useParams();

  // 1. TeamProject에서 넘겨준 state 정보 (선택된 버전, docId)
  const passedState = location.state || {};
  const docId = paramDocId || passedState.docId;
  const initialVersion = passedState.version ? Number(passedState.version) : 1;

  const [documentInfo, setDocumentInfo] = useState({
    name: "스토리보드",
    updatedAt: "",
  });
  const [currentVersion, setCurrentVersion] = useState(initialVersion);
  const [pages, setPages] = useState([createEmptyPage(1)]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [focusedPinId, setFocusedPinId] = useState(null);
  const [selectedSummaryId, setSelectedSummaryId] = useState(null);
  const [summaryList, setSummaryList] = useState([]);
  const [isEditSummaryOpen, setIsEditSummaryOpen] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, step: "exit" });
  const [newVersionInfo, setNewVersionInfo] = useState({
    version: initialVersion,
    description: "",
  });

  // 2. 문서 상세 데이터 조회 (넘어온 최신 버전 기준)
  const fetchDoc = useCallback(async () => {
    if (!docId) return;
    try {
      const res = await getDocumentDetail(docId, currentVersion);
      const data = res?.data || res;
      if (!data) return;

      setDocumentInfo({
        name: data.name || data.title || "스토리보드",
        updatedAt: data.updatedAt
          ? data.updatedAt.replace("T", " ").substring(0, 19)
          : "",
      });

      // 서버 데이터의 버전이 존재하면 동기화
      const fetchedVersion = data.version || currentVersion;
      setCurrentVersion(fetchedVersion);

      if (data.pages && data.pages.length > 0) {
        const formattedPages = data.pages.map((p, idx) => {
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
            pageId: p.id || Date.now() + idx,
            pageNumber: p.pageNumber || idx + 1,
            screenName: p.screenName || "",
            screenId: p.screenId || "",
            imageUrl: p.wireframeImages?.[0]?.imageUrl || "",
            device: "desktop",
            pins,
            requirements: reqMap,
          };
        });
        setPages(formattedPages);
      } else {
        setPages([createEmptyPage(1)]);
      }
    } catch (e) {
      console.error("문서 조회 실패:", e);
    }
  }, [docId, currentVersion]);

  useEffect(() => {
    fetchDoc();
  }, [fetchDoc]);

  // 3. 서버 전송용 Payload 빌더 (5개 직무 탭 독립 분리)
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

  // 4. 임시 저장
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

  // 5. 최종 저장 & 번역 완료
  const handleFinalSaveWithTranslate = async (selectedMembers) => {
    try {
      await saveDocument(
        docId,
        currentVersion,
        buildSavePayload(newVersionInfo.description || "문서 저장"),
      );
      const translations = (selectedMembers || [])
        .filter((m) => m.checked)
        .map((m) => ({ userId: m.id, targetLanguage: m.language }));

      if (translations.length > 0) {
        await requestTranslation(docId, currentVersion, translations);
      }
      setModalState({ isOpen: false, step: "exit" });
      alert(
        `${documentInfo.name}_Version.${currentVersion} 저장이 완료되었습니다.`,
      );
      navigate(-1);
    } catch (e) {
      alert(e.message || "저장 실패");
    }
  };

  const currentPage = pages[activePageIndex] || pages[0] || {};

  const handleUpdatePage = (updatedField) => {
    setPages((prev) =>
      prev.map((p, i) =>
        i === activePageIndex ? { ...p, ...updatedField } : p,
      ),
    );
  };

  const handleUploadImage = async (fileOrUrl) => {
    if (typeof fileOrUrl === "string") {
      handleUpdatePage({ imageUrl: fileOrUrl });
      return;
    }
    try {
      const pageId = currentPage.pageId;
      const uploadedUrl = await uploadWireframePipeline(
        docId,
        currentVersion,
        pageId,
        fileOrUrl,
      );
      handleUpdatePage({ imageUrl: uploadedUrl });
    } catch (err) {
      console.error("이미지 업로드 실패:", err);
      const localUrl = URL.createObjectURL(fileOrUrl);
      handleUpdatePage({ imageUrl: localUrl });
    }
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

  const handleUpdateRequirement = (role, reqId, field, value) => {
    const updatedReqs = { ...(currentPage.requirements || {}) };
    const list = updatedReqs[role] || [];
    updatedReqs[role] = list.map((item) => {
      if (item.id !== reqId) return item;
      if (field === "all") return { ...item, ...value };
      return { ...item, [field]: value };
    });
    handleUpdatePage({ requirements: updatedReqs });
  };

  const isInitialCreate = currentVersion === 1 && summaryList.length === 0;

  return (
    <S.PageLayout>
      <S.ContentContainer>
        {/* 상단바: 전달된 currentVersion 값 적용 */}
        <S.HeaderWrapper>
          <DocHeader
            docName={documentInfo.name}
            currVersion={currentVersion}
            mode={isInitialCreate ? "create" : "edit"}
            updatedAt={documentInfo.updatedAt}
            onBack={() => setModalState({ isOpen: true, step: "exit" })}
            onTempSave={handleTempSave}
            onSave={() => {
              if (isInitialCreate) {
                setModalState({ isOpen: true, step: "complete_confirm" });
              } else {
                setIsEditSummaryOpen(true);
              }
            }}
          />
        </S.HeaderWrapper>

        {/* 2버전 이상일 때 수정사항 요약 테이블 */}
        {!isInitialCreate && (
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
        )}

        <S.MainSection>
          {/* 좌측: 페이지 탭 + 화면정보 + 와이어프레임 */}
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
                  setPages([...pages, createEmptyPage(pages.length + 1)]);
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
                onUploadImage={handleUploadImage}
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

          {/* 우측: 요구사항 작성 영역 */}
          <S.RightColumn>
            <S.RightBox>
              <RequirementSection
                mode={isInitialCreate ? "create" : "edit"}
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
        docName={`${documentInfo.name}_Version.${currentVersion}`}
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
