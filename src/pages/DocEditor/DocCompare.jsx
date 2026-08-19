import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import DocHeader from "./components/DocHeader";
import PageNavigator from "./components/PageNavigator";
import DiffSummarySection from "./components/DiffSummarySection";
import DiffScreenInfo from "./components/DiffScreenInfo";
import DiffWireframeCanvas from "./components/DiffWireframeCanvas";
import DiffRequirementSection from "./components/DiffRequirementSection";

import {
  getDocumentDetail,
  getDocumentChanges,
  confirmChange,
} from "../../services/documentApi";

import * as S from "./DocCompare.styles";

const INITIAL_ROLES = ["공통", "기획", "프론트", "백엔드", "디자인"];

// 백엔드 changes의 JSON 문자열 파싱 헬퍼
const safeJsonParse = (str) => {
  if (!str) return null;
  try {
    return typeof str === "string" ? JSON.parse(str) : str;
  } catch (e) {
    return str;
  }
};

export default function DocComparePage() {
  const { docId } = useParams();
  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState({
    docName: "스토리보드",
    prevVersion: 1,
    currVersion: 2,
    updatedAt: "",
  });

  const [summaryList, setSummaryList] = useState([]);
  const [checkedIds, setCheckedIds] = useState([]);
  const [selectedSummaryId, setSelectedSummaryId] = useState(null);
  const [pages, setPages] = useState([]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [focusedPinId, setFocusedPinId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 문서 최신 데이터 및 변경사항(changes) diff 연동
  const fetchCompareData = useCallback(async () => {
    if (!docId) return;

    try {
      setIsLoading(true);

      // 1. 현재 문서 상세 조회 (기본 currVersion 조회)
      const docRes = await getDocumentDetail(docId, docInfo.currVersion);
      const docData = docRes.data;

      const currentVer = docData.version;
      const prevVer = currentVer > 1 ? currentVer - 1 : 1;

      setDocInfo({
        docName: docData.name,
        prevVersion: prevVer,
        currVersion: currentVer,
        updatedAt: docData.updatedAt || "",
      });

      // 2. 수정사항 목록 조회 (GET /api/documents/{docId}/versions/{version}/changes)
      const changesRes = await getDocumentChanges(docId, currentVer);
      const changesData = changesRes.data;

      // 수정사항 요약 리스트 매핑
      const formattedSummary = (changesData.changes || []).map((ch) => {
        const afterParsed = safeJsonParse(ch.afterValue);
        const beforeParsed = safeJsonParse(ch.beforeValue);

        return {
          id: ch.id,
          pageIndex: ch.pageNumber ? ch.pageNumber - 1 : 0,
          pinId: ch.pinNumber,
          pageName: ch.screenName || `페이지 ${ch.pageNumber}`,
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
          confirmedByMe: ch.confirmedByMe,
          before: beforeParsed,
          after: afterParsed,
        };
      });

      setSummaryList(formattedSummary);

      // 내가 이미 확인(confirm)한 수정사항 ID 목록 세팅
      const initialChecked = formattedSummary
        .filter((item) => item.confirmedByMe)
        .map((item) => item.id);
      setCheckedIds(initialChecked);

      // 3. 페이지 상세 정보 및 요구사항 전/후 diff 3색 분기 구조 생성
      if (docData.pages && docData.pages.length > 0) {
        const mappedPages = docData.pages.map((p, pIdx) => {
          const pageChanges = formattedSummary.filter(
            (ch) => ch.pageIndex === pIdx,
          );

          // 화면 정보 변경 여부 (SCREEN_MODIFIED)
          const screenChange = pageChanges.find(
            (ch) => ch.changeType === "SCREEN_MODIFIED",
          );
          const isScreenInfoModified = !!screenChange;
          const prevScreenName = isScreenInfoModified
            ? screenChange.before?.screenName || p.screenName
            : p.screenName;
          const prevScreenId = isScreenInfoModified
            ? screenChange.before?.screenId || p.screenId
            : p.screenId;
          const currScreenName = p.screenName;
          const currScreenId = p.screenId;

          // 와이어프레임 이미지 변경 여부 (IMAGE_MODIFIED, IMAGE_ADDED, IMAGE_DELETED)
          const imgChange = pageChanges.find((ch) =>
            ["IMAGE_MODIFIED", "IMAGE_ADDED", "IMAGE_DELETED"].includes(
              ch.changeType,
            ),
          );
          const isImageModified = !!imgChange;
          const prevImageUrl = imgChange?.before?.imageUrl || "";
          const currImageUrl =
            p.wireframeImages?.[0]?.imageUrl ||
            imgChange?.after?.imageUrl ||
            "";

          // 핀 목록 구성 (prevPins, currPins)
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
              id: pin.id,
              number: pin.pinNumber,
              x: pin.xCoordinate,
              y: pin.yCoordinate,
              pinType,
            });

            // 변경 전 핀 정보가 필요할 경우 세팅
            prevPins.push({
              id: pin.id,
              number: pin.pinNumber,
              x: pin.xCoordinate,
              y: pin.yCoordinate,
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
                  ch.after?.itemName === req.itemName,
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
                  id: pin.id,
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
            pageId: p.id,
            prevScreenName,
            prevScreenId,
            currScreenName,
            currScreenId,
            isScreenInfoModified,
            device: "desktop",
            isImageModified,
            prevImageUrl,
            currImageUrl,
            prevPins,
            currPins,
            requirements,
          };
        });

        setPages(mappedPages);
      }
    } catch (error) {
      console.error("비교 데이터 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [docId, docInfo.currVersion]);

  useEffect(() => {
    fetchCompareData();
  }, [fetchCompareData]);

  const currentPage = pages[activePageIndex] || {};

  // 상단 수정사항 항목 클릭 시 (선택 및 개별 확인 POST 호출)
  const handleSelectSummary = async (item) => {
    setSelectedSummaryId(item.id);

    // 아직 확인하지 않은 항목이면 백엔드 확인 API 호출
    if (!checkedIds.includes(item.id)) {
      setCheckedIds((prev) => [...prev, item.id]);
      try {
        await confirmChange(docId, docInfo.currVersion, item.id);
      } catch (e) {
        // 이미 확인된 항목(409) 등은 정상 통과
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
        {/* 상단바: props 이름 일치 완료 */}
        <DocHeader
          docName={docInfo.docName}
          currVersion={docInfo.currVersion}
          prevVersion={docInfo.prevVersion}
          updatedAt={docInfo.updatedAt}
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
