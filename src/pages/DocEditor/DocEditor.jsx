import React, { useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import DocHeader from "./components/DocHeader";
import PageNavigator from "./components/PageNavigator";
import ScreenInfoForm from "./components/ScreenInfoForm";
import WireframeCanvas from "./components/WireframeCanvas";
import RequirementSection from "./components/RequirementSection";
import SaveFlowModals from "../../components/Modal/SaveFlowModals";
import {
  createDocument,
  saveDocument,
  autoSaveDocument,
  requestTranslation,
  uploadWireframePipeline,
  getDocumentDetail,
} from "../../api/documentApi";
import * as S from "./DocEditor.styles";

const INITIAL_ROLES = ["공통", "기획", "프론트", "백엔드", "디자인"];

const formatCurrentTime = (dateObj = new Date()) => {
  const d = new Date(dateObj);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}. ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

export default function DocEditorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { teamId: paramTeamId, docId: paramDocId } = useParams();

  const passedState = location.state || {};
  const teamId = paramTeamId || passedState.teamId;
  const [docId, setDocId] = useState(paramDocId || passedState.docId || null);
  const docName = passedState.name || "스토리보드";
  const docVersion = passedState.version ? Number(passedState.version) : 1;

  const [updatedAt, setUpdatedAt] = useState("");

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

  // 페이지별 실제 파일 객체 보관 (신규 작성 시 MinIO 업로드용)
  const pendingFilesRef = useRef({});

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

  // 이미지 선택 핸들러
  const handleUploadImage = async (tempUrl, rawFile) => {
    const file = rawFile || (typeof tempUrl !== "string" ? tempUrl : null);

    // 1. 화면 즉시 미리보기
    if (tempUrl && typeof tempUrl === "string") {
      handleUpdatePage({ imageUrl: tempUrl });
    }

    // 2. 파일 객체 보관
    if (file) {
      pendingFilesRef.current[activePageIndex] = file;
    }
  };

  const buildSavePayload = (summaryText = "최초 작성 저장") => ({
    status: "IN_PROGRESS",
    changeSummary: summaryText,
    pages: pages.map((p, idx) => ({
      pageNumber: idx + 1,
      screenName: p.screenName || "",
      screenId: p.screenId || "",
      pins: (p.pins || []).map((pin) => {
        const pinReqs = [];
        INITIAL_ROLES.forEach((role) => {
          const found = (p.requirements?.[role] || []).find(
            (r) => r.id === pin.id,
          );
          if (found && (found.item || found.detail)) {
            pinReqs.push({
              tabType: role,
              itemName: found.item || "",
              content: found.detail || "",
              isRequired: Boolean(found.isRequired),
            });
          }
        });
        return {
          pinNumber: pin.number,
          tabType: "공통",
          xCoordinate: Number(pin.x) || 0.0,
          yCoordinate: Number(pin.y) || 0.0,
          requirements: pinReqs,
        };
      }),
    })),
  });

  const handleTempSave = async () => {
    try {
      let currentDocId = docId;
      if (!currentDocId && teamId) {
        const res = await createDocument(teamId, {
          name: docName,
          language: passedState.language || "ko",
          version: docVersion,
        });
        const data = res?.data?.data || res?.data || res;
        currentDocId = data?.documentId || data?.id;
        if (currentDocId) setDocId(currentDocId);
      }

      if (currentDocId) {
        const res = await autoSaveDocument(
          currentDocId,
          docVersion,
          buildSavePayload("임시저장"),
        );
        const data = res?.data || res;
        if (data?.updatedAt) {
          setUpdatedAt(formatCurrentTime(data.updatedAt));
        } else {
          setUpdatedAt(formatCurrentTime());
        }
      } else {
        setUpdatedAt(formatCurrentTime());
      }
      alert("임시저장되었습니다.");
    } catch (e) {
      console.error("임시저장 실패:", e);
      setUpdatedAt(formatCurrentTime());
      alert(e.message || "임시저장되었습니다.");
    }
  };

  const handleSaveClick = () => {
    setModalState({ isOpen: true, step: "complete_confirm" });
  };

  // [핵심] 신규 문서 최종 저장 시 생성된 pageId로 MinIO 업로드 파이프라인 실행
  const handleFinalSave = async (selectedMembers = []) => {
    try {
      let currentDocId = docId;

      // 1. 문서 생성
      if (!currentDocId && teamId) {
        const createRes = await createDocument(teamId, {
          name: docName,
          language: passedState.language || "ko",
          version: docVersion,
        });
        const cData = createRes?.data?.data || createRes?.data || createRes;
        currentDocId = cData?.documentId || cData?.id;
        if (currentDocId) setDocId(currentDocId);
      }

      // 2. 전체 페이지 저장 (PUT)
      if (currentDocId) {
        await saveDocument(
          currentDocId,
          docVersion,
          buildSavePayload("최초 작성 저장"),
        );

        // 3. 서버에 등록된 pageId들을 받아와 보관된 파일 MinIO 업로드 실행
        try {
          const detailRes = await getDocumentDetail(currentDocId, docVersion);
          const detailData = detailRes?.data?.data || detailRes?.data || {};
          const serverPages = detailData.pages || [];

          for (let i = 0; i < serverPages.length; i++) {
            const sPage = serverPages[i];
            const file = pendingFilesRef.current[i];
            if (sPage?.id && file) {
              await uploadWireframePipeline(sPage.id, file);
            }
          }
        } catch (imgErr) {
          console.error("와이어프레임 이미지 MinIO 업로드 실패:", imgErr);
        }
      }

      // 4. 번역 요청
      const translations = (selectedMembers || [])
        .filter((m) => m.checked)
        .map((m) => ({
          userId: m.id,
          targetLanguage: m.language,
        }));

      setModalState({ isOpen: false, step: "exit" });

      if (currentDocId && translations.length > 0) {
        const transRes = await requestTranslation(
          currentDocId,
          docVersion,
          translations,
        );
        const transData =
          transRes?.data?.data || transRes?.data || transRes || {};
        const jobId = transData.jobId || transData.id || currentDocId;

        navigate("/trans", {
          state: {
            jobId,
            teamId,
            docId: currentDocId,
            version: docVersion,
            docName,
          },
        });
      } else {
        alert("문서가 성공적으로 저장되었습니다!");
        navigate(teamId ? `/teamp/${teamId}` : "/home");
      }
    } catch (e) {
      console.error("저장 및 번역 실패:", e);
      alert(e.message || "저장 또는 번역 요청에 실패했습니다.");
    }
  };

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
        {/* 상단 헤더 */}
        <S.HeaderWrapper>
          <DocHeader
            docName={docName}
            currVersion={docVersion}
            mode="create"
            updatedAt={updatedAt}
            onBack={() => setModalState({ isOpen: true, step: "exit" })}
            onTempSave={handleTempSave}
            onSave={handleSaveClick}
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

          {/* 우측 영역 */}
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
        teamId={teamId}
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
