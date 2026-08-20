import React, { useState, useEffect, useCallback, useRef } from "react";
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
  getDocumentChanges,
  saveDocument,
  autoSaveDocument,
  createNewVersion,
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
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
};

export default function DocEditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { teamId: paramTeamId, docId: paramDocId, documentId } = useParams();

  const passedState = location.state || {};
  const docId = paramDocId || documentId || passedState.docId;
  const initialVersion = passedState.version ? Number(passedState.version) : 1;
  const [teamId, setTeamId] = useState(
    paramTeamId ||
      passedState.teamId ||
      localStorage.getItem("currentTeamId") ||
      "",
  );

  const [documentInfo, setDocumentInfo] = useState({
    name: "스토리보드",
    updatedAt: "",
  });
  const [currentVersion, setCurrentVersion] = useState(initialVersion);
  const [activeRole, setActiveRole] = useState("공통");

  const [pages, setPages] = useState([createEmptyPage(1)]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [focusedPinId, setFocusedPinId] = useState(null);

  const pendingFilesRef = useRef({});

  const [summaryList, setSummaryList] = useState([]);
  const [selectedSummaryId, setSelectedSummaryId] = useState(null);

  const [isEditSummaryOpen, setIsEditSummaryOpen] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, step: "exit" });
  const [newVersionInfo, setNewVersionInfo] = useState({
    version: initialVersion + 1,
    description: "",
  });

  const fetchDoc = useCallback(async () => {
    if (!docId) return;
    try {
      const res = await getDocumentDetail(docId, currentVersion);
      const data = res?.data?.data || res?.data || res;
      if (!data) return;

      const fetchedTeamId =
        data.teamId ||
        data.teamProjectId ||
        data.team?.id ||
        data.teamProject?.id ||
        localStorage.getItem("currentTeamId") ||
        "";

      if (!teamId && fetchedTeamId) {
        setTeamId(fetchedTeamId);
      }

      setDocumentInfo({
        name: data.name || data.title || "스토리보드",
        updatedAt: data.updatedAt
          ? data.updatedAt.replace("T", " ").substring(0, 19)
          : "",
      });

      const fetchedVersion = data.version
        ? Number(data.version)
        : currentVersion;
      setCurrentVersion(fetchedVersion);
      setNewVersionInfo({
        version: fetchedVersion + 1,
        description: "",
      });

      if (data.pages && data.pages.length > 0) {
        const formattedPages = data.pages.map((p, idx) => {
          const pinMap = {
            공통: [],
            기획: [],
            프론트: [],
            백엔드: [],
            디자인: [],
          };

          const reqMap = {
            공통: [],
            기획: [],
            프론트: [],
            백엔드: [],
            디자인: [],
          };

          (p.pins || []).forEach((pin) => {
            const pinTab = pin.tabType || "공통";
            const targetTab = pinMap[pinTab] ? pinTab : "공통";

            const pinId = pin.id || pin.pinNumber;

            pinMap[targetTab].push({
              id: pinId,
              number: 0,
              x: Number(pin.xCoordinate) || 0,
              y: Number(pin.yCoordinate) || 0,
            });

            const reqList = pin.requirements || [];
            if (reqList.length > 0) {
              reqList.forEach((req) => {
                const reqTab = req.tabType || targetTab;
                if (reqMap[reqTab]) {
                  reqMap[reqTab].push({
                    id: pinId,
                    reqId: req.id || null,
                    number: 0,
                    item: req.itemName || "",
                    detail: req.content || "",
                    isRequired: Boolean(req.isRequired),
                  });
                }
              });
            } else {
              reqMap[targetTab].push({
                id: pinId,
                reqId: null,
                number: 0,
                item: "",
                detail: "",
                isRequired: false,
              });
            }
          });

          // 탭별 핀 번호 재정렬 (각 탭 독립적으로 1부터)
          const pinNumberLookup = {};
          INITIAL_ROLES.forEach((role) => {
            pinMap[role].forEach((pin, idx) => {
              pin.number = idx + 1;
              pinNumberLookup[pin.id] = pin.number;
            });
          });
          INITIAL_ROLES.forEach((role) => {
            reqMap[role].forEach((req) => {
              if (pinNumberLookup[req.id] !== undefined) {
                req.number = pinNumberLookup[req.id];
              }
            });
          });

          const imgUrl =
            p.wireframeImages?.[0]?.imageUrl ||
            p.wireframeImageUrl ||
            p.imageUrl ||
            "";

          const serverDevice =
            p.device ||
            p.deviceType ||
            (p.wireframeImages?.[0]?.displayWidth === 214
              ? "mobile"
              : "desktop");

          return {
            pageId: p.id,
            pageNumber: p.pageNumber || idx + 1,
            screenName: p.screenName || "",
            screenId: p.screenId || "",
            imageUrl: imgUrl,
            device: serverDevice,
            pins: pinMap,
            requirements: reqMap,
          };
        });
        setPages(formattedPages);
      } else {
        setPages([createEmptyPage(1)]);
      }

      try {
        const changeRes = await getDocumentChanges(docId, currentVersion);
        const changeData = changeRes?.data?.data || changeRes?.data || [];
        if (Array.isArray(changeData) && changeData.length > 0) {
          const formattedSummary = changeData.map((c, i) => ({
            id: c.id || i + 1,
            pageIndex: (c.pageNumber || 1) - 1,
            pageName: c.screenName || `페이지 ${c.pageNumber || 1}`,
            number: c.pinNumber || 1,
            pinNumber: c.pinNumber || 1,
            pinId: c.pinId,
            itemName: c.itemName || c.item || "-",
            previewContent: c.content || c.changeContent || c.detail || "-",
            author: c.authorName || c.modifiedBy || "작성자",
            date: c.updatedAt
              ? c.updatedAt.split("T")[0].replace(/-/g, ".")
              : formatCurrentTime(),
          }));
          setSummaryList(formattedSummary);
        }
      } catch (err) {}
    } catch (e) {
      console.error("문서 조회 실패:", e);
    }
  }, [docId, currentVersion, teamId]);

  useEffect(() => {
    fetchDoc();
  }, [fetchDoc]);

  const buildSavePayload = (summaryText) => ({
    status: "IN_PROGRESS",
    changeSummary: summaryText || "",
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
              ...(found.reqId ? { id: found.reqId } : {}),
              tabType: role,
              itemName: found.item || "",
              content: found.detail || "",
              isRequired: Boolean(found.isRequired),
            });
          }

          allFlattenedPins.push({
            ...(pin.id && typeof pin.id === "number" && pin.id < 1000000000000
              ? { id: pin.id }
              : {}),
            pinNumber: pin.number,
            tabType: role,
            xCoordinate: Number(pin.x) || 0.0,
            yCoordinate: Number(pin.y) || 0.0,
            requirements: pinReqs,
          });
        });
      });

      return {
        ...(p.pageId && typeof p.pageId === "number" && p.pageId < 1000000000000
          ? { id: p.pageId }
          : {}),
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
      const res = await autoSaveDocument(
        docId,
        currentVersion,
        buildSavePayload("임시저장"),
      );
      const data = res?.data || res;
      setDocumentInfo((prev) => ({
        ...prev,
        updatedAt: data?.updatedAt
          ? data.updatedAt.replace("T", " ").substring(0, 19)
          : formatCurrentTime(),
      }));
      alert("임시저장되었습니다.");
    } catch (e) {
      console.error("임시저장 실패:", e);
      alert(e.message || "임시저장 실패");
    }
  };

  const handleFinalSaveWithTranslate = async (selectedMembers = []) => {
    try {
      let targetVersion = currentVersion;
      const willCreateNewVer =
        newVersionInfo.version &&
        Number(newVersionInfo.version) > currentVersion;

      if (willCreateNewVer) {
        try {
          const newVerRes = await createNewVersion(docId, currentVersion);
          const verData = newVerRes?.data?.data || newVerRes?.data || {};
          targetVersion = verData.version || Number(newVersionInfo.version);
        } catch (verErr) {
          targetVersion = Number(newVersionInfo.version) || currentVersion;
        }
      }

      await saveDocument(
        docId,
        targetVersion,
        buildSavePayload(newVersionInfo.description || "문서 수정 저장"),
      );

      try {
        const detailRes = await getDocumentDetail(docId, targetVersion);
        const detailData = detailRes?.data?.data || detailRes?.data || {};
        const serverPages = detailData.pages || [];

        for (let i = 0; i < serverPages.length; i++) {
          const sPage = serverPages[i];
          const newFile = pendingFilesRef.current[i];
          const dev = pages[i]?.device || "desktop";

          if (sPage?.id && newFile) {
            await uploadWireframePipeline(sPage.id, newFile, dev);
          }
        }
      } catch (imgErr) {
        console.error("새 이미지 업로드 중 오류:", imgErr);
      }

      // 🔥 Step 1: 한국어(ko)는 제외하고 번역 대상자만 필터링
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

      if (translations.length > 0) {
        const transRes = await requestTranslation(
          docId,
          targetVersion,
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
              docId,
              version: targetVersion,
              docName: documentInfo.name,
            },
          });
          return;
        }
      }

      alert(
        `${documentInfo.name} Version.${targetVersion} 저장이 완료되었습니다!`,
      );
      navigate(teamId ? `/teamp-leader/${teamId}` : "/home");
    } catch (e) {
      console.error("저장 및 번역 요청 실패:", e);
      alert(
        e.response?.data?.message ||
          e.message ||
          "저장 또는 번역 요청에 실패했습니다.",
      );
    }
  };

  const currentPage = pages[activePageIndex] || pages[0] || {};
  const currentTabPins = currentPage.pins?.[activeRole] || [];

  const handleUpdatePage = (updatedField) => {
    setPages((prev) =>
      prev.map((p, i) =>
        i === activePageIndex ? { ...p, ...updatedField } : p,
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
    const updatedReqs = {
      ...(currentPage.requirements || {}),
      [activeRole]: [
        ...roleReqs,
        {
          id: newPinId,
          number: newPinNumber,
          item: "",
          detail: "",
          isRequired: false,
        },
      ],
    };

    handleUpdatePage({
      pins: updatedPins,
      requirements: updatedReqs,
    });
    setFocusedPinId(newPin.id);
  };

  const handleDeletePin = (pinId) => {
    const rolePins = currentPage.pins?.[activeRole] || [];
    const filteredPins = rolePins
      .filter((p) => p.id !== pinId)
      .map((p, i) => ({ ...p, number: i + 1 }));

    const roleReqs = currentPage.requirements?.[activeRole] || [];
    const filteredReqs = roleReqs
      .filter((r) => r.id !== pinId)
      .map((r, i) => ({ ...r, number: i + 1 }));

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
    setSummaryList((prev) => prev.filter((s) => s.pinId !== pinId));
    setFocusedPinId(null);
  };

  const handleUpdateRequirement = (role, reqId, field, value) => {
    const updatedReqs = { ...(currentPage.requirements || {}) };
    const list = updatedReqs[role] || [];
    let updatedItem = null;

    updatedReqs[role] = list.map((item) => {
      if (item.id !== reqId) return item;
      const nextItem =
        field === "all" ? { ...item, ...value } : { ...item, [field]: value };
      updatedItem = nextItem;
      return nextItem;
    });

    handleUpdatePage({ requirements: updatedReqs });

    if (field === "all" && updatedItem) {
      const rolePins = currentPage.pins?.[role] || [];
      const pinObj = rolePins.find((p) => p.id === reqId);
      const pinNumber = updatedItem.number || (pinObj ? pinObj.number : 1);
      const pageName =
        currentPage.screenName || `페이지 ${activePageIndex + 1}`;

      setSummaryList((prev) => {
        const existingIdx = prev.findIndex(
          (s) => s.pinId === reqId && s.role === role,
        );
        const summaryEntry = {
          id: reqId + "_" + role,
          role,
          pinId: reqId,
          pageIndex: activePageIndex,
          pageName: pageName,
          number: pinNumber,
          pinNumber: pinNumber,
          itemName: updatedItem.item || "-",
          item: updatedItem.item || "-",
          previewContent: updatedItem.detail || "-",
          content: updatedItem.detail || "-",
          author: "본인",
          date: formatCurrentTime(),
          updatedAt: formatCurrentTime(),
        };

        if (existingIdx >= 0) {
          const next = [...prev];
          next[existingIdx] = summaryEntry;
          return next;
        }
        return [summaryEntry, ...prev];
      });
    }
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
            if (item.role) setActiveRole(item.role);
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
                pins={currentTabPins}
                focusedPinId={focusedPinId}
                onChangeDevice={(device) => handleUpdatePage({ device })}
                onUploadImage={handleUploadImage}
                onAddPin={handleAddPin}
                onUpdatePinPos={(pinId, pos) => {
                  const rolePins = currentPage.pins?.[activeRole] || [];
                  const updatedPins = rolePins.map((p) =>
                    p.id === pinId ? { ...p, ...pos } : p,
                  );
                  handleUpdatePage({
                    pins: {
                      ...(currentPage.pins || {}),
                      [activeRole]: updatedPins,
                    },
                  });
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

      <EditSummaryModal
        isOpen={isEditSummaryOpen}
        currentVersion={currentVersion}
        summaryList={summaryList}
        onClose={() => setIsEditSummaryOpen(false)}
        onSubmit={({ version, description }) => {
          setNewVersionInfo({
            version: Number(version) || currentVersion + 1,
            description,
          });
          setIsEditSummaryOpen(false);
          setModalState({ isOpen: true, step: "language_select" });
        }}
      />

      <SaveFlowModals
        isOpen={modalState.isOpen}
        currentStep={modalState.step}
        teamId={teamId}
        docName={`${documentInfo.name} Version.${newVersionInfo.version || currentVersion + 1}`}
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
