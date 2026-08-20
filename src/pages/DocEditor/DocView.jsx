import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import DocHeader from "./components/DocHeader";
import PageNavigator from "./components/PageNavigator";
import ScreenInfoForm from "./components/ScreenInfoForm";
import WireframeCanvas from "./components/WireframeCanvas";
import RequirementSection from "./components/RequirementSection";

import { getDocumentDetail } from "../../api/documentApi";
import { getTeamDetail } from "../../api/teamApi";
import * as S from "./DocEditor.styles";

const INITIAL_ROLES = ["공통", "기획", "프론트", "백엔드", "디자인"];

export default function DocViewPage() {
  const { docId: paramDocId, documentId } = useParams();
  const docId = paramDocId || documentId;
  const navigate = useNavigate();
  const location = useLocation();

  const passedState = location.state || {};
  const teamId =
    passedState.teamId || localStorage.getItem("currentTeamId") || "";

  const [documentInfo, setDocumentInfo] = useState({
    name: "스토리보드",
    updatedAt: "",
  });

  const [activeRole, setActiveRole] = useState("공통");
  const [pages, setPages] = useState([]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [focusedPinId, setFocusedPinId] = useState(null);

  const fetchVersion1Data = useCallback(async () => {
    if (!docId) return;

    try {
      // 1. 현재 계정의 언어 자동 추출 (en, ja 등)
      let resolvedLang =
        passedState.language ||
        passedState.lang ||
        localStorage.getItem("userLanguage") ||
        localStorage.getItem("language") ||
        "";

      if (!resolvedLang && teamId) {
        try {
          const teamRes = await getTeamDetail(teamId);
          const teamData = teamRes?.data?.data || teamRes?.data || {};
          resolvedLang =
            teamData?.myLanguage ||
            teamData?.userLanguage ||
            teamData?.defaultLanguage ||
            "";
        } catch (tErr) {}
      }

      // 2. ?lang={resolvedLang} 붙여서 번역된 텍스트 조회
      const docRes = await getDocumentDetail(docId, 1, resolvedLang);
      const docData = docRes?.data?.data || docRes?.data || {};

      const rawName = docData?.name || docData?.title || "스토리보드";
      const cleanName = rawName.replace(/_?[Vv]ersion\.?\d+/g, "").trim();

      setDocumentInfo({
        name: cleanName || "스토리보드",
        updatedAt: docData?.updatedAt
          ? docData.updatedAt.replace("T", " ").substring(0, 19)
          : "",
      });

      if (docData?.pages && docData.pages.length > 0) {
        const formattedPages = docData.pages.map((p, idx) => {
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
            pageId: p.id || idx + 1,
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
      }
    } catch (error) {
      console.error("Version 1 문서 조회 실패:", error);
    }
  }, [docId, teamId, passedState]);

  useEffect(() => {
    fetchVersion1Data();
  }, [fetchVersion1Data]);

  const currentPage = pages[activePageIndex] || {};
  const currentTabPins = currentPage.pins?.[activeRole] || [];

  const handleBack = () => {
    if (teamId) {
      navigate(`/teamp-leader/${teamId}`);
    } else {
      navigate(-1);
    }
  };

  return (
    <S.PageLayout>
      <S.ContentContainer>
        <DocHeader
          docName={`${documentInfo.name}_Version.1`}
          currVersion={1}
          mode="view"
          updatedAt={documentInfo.updatedAt}
          onBack={handleBack}
        />

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
              <ScreenInfoForm
                screenName={currentPage.screenName}
                screenId={currentPage.screenId}
                isReadOnly={true}
              />
              <S.Divider />
              <WireframeCanvas
                imageUrl={currentPage.imageUrl}
                device={currentPage.device}
                pins={currentTabPins}
                focusedPinId={focusedPinId}
                isReadOnly={true}
                onFocusPin={(id) => setFocusedPinId(id)}
              />
            </S.LeftBox>
          </S.LeftColumn>

          <S.RightColumn>
            <S.RightBox>
              <RequirementSection
                mode="view"
                requirements={currentPage.requirements || {}}
                focusedPinId={focusedPinId}
                activeRole={activeRole}
                onChangeRole={(role) => {
                  setActiveRole(role);
                  setFocusedPinId(null);
                }}
                onFocusPin={(id) => setFocusedPinId(id)}
              />
            </S.RightBox>
          </S.RightColumn>
        </S.MainSection>
      </S.ContentContainer>
    </S.PageLayout>
  );
}
