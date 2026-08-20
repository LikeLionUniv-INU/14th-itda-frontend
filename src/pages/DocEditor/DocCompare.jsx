import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import DocHeader from "./components/DocHeader";
import PageNavigator from "./components/PageNavigator";
import DiffSummarySection from "./components/DiffSummarySection";
import DiffScreenInfo from "./components/DiffScreenInfo";
import DiffWireframeCanvas from "./components/DiffWireframeCanvas";
import DiffRequirementSection from "./components/DiffRequirementSection";

import {
  getDocumentDetail,
  getDocumentChanges,
  getDocumentVersions,
  confirmChange,
} from "../../api/documentApi";
import * as S from "./DocCompare.styles";

// 백엔드 changes의 JSON 문자열 파싱 헬퍼
const safeJsonParse = (str) => {
  if (!str) return null;
  try {
    return typeof str === "string" ? JSON.parse(str) : str;
  } catch (e) {
    return str;
  }
};

// 기본 빈 페이지 템플릿
const createEmptyComparePage = (pageNumber = 1) => ({
  pageId: Date.now() + Math.random(),
  pageNumber,
  prevScreenName: "",
  prevScreenId: "",
  currScreenName: "",
  currScreenId: "",
  isScreenInfoModified: false,
  device: "desktop",
  isImageModified: false,
  prevImageUrl: "",
  currImageUrl: "",
  prevPins: [],
  currPins: [],
  requirements: {
    공통: [],
    기획: [],
    프론트: [],
    백엔드: [],
    디자인: [],
  },
});

