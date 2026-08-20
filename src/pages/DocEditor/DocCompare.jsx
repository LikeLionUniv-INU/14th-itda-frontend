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

const safeJsonParse = (str) => {
  if (!str) return null;
  try {
    return typeof str === "string" ? JSON.parse(str) : str;
  } catch (e) {
    return str;
  }
};

const createEmptyComparePage = (pageNumber = 1) => ({
  pageId: Date.now() + Math.random(),
  pageNumber,
  screenName: `페이지 ${pageNumber}`,
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
  const teamId =
    passedState.teamId || localStorage.getItem("currentTeamId") || "";

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

  const fetchCompareData = useCallback(async () => {
    if (!docId) return;

    try {
      // 1. 버전 번호 결정
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

      // 2. 현재 버전 & 이전 버전 문서 상세 동시 조회
      const [docRes, prevDocRes] = await Promise.all([
        getDocumentDetail(docId, currentVer),
        prevVer !== currentVer
          ? getDocumentDetail(docId, prevVer).catch(() => null)
          : Promise.resolve(null),
      ]);

      const docData = docRes?.data?.data || docRes?.data || {};
      const prevDocData = prevDocRes?.data?.data || prevDocRes?.data || null;

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
        const resData = changesRes?.data?.data || changesRes?.data || {};
        const changeList =
          resData.changes ||
          resData.changeList ||
          (Array.isArray(resData) ? resData : []);

        formattedSummary = changeList.map((ch, idx) => {
          const afterParsed = safeJsonParse(ch.afterValue);
          const beforeParsed = safeJsonParse(ch.beforeValue);

          const rawPageNum =
            ch.pageNumber ||
            afterParsed?.pageNumber ||
            beforeParsed?.pageNumber ||
            1;
          const rawPinNum =
            ch.pinNumber ||
            ch.pinId ||
            afterParsed?.pinNumber ||
            beforeParsed?.pinNumber ||
            1;

          return {
            id: ch.id || idx + 1,
            pageIndex: Math.max(0, Number(rawPageNum) - 1),
            pageNumber: Number(rawPageNum),
            pinNumber: Number(rawPinNum),
            tabType:
              ch.tabType ||
              afterParsed?.tabType ||
              beforeParsed?.tabType ||
              "공통",
            pageName:
              ch.screenName ||
              afterParsed?.screenName ||
              `페이지 ${rawPageNum}`,
            number: Number(rawPinNum),
            changeType: ch.changeType,
            itemName:
              ch.itemDescription ||
              ch.itemName ||
              afterParsed?.itemName ||
              beforeParsed?.itemName ||
              (ch.changeType?.includes("IMAGE") ? "와이어프레임 이미지" : "-"),
            previewContent:
              ch.previewContent ||
              ch.content ||
              afterParsed?.content ||
              beforeParsed?.content ||
              afterParsed?.imageUrl ||
              "-",
            author:
              ch.author ||
              ch.authorName ||
              `${ch.modifiedByLastName || ""} ${ch.modifiedByFirstName || ""}`.trim() ||
              "작성자",
            date: ch.createdAt
              ? ch.createdAt.substring(0, 10).replace(/-/g, ".") + "."
              : ch.date || "",
            confirmedByMe: Boolean(ch.confirmedByMe),
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
        console.warn("변경사항 내역 조회 실패:", err);
      }

      // 4. 페이지 상세 정보 및 요구사항 구성
      if (docData?.pages && docData.pages.length > 0) {
        const mappedPages = docData.pages.map((p, pIdx) => {
          const prevPage = prevDocData?.pages?.[pIdx] || null;
          const pageChanges = formattedSummary.filter(
            (ch) => ch.pageIndex === pIdx,
          );

          // 화면 정보 Diff
          const screenChange = pageChanges.find(
            (ch) => ch.changeType === "SCREEN_MODIFIED",
          );
          const isScreenInfoModified =
            Boolean(screenChange) ||
            (prevPage &&
              (prevPage.screenName !== p.screenName ||
                prevPage.screenId !== p.screenId));
          const prevScreenName =
            prevPage?.screenName ||
            screenChange?.before?.screenName ||
            p.screenName ||
            "";
          const prevScreenId =
            prevPage?.screenId ||
            screenChange?.before?.screenId ||
            p.screenId ||
            "";
          const currScreenName = p.screenName || "";
          const currScreenId = p.screenId || "";

          // 와이어프레임 이미지 변경 여부 판별 (changes에 이미지 변경 내역이 있을 때만 듀얼 뷰 활성화)
          const imgChange = pageChanges.find((ch) =>
            ["IMAGE_MODIFIED", "IMAGE_ADDED", "IMAGE_DELETED"].includes(
              ch.changeType,
            ),
          );
          const isImageModified = Boolean(imgChange);

          const prevImageUrl =
            imgChange?.before?.imageUrl ||
            prevPage?.wireframeImages?.[0]?.imageUrl ||
            prevPage?.wireframeImageUrl ||
            prevPage?.imageUrl ||
            "";

          const currImageUrl =
            p.wireframeImages?.[0]?.imageUrl ||
            p.wireframeImageUrl ||
            p.imageUrl ||
            imgChange?.after?.imageUrl ||
            (!isImageModified ? prevImageUrl : "");

          // 핀 목록 구성
          const prevPins = (prevPage?.pins || []).map((pin) => ({
            id: pin.id || pin.pinNumber,
            number: pin.pinNumber,
            x: Number(pin.xCoordinate) || 0,
            y: Number(pin.yCoordinate) || 0,
          }));

          const currPins = (p.pins || []).map((pin) => {
            const pinChange = pageChanges.find(
              (ch) =>
                ch.pinId === pin.pinNumber || ch.pinNumber === pin.pinNumber,
            );
            let pinType = "curr";
            if (
              pinChange?.changeType === "REQUIREMENT_ADDED" ||
              pinChange?.changeType === "PIN_ADDED" ||
              !(prevPage?.pins || []).some(
                (pp) => pp.pinNumber === pin.pinNumber,
              )
            ) {
              pinType = "added";
            }
            return {
              id: pin.id || pin.pinNumber,
              number: pin.pinNumber,
              x: Number(pin.xCoordinate) || 0,
              y: Number(pin.yCoordinate) || 0,
              pinType,
            };
          });

          // 직무별 요구사항 Diff 구성 (3색 분기 정확 매칭)
          const requirements = {
            공통: [],
            기획: [],
            프론트: [],
            백엔드: [],
            디자인: [],
          };

          (p.pins || []).forEach((pin) => {
            const pinReqs = pin.requirements || [];
            const prevPin = (prevPage?.pins || []).find(
              (pp) => pp.pinNumber === pin.pinNumber || pp.id === pin.id,
            );

            const pinChanges = pageChanges.filter(
              (ch) =>
                ch.pinNumber === pin.pinNumber ||
                ch.pinId === pin.id ||
                ch.pinId === pin.pinNumber,
            );

            if (pinReqs.length === 0) {
              const tab = pin.tabType || "공통";
              if (requirements[tab]) {
                requirements[tab].push({
                  id: pin.id || pin.pinNumber,
                  reqId: null,
                  number: pin.pinNumber,
                  type: !prevPin ? "added" : "normal",
                  prevItem: "",
                  prevDetail: "",
                  currItem: "-",
                  currDetail: "-",
                });
              }
              return;
            }

            pinReqs.forEach((req) => {
              const tab = req.tabType || "공통";
              const prevReq = (prevPin?.requirements || []).find(
                (pr) => (pr.tabType || "공통") === tab,
              );

              const reqChange = pinChanges.find(
                (ch) =>
                  ch.tabType === tab ||
                  ch.itemName === req.itemName ||
                  ch.after?.itemName === req.itemName ||
                  ch.itemDescription === req.itemName ||
                  !ch.after?.itemName,
              );

              let type = "normal";
              let prevItem = "";
              let prevDetail = "";

              // 1. 수정사항: 이전 버전과 내용이 다르거나 changeType이 MODIFIED인 경우
              if (
                reqChange?.changeType === "REQUIREMENT_MODIFIED" ||
                reqChange?.changeType === "ITEM_MODIFIED" ||
                (prevReq &&
                  (prevReq.itemName !== req.itemName ||
                    prevReq.content !== req.content))
              ) {
                type = "modified";
                prevItem =
                  reqChange?.before?.itemName || prevReq?.itemName || "";
                prevDetail =
                  reqChange?.before?.content || prevReq?.content || "";
              }
              // 2. 추가사항: 이전 버전에 없던 핀/요구사항이거나 changeType이 ADDED인 경우
              else if (
                reqChange?.changeType === "REQUIREMENT_ADDED" ||
                reqChange?.changeType === "PIN_ADDED" ||
                reqChange?.changeType === "ITEM_ADDED" ||
                !prevPin ||
                !prevReq
              ) {
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
            screenName: currScreenName || p.screenName || `페이지 ${pIdx + 1}`,
            prevScreenName,
            prevScreenId,
            currScreenName,
            currScreenId,
            isScreenInfoModified,
            device: p.device || "desktop",
            isImageModified,
            prevImageUrl,
            currImageUrl: currImageUrl || prevImageUrl,
            prevPins: prevPins.length > 0 ? prevPins : currPins,
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
        console.warn("확인 처리 완료 또는 오류:", e.message);
      }
    }

    if (item.pageIndex !== undefined && !isNaN(item.pageIndex)) {
      setActivePageIndex(item.pageIndex);
    }
    if (item.pinNumber) {
      setFocusedPinId(item.pinNumber);
    }
  };

  const handleBack = () => {
    if (teamId) {
      navigate(`/teamp/${teamId}`);
    } else {
      navigate(-1);
    }
  };

  return (
    <S.PageLayout>
      <S.ContentContainer>
        <DocHeader
          docName={docInfo.docName}
          currVersion={docInfo.currVersion}
          prevVersion={docInfo.prevVersion}
          mode="compare"
          updatedAt={docInfo.updatedAt}
          onBack={handleBack}
        />

        <DiffSummarySection
          summaryList={summaryList}
          checkedIds={checkedIds}
          selectedSummaryId={selectedSummaryId}
          onSelectSummary={handleSelectSummary}
        />

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
