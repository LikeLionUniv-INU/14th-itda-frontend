import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import DocHeader from "./components/DocHeader";
import PageNavigator from "./components/PageNavigator";
import DiffScreenInfo from "./components/DiffScreenInfo";
import DiffWireframeCanvas from "./components/DiffWireframeCanvas";
import DiffRequirementSection from "./components/DiffRequirementSection";

import { getDocumentDetail } from "../../api/documentApi";
import * as S from "./DocCompare.styles";

export default function DocViewPage() {
  const { docId: paramDocId, documentId } = useParams();
  const docId = paramDocId || documentId;
  const navigate = useNavigate();
  const location = useLocation();

  const passedState = location.state || {};
  const teamId =
    passedState.teamId || localStorage.getItem("currentTeamId") || "";

  const [docInfo, setDocInfo] = useState({
    docName: "스토리보드",
    version: 1,
    updatedAt: "",
  });

  const [pages, setPages] = useState([]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [focusedPinId, setFocusedPinId] = useState(null);

  const fetchVersion1Data = useCallback(async () => {
    if (!docId) return;

    try {
      const docRes = await getDocumentDetail(docId, 1);
      const docData = docRes?.data?.data || docRes?.data || {};

      setDocInfo({
        docName: docData?.name || docData?.title || "스토리보드",
        version: 1,
        updatedAt: docData?.updatedAt
          ? docData.updatedAt.replace("T", " ").substring(0, 19)
          : "",
      });

      if (docData?.pages && docData.pages.length > 0) {
        const mappedPages = docData.pages.map((p, pIdx) => {
          const currPins = (p.pins || []).map((pin) => ({
            id: pin.id || pin.pinNumber,
            number: pin.pinNumber,
            x: Number(pin.xCoordinate) || 0,
            y: Number(pin.yCoordinate) || 0,
            pinType: "normal",
          }));

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
              if (requirements[tab]) {
                requirements[tab].push({
                  id: pin.id || pin.pinNumber,
                  reqId: req.id,
                  number: pin.pinNumber,
                  type: "normal",
                  currItem: req.itemName || "",
                  currDetail: req.content || "",
                });
              }
            });
          });

          return {
            pageId: p.id || pIdx + 1,
            pageNumber: p.pageNumber || pIdx + 1,
            currScreenName: p.screenName || "",
            currScreenId: p.screenId || "",
            isScreenInfoModified: false,
            device: p.device || "desktop",
            isImageModified: false,
            currImageUrl:
              p.wireframeImages?.[0]?.imageUrl ||
              p.wireframeImageUrl ||
              p.imageUrl ||
              "",
            prevPins: currPins,
            currPins,
            requirements,
          };
        });
        setPages(mappedPages);
      }
    } catch (error) {
      console.error("Version 1 문서 조회 실패:", error);
    }
  }, [docId]);

  useEffect(() => {
    fetchVersion1Data();
  }, [fetchVersion1Data]);

  const currentPage = pages[activePageIndex] || {};

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
        {/* 상단바: {문서이름}_Version.1 노출 */}
        <DocHeader
          docName={`${docInfo.docName}_Version.${docInfo.version}`}
          currVersion={docInfo.version}
          mode="view"
          updatedAt={docInfo.updatedAt}
          onBack={handleBack}
        />

        {/* 수정사항 요약 섹션 없이 바로 본문 렌더링 */}
        <S.MainSection style={{ marginTop: "24px" }}>
          <S.LeftColumn>
            <S.PageNavWrapper>
              <PageNavigator
                pages={pages}
                activePageIndex={activePageIndex}
                onSelectPage={(index) => {
                  setActivePageIndex(index);
                  setFocusedPinId(null);
                }}
                isReadOnly={true}
              />
            </S.PageNavWrapper>

            <S.LeftBox>
              <DiffScreenInfo
                currScreenName={currentPage.currScreenName}
                currScreenId={currentPage.currScreenId}
                isModified={false}
              />
              <S.Divider />
              <DiffWireframeCanvas
                device={currentPage.device}
                isImageModified={false}
                currImageUrl={currentPage.currImageUrl}
                currPins={currentPage.currPins || []}
                focusedPinId={focusedPinId}
                onFocusPin={(id) => setFocusedPinId(id)}
              />
            </S.LeftBox>
          </S.LeftColumn>

          <S.RightColumn>
            <S.RightBox>
              <DiffRequirementSection
                requirements={currentPage.requirements || {}}
                focusedPinId={focusedPinId}
                onFocusPin={(id) => setFocusedPinId(id)}
              />
            </S.RightBox>
          </S.RightColumn>
        </S.MainSection>
      </S.ContentContainer>
    </S.PageLayout>
  );
}