export default function DocComparePage() {
  const { docId: paramDocId, documentId } = useParams();
  const docId = paramDocId || documentId;
  const navigate = useNavigate();
  const location = useLocation();

  const passedState = location.state || {};
  const targetVersion = passedState.version
    ? Number(passedState.version)
    : null;

  const [docInfo, setDocInfo] = useState({
    docName: "스토리보드",
    prevVersion: 1,
    currVersion: 1,
    updatedAt: "",
  });

  const [summaryList, setSummaryList] = useState([]);
  const [checkedIds, setCheckedIds] = useState([]);
  const [selectedSummaryId, setSelectedSummaryId] = useState(null);
  const [pages, setPages] = useState([createEmptyComparePage(1)]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [focusedPinId, setFocusedPinId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 문서 최신 데이터 및 변경사항(changes) diff 연동
  const fetchCompareData = useCallback(async () => {
    if (!docId) return;

    try {
      setIsLoading(true);

      // 1. 버전 결정 (state로 전달받은 버전이 없으면 버전 목록 API에서 최신 버전 확인)
      let currentVer = targetVersion;
      if (!currentVer) {
        try {
          const verRes = await getDocumentVersions(docId);
          const verList = verRes?.data?.data || verRes?.data || [];
          if (Array.isArray(verList) && verList.length > 0) {
            currentVer = Number(verList[verList.length - 1].version);
          }
        } catch (verErr) {
          console.warn("버전 목록 조회 실패:", verErr);
        }
      }
      currentVer = currentVer || 1;
      const prevVer = currentVer > 1 ? currentVer - 1 : 1;

      // 2. 현재 버전 문서 상세 데이터 조회 (버전 번호 포함 및 res.data.data 방어 파싱)
      const docRes = await getDocumentDetail(docId, currentVer);
      const docData = docRes?.data?.data || docRes?.data || {};

      setDocInfo({
        docName: docData?.name || docData?.title || "스토리보드",
        prevVersion: prevVer,
        currVersion: currentVer,
        updatedAt: docData?.updatedAt
          ? docData.updatedAt.replace("T", " ").substring(0, 19)
          : "",
      });

      // 3. 수정사항 목록 조회
      let formattedSummary = [];
      try {
        const changesRes = await getDocumentChanges(docId, currentVer);
        const changesData = changesRes?.data?.data || changesRes?.data || {};
        const changeList =
          changesData?.changes ||
          (Array.isArray(changesData) ? changesData : []);

        formattedSummary = changeList.map((ch) => {
          const afterParsed = safeJsonParse(ch.afterValue);
          const beforeParsed = safeJsonParse(ch.beforeValue);

          return {
            id: ch.id,
            pageIndex: ch.pageNumber ? ch.pageNumber - 1 : 0,
            pinId: ch.pinNumber,
            pageName: ch.screenName || `페이지 ${ch.pageNumber || 1}`,
            number: ch.pinNumber || 1,
            changeType: ch.changeType,
            itemName:
              ch.itemDescription ||
              afterParsed?.itemName ||
              beforeParsed?.itemName ||
              "-",
            previewContent:
              afterParsed?.content ||
              beforeParsed?.content ||
              afterParsed?.imageUrl ||
              "-",
            author:
              `${ch.modifiedByLastName || ""} ${ch.modifiedByFirstName || ""}`.trim() ||
              "수정자",
            date: ch.createdAt
              ? ch.createdAt.substring(0, 10).replace(/-/g, ".") + "."
              : "",
            confirmedByMe: ch.confirmedByMe || false,
            before: beforeParsed,
            after: afterParsed,
          };
        });

        setSummaryList(formattedSummary);

        const initialChecked = formattedSummary
          .filter((item) => item.confirmedByMe)
          .map((item) => item.id);
        setCheckedIds(initialChecked);
      } catch (err) {
        console.warn("변경사항 내역 조회 실패 또는 1버전 문서:", err);
      }

      // 4. 페이지 상세 정보 및 요구사항 전/후 diff 구성
      if (docData?.pages && docData.pages.length > 0) {
        const mappedPages = docData.pages.map((p, pIdx) => {
          const pageChanges = formattedSummary.filter(
            (ch) => ch.pageIndex === pIdx,
          );

          // 화면 정보 변경 여부 (SCREEN_MODIFIED)
          const screenChange = pageChanges.find(
            (ch) => ch.changeType === "SCREEN_MODIFIED",
          );
          const isScreenInfoModified = !screenChange;
          const prevScreenName = isScreenInfoModified
            ? screenChange.before?.screenName || p.screenName
            : p.screenName;
          const prevScreenId = isScreenInfoModified
            ? screenChange.before?.screenId || p.screenId
            : p.screenId;
          const currScreenName = p.screenName || "";
          const currScreenId = p.screenId || "";

          // 와이어프레임 이미지 변경 여부
          const imgChange = pageChanges.find((ch) =>
            ["IMAGE_MODIFIED", "IMAGE_ADDED", "IMAGE_DELETED"].includes(
              ch.changeType,
            ),
          );
          const isImageModified = !imgChange;
          const prevImageUrl = imgChange?.before?.imageUrl || "";
          const currImageUrl =
            p.wireframeImages?.[0]?.imageUrl ||
            p.wireframeImageUrl ||
            p.imageUrl ||
            imgChange?.after?.imageUrl ||
            "";

          // 핀 목록 구성
          const prevPins = [];
          const currPins = [];

          (p.pins || []).forEach((pin) => {
            const pinChange = pageChanges.find(
              (ch) => ch.pinId === pin.pinNumber,
            );
            let pinType = "curr";
            if (pinChange?.changeType === "REQUIREMENT_ADDED") {
              pinType = "added";
            }

            currPins.push({
              id: pin.id || pin.pinNumber,
              number: pin.pinNumber,
              x: Number(pin.xCoordinate) || 0,
              y: Number(pin.yCoordinate) || 0,
              pinType,
            });

            prevPins.push({
              id: pin.id || pin.pinNumber,
              number: pin.pinNumber,
              x: Number(pin.xCoordinate) || 0,
              y: Number(pin.yCoordinate) || 0,
            });
          });

          // 직무별 요구사항 3색 분기 (normal, modified, added)
          const requirements = {
            공통: [],
            기획: [],
            프론트: [],
            백엔드: [],
            디자인: [],
          };

          (p.pins || []).forEach((pin) => {
            (pin.requirements || []).forEach((req) => {
              const tab = req.tabType || "공통";
              const reqChange = pageChanges.find(
                (ch) =>
                  ch.pinId === pin.pinNumber &&
                  (ch.after?.itemName === req.itemName || !ch.after?.itemName),
              );

              let type = "normal";
              let prevItem = "";
              let prevDetail = "";

              if (reqChange?.changeType === "REQUIREMENT_MODIFIED") {
                type = "modified";
                prevItem = reqChange.before?.itemName || "";
                prevDetail = reqChange.before?.content || "";
              } else if (reqChange?.changeType === "REQUIREMENT_ADDED") {
                type = "added";
              }

              if (requirements[tab]) {
                requirements[tab].push({
                  id: pin.id || pin.pinNumber,
                  reqId: req.id,
                  number: pin.pinNumber,
                  type,
                  prevItem,
                  prevDetail,
                  currItem: req.itemName || "",
                  currDetail: req.content || "",
                });
              }
            });
          });

          return {
            pageId: p.id || Date.now() + pIdx,
            pageNumber: p.pageNumber || pIdx + 1,
            prevScreenName,
            prevScreenId,
            currScreenName,
            currScreenId,
            isScreenInfoModified,
            device: p.device || "desktop",
            isImageModified,
            prevImageUrl,
            currImageUrl,
            prevPins,
            currPins,
            requirements,
          };
        });

        setPages(mappedPages);
      } else {
        setPages([createEmptyComparePage(1)]);
      }
    } catch (error) {
      console.error("비교 데이터 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [docId, targetVersion]);

  useEffect(() => {
    fetchCompareData();
  }, [fetchCompareData]);

  const currentPage = pages[activePageIndex] || pages[0] || {};

  const handleSelectSummary = async (item) => {
    setSelectedSummaryId(item.id);

    if (!checkedIds.includes(item.id)) {
      setCheckedIds((prev) => [...prev, item.id]);
      try {
        await confirmChange(docId, docInfo.currVersion, item.id);
      } catch (e) {
        console.warn("확인 처리 안내:", e.message);
      }
    }

    if (item.pageIndex !== undefined && item.pageIndex !== activePageIndex) {
      setActivePageIndex(item.pageIndex);
    }
    if (item.pinId) {
      setFocusedPinId(item.pinId);
    }
  };

  return (
    <S.PageLayout>
      <S.ContentContainer>
        {/* 상단바 */}
        <DocHeader
          docName={docInfo.docName}
          currVersion={docInfo.currVersion}
          prevVersion={docInfo.prevVersion}
          mode="compare"
          updatedAt={docInfo.updatedAt}
          onBack={() => navigate(-1)}
        />

        {/* 상단 수정사항 요약 */}
        <DiffSummarySection
          summaryList={summaryList}
          checkedIds={checkedIds}
          selectedSummaryId={selectedSummaryId}
          onSelectSummary={handleSelectSummary}
        />

        {/* 본문 2단 영역 */}
        <S.MainSection>
          <S.LeftColumn>
            <S.PageNavWrapper>
              <PageNavigator
                pages={pages}
                activePageIndex={activePageIndex}
                onSelectPage={(index) => {
                  setActivePageIndex(index);
                  setFocusedPinId(null);
                  setSelectedSummaryId(null);
                }}
                isReadOnly={true}
              />
            </S.PageNavWrapper>

            <S.LeftBox>
              <DiffScreenInfo
                prevScreenName={currentPage.prevScreenName}
                prevScreenId={currentPage.prevScreenId}
                currScreenName={currentPage.currScreenName}
                currScreenId={currentPage.currScreenId}
                isModified={currentPage.isScreenInfoModified}
              />
              <S.Divider />
              <DiffWireframeCanvas
                device={currentPage.device}
                isImageModified={currentPage.isImageModified}
                prevImageUrl={currentPage.prevImageUrl}
                currImageUrl={currentPage.currImageUrl}
                prevPins={currentPage.prevPins}
                currPins={currentPage.currPins}
                focusedPinId={focusedPinId}
                onFocusPin={(id) => {
                  setFocusedPinId(id);
                  setSelectedSummaryId(null);
                }}
              />
            </S.LeftBox>
          </S.LeftColumn>

          <S.RightColumn>
            <S.RightBox>
              <DiffRequirementSection
                requirements={currentPage.requirements || {}}
                focusedPinId={focusedPinId}
                onFocusPin={(id) => {
                  setFocusedPinId(id);
                  setSelectedSummaryId(null);
                }}
              />
            </S.RightBox>
          </S.RightColumn>
        </S.MainSection>
      </S.ContentContainer>
    </S.PageLayout>
  );
}
