import React, { useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";

import DocHeader from "./components/DocHeader";
import PageNavigator from "./components/PageNavigator";
import DiffSummarySection from "./components/DiffSummarySection";
import DiffScreenInfo from "./components/DiffScreenInfo";
import DiffWireframeCanvas from "./components/DiffWireframeCanvas";
import DiffRequirementSection from "./components/DiffRequirementSection";

export default function DocComparePage() {
  const { docId } = useParams();
  const navigate = useNavigate();

  // 1. 서버(백엔드)에서 받아올 문서 메타 정보 상태
  const [docInfo, setDocInfo] = useState({
    docName: "스토리보드",
    prevVersion: 1,
    currVersion: 2,
    updatedAt: "2026.06.30. 20:30:37",
  });

  // 2. 상단 수정사항 요약 리스트 상태
  const [summaryList, setSummaryList] = useState([
    {
      id: "sum-1",
      pageIndex: 0,
      pinId: 102,
      pageName: "회원가입",
      number: 2,
      itemName: "ID입력",
      previewContent:
        '아이디 중복검사 기능 버튼 중복 발생 시 - "해당 아이디는 사용할 수 없습니다." 메시지',
      author: "김서연",
      date: "2026.06.20.",
    },
    {
      id: "sum-2",
      pageIndex: 0,
      pinId: 106,
      pageName: "회원가입",
      number: 6,
      itemName: "ID입력",
      previewContent:
        '아이디 중복검사 기능 버튼 중복 발생 시 - "해당 아이디는 사용할 수 없습니다." 메시지',
      author: "김서연",
      date: "2026.06.20.",
    },
  ]);

  // 팀원이 클릭하여 확인한 요약 항목 ID 배열
  const [checkedIds, setCheckedIds] = useState([]);
  const [selectedSummaryId, setSelectedSummaryId] = useState(null);

  // 3. 페이지별 비교 데이터
  const [pages, setPages] = useState([
    {
      pageId: 1,
      // 화면 정보 비교용
      prevScreenName: "회원가입 페이지",
      prevScreenId: "SIGN_UP_001",
      currScreenName: "회원가입",
      currScreenId: "SIGN_001",
      isScreenInfoModified: true,

      // 와이어프레임 비교용
      device: "desktop",
      isImageModified: false,
      prevImageUrl: "",
      currImageUrl: "",
      prevPins: [
        { id: 101, number: 1, x: 180, y: 120 },
        { id: 102, number: 2, x: 180, y: 220 },
      ],
      currPins: [
        { id: 101, number: 1, x: 180, y: 120, pinType: "curr" },
        { id: 102, number: 2, x: 180, y: 220, pinType: "curr" },
        { id: 106, number: 6, x: 180, y: 320, pinType: "added" },
      ],

      // 요구사항 비교용 (3색 데이터)
      requirements: {
        공통: [
          {
            id: 101,
            number: 1,
            type: "normal",
            currItem: "ID 입력",
            currDetail:
              '아이디 중복검사 기능 버튼\n중복 발생 시 - "해당 아이디는 사용할 수 없습니다." 메시지',
          },
          {
            id: 102,
            number: 2,
            type: "modified",
            prevItem: "ID 입력",
            prevDetail:
              '아이디 중복검사 기능 버튼\n중복 발생 시 - "해당 아이디는 사용할 수 없습니다." 메시지',
            currItem: "이메일 입력",
            currDetail:
              '메일을 입력하지 않고 [Enter] or [로그인] 버튼을 누르면 => "이메일을 입력해주세요." 안내 문구 표시\n메일 형식이 아닐 경우 => "올바른 이메일 형식이 아닙니다"',
          },
          {
            id: 103,
            number: 2,
            type: "normal",
            currItem: "ID 입력",
            currDetail:
              '아이디 중복검사 기능 버튼\n중복 발생 시 - "해당 아이디는 사용할 수 없습니다." 메시지',
          },
          {
            id: 104,
            number: 3,
            type: "normal",
            currItem: "ID 입력",
            currDetail:
              '아이디 중복검사 기능 버튼\n중복 발생 시 - "해당 아이디는 사용할 수 없습니다." 메시지',
          },
          {
            id: 105,
            number: 4,
            type: "normal",
            currItem: "ID 입력",
            currDetail:
              '아이디 중복검사 기능 버튼\n중복 발생 시 - "해당 아이디는 사용할 수 없습니다." 메시지',
          },
          {
            id: 106,
            number: 6,
            type: "added",
            currItem: "ID 입력",
            currDetail:
              '아이디 중복검사 기능 버튼\n중복 발생 시 - "해당 아이디는 사용할 수 없습니다." 메시지',
          },
        ],
        기획: [],
        프론트: [],
        백엔드: [],
        디자인: [],
      },
    },
    {
      pageId: 2,
      prevScreenName: "로그인",
      prevScreenId: "SIGN_IN_001",
      currScreenName: "로그인",
      currScreenId: "SIGN_IN_001",
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
    },
  ]);

  const [activePageIndex, setActivePageIndex] = useState(0);
  const [focusedPinId, setFocusedPinId] = useState(null);

  const currentPage = pages[activePageIndex] || {};

  const handleSelectSummary = (item) => {
    setSelectedSummaryId(item.id);

    if (!checkedIds.includes(item.id)) {
      setCheckedIds((prev) => [...prev, item.id]);
    }

    if (item.pageIndex !== undefined && item.pageIndex !== activePageIndex) {
      setActivePageIndex(item.pageIndex);
    }
    if (item.pinId) {
      setFocusedPinId(item.pinId);
    }
  };

  return (
    <PageLayout>
      <ContentContainer>
        {/* 1. 상단바 */}
        <DocHeader
          docName={docInfo.docName}
          version={docInfo.currVersion}
          prevVersion={docInfo.prevVersion}
          mode="compare"
          updatedAt={docInfo.updatedAt}
          onBack={() => navigate("/team-project-main")}
        />

        {/* 2. 상단 수정사항 요약 섹션 */}
        <DiffSummarySection
          summaryList={summaryList}
          checkedIds={checkedIds}
          selectedSummaryId={selectedSummaryId}
          onSelectSummary={handleSelectSummary}
        />

        {/* 3. 본문 2단 영역 */}
        <MainSection>
          {/* 좌측 영역 */}
          <LeftColumn>
            <PageNavWrapper>
              <PageNavigator
                pages={pages}
                activePageIndex={activePageIndex}
                onSelectPage={(index) => {
                  setActivePageIndex(index);
                  setFocusedPinId(null);
                  setSelectedSummaryId(null);
                }}
                onAddPage={() =>
                  alert("비교 모드에서는 페이지를 추가할 수 없습니다.")
                }
              />
            </PageNavWrapper>

            <LeftBox>
              <DiffScreenInfo
                prevScreenName={currentPage.prevScreenName}
                prevScreenId={currentPage.prevScreenId}
                currScreenName={currentPage.currScreenName}
                currScreenId={currentPage.currScreenId}
                isModified={currentPage.isScreenInfoModified}
              />

              <Divider />

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
            </LeftBox>
          </LeftColumn>

          {/* 우측 영역 */}
          <RightColumn>
            <RightBox>
              <DiffRequirementSection
                requirements={currentPage.requirements || {}}
                focusedPinId={focusedPinId}
                onFocusPin={(id) => {
                  setFocusedPinId(id);
                  setSelectedSummaryId(null);
                }}
              />
            </RightBox>
          </RightColumn>
        </MainSection>
      </ContentContainer>
    </PageLayout>
  );
}

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff !important;
  padding: 40px 0 80px 0;
  box-sizing: border-box;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  width: 1200px;
`;

const MainSection = styled.div`
  display: flex;
  width: 1200px;
  justify-content: space-between;
  align-items: flex-end;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 712px;
`;

const PageNavWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
`;

const LeftBox = styled.div`
  width: 712px;
  height: 854px;
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid #b6b6b6;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Divider = styled.hr`
  width: 100%;
  height: 1px;
  border: none;
  background-color: #eaeaea;
  margin: 0;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 468px;
`;

const RightBox = styled.div`
  width: 468px;
  height: 854px;
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid #b6b6b6;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;
