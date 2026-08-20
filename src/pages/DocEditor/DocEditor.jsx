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

const createInitialPage = (pageId = 1) => ({
  pageId,
  screenName: "",
  screenId: "",
  imageUrl: "",
  device: "desktop",
  pins: {
    공통: [],
    기획: [],
    프론트: [],
    백엔드: [],
    디자인: [],
  },
  requirements: {
    공통: [],
    기획: [],
    프론트: [],
    백엔드: [],
    디자인: [],
  },
});

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
  const [activeRole, setActiveRole] = useState("공통");

  const [pages, setPages] = useState([createInitialPage(1)]);
  const pendingFilesRef = useRef({});
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [focusedPinId, setFocusedPinId] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, step: "exit" });

  const currentPage = pages[activePageIndex] || pages[0] || {};
  const currentTabPins = currentPage.pins?.[activeRole] || [];

  const handleUpdatePage = (updatedField) => {
    setPages((prev) =>
      prev.map((p, idx) =>
        idx === activePageIndex ? { ...p, ...updatedField } : p,
      ),
    );
  };

  const handleUploadImage = (tempUrl, rawFile) => {
    const fileToUpload =
      rawFile || (typeof tempUrl !== "string" ? tempUrl : null);

    if (tempUrl && typeof tempUrl === "string") {
      handleUpdatePage({ imageUrl: tempUrl });
    }

    if (fileToUpload) {
      pendingFilesRef.current[activePageIndex] = fileToUpload;
    }
  };

  const buildSavePayload = (summaryText = "최초 작성 저장") => ({
    status: "IN_PROGRESS",
    changeSummary: summaryText,
    pages: pages.map((p, idx) => {
      const allFlattenedPins = [];

      INITIAL_ROLES.forEach((role) => {
        const rolePins = p.pins?.[role] || [];
        const roleReqs = p.requirements?.[role] || [];

        rolePins.forEach((pin) => {
          const found = roleReqs.find((r) => r.id === pin.id);
          const pinReqs = [];
          if (found && (found.item || found.detail)) {
            pinReqs.push({
              tabType: role,
              itemName: found.item || "",
              content: found.detail || "",
              isRequired: Boolean(found.isRequired),
            });
          }

          allFlattenedPins.push({
            pinNumber: pin.number,
            tabType: role,
            xCoordinate: Number(pin.x) || 0.0,
            yCoordinate: Number(pin.y) || 0.0,
            requirements: pinReqs,
          });
        });
      });

      return {
        pageNumber: idx + 1,
        screenName: p.screenName || "",
        screenId: p.screenId || "",
        device: p.device || "desktop",
        pins: allFlattenedPins,
      };
    }),
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
        setUpdatedAt(
          data?.updatedAt
            ? formatCurrentTime(data.updatedAt)
            : formatCurrentTime(),
        );
      }
      alert("임시저장되었습니다.");
    } catch (e) {
      console.error("임시저장 실패:", e);
      alert(e.message || "임시저장 실패");
    }
  };

  const handleSaveClick = () => {
    setModalState({ isOpen: true, step: "complete_confirm" });
  };

  const handleFinalSave = async (selectedMembers = []) => {
    try {
      let currentDocId = docId;

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

      if (currentDocId) {
        await saveDocument(
          currentDocId,
          docVersion,
          buildSavePayload("최초 작성 저장"),
        );

        try {
          const detailRes = await getDocumentDetail(currentDocId, docVersion);
          const detailData = detailRes?.data?.data || detailRes?.data || {};
          const serverPages = detailData.pages || [];

          for (let i = 0; i < serverPages.length; i++) {
            const sPage = serverPages[i];
            const file = pendingFilesRef.current[i];
            const dev = pages[i]?.device || "desktop";
            if (sPage?.id && file) {
              await uploadWireframePipeline(sPage.id, file, dev);
            }
          }
        } catch (imgErr) {
          console.error("와이어프레임 MinIO 업로드 중 오류:", imgErr);
        }
      }

      // 🔥 Step 1 명세서 매핑: 한국어(ko)는 제외하고 실제 번역 대상만 추출
      const validMembers = Array.isArray(selectedMembers)
        ? selectedMembers.filter((m) => m.checked !== false)
        : [];

      const translations = validMembers
        .map((m) => ({
          userId: Number(m.userId || m.id),
          targetLanguage: String(m.targetLanguage || m.language || "en")
            .toLowerCase()
            .trim(),
        }))
        .filter(
          (t) => t.userId && !isNaN(t.userId) && t.targetLanguage !== "ko",
        );

      setModalState({ isOpen: false, step: "exit" });

      // 🔥 번역 요청 후 발급된 진짜 jobId를 전달
      if (currentDocId && translations.length > 0) {
        const transRes = await requestTranslation(
          currentDocId,
          docVersion,
          translations,
        );
        const transData =
          transRes?.data?.data || transRes?.data || transRes || {};
        const realJobId = transData.jobId || transData.id;

        if (realJobId) {
          navigate("/trans", {
            state: {
              jobId: realJobId,
              teamId,
              docId: currentDocId,
              version: docVersion,
              docName,
            },
          });
          return;
        }
      }

      alert("문서가 성공적으로 저장되었습니다!");
      navigate(teamId ? `/teamp-leader/${teamId}` : "/home");
    } catch (e) {
      console.error("저장 및 번역 실패:", e);
      alert(
        e.response?.data?.message ||
          e.message ||
          "저장 또는 번역 요청에 실패했습니다.",
      );
    }
  };

  const handleAddPin = ({ x, y }) => {
    const rolePins = currentPage.pins?.[activeRole] || [];
    const newPinId = Date.now();
    const newPinNumber = rolePins.length + 1;
    const newPin = { id: newPinId, number: newPinNumber, x, y };

    const updatedPins = {
      ...(currentPage.pins || {}),
      [activeRole]: [...rolePins, newPin],
    };

    const roleReqs = currentPage.requirements?.[activeRole] || [];
    const updatedRequirements = {
      ...(currentPage.requirements || {}),
      [activeRole]: [
        ...roleReqs,
        {
          id: newPinId,
          number: newPinNumber,
          item: "",
          detail: "",
        },
      ],
    };

    handleUpdatePage({
      pins: updatedPins,
      requirements: updatedRequirements,
    });
    setFocusedPinId(newPin.id);
  };

  const handleUpdatePinPos = (pinId, { x, y }) => {
    const rolePins = currentPage.pins?.[activeRole] || [];
    const updatedRolePins = rolePins.map((p) =>
      p.id === pinId ? { ...p, x, y } : p,
    );

    handleUpdatePage({
      pins: {
        ...(currentPage.pins || {}),
        [activeRole]: updatedRolePins,
      },
    });
  };

  const handleDeletePin = (pinId) => {
    const rolePins = currentPage.pins?.[activeRole] || [];
    const filteredPins = rolePins
      .filter((p) => p.id !== pinId)
      .map((p, idx) => ({ ...p, number: idx + 1 }));

    const roleReqs = currentPage.requirements?.[activeRole] || [];
    const filteredReqs = roleReqs
      .filter((r) => r.id !== pinId)
      .map((r, idx) => ({ ...r, number: idx + 1 }));

    handleUpdatePage({
      pins: {
        ...(currentPage.pins || {}),
        [activeRole]: filteredPins,
      },
      requirements: {
        ...(currentPage.requirements || {}),
        [activeRole]: filteredReqs,
      },
    });
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
                  setPages([...pages, createInitialPage(Date.now())]);
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
                pins={currentTabPins}
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
                activeRole={activeRole}
                onChangeRole={(role) => {
                  setActiveRole(role);
                  setFocusedPinId(null);
                }}
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
