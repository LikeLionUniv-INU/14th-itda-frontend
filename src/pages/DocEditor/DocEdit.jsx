import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";

import DocHeader from "./components/DocHeader";
import SummarySection from "./components/SummarySection";
import PageNavigator from "./components/PageNavigator";
import ScreenInfoForm from "./components/ScreenInfoForm";
import WireframeCanvas from "./components/WireframeCanvas";
import RequirementSection from "./components/RequirementSection";
import SaveFlowModals from "./components/SaveFlowModals";

const INITIAL_ROLES = ["공통", "기획", "프론트", "백엔드", "디자인"];

const getTodayFormatted = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}.`;
};

export default function DocEditPage() {
  const navigate = useNavigate();
  const { docId } = useParams();

  // 기존 Version.1 문서를 불러온 상태의 기본 데이터
  const [currentVersion, setCurrentVersion] = useState(1);
  const [pages, setPages] = useState([
    {
      pageId: 1,
      screenName: "회원가입 페이지",
      screenId: "SIGN_UP_001",
      imageUrl: "",
      device: "desktop",
      pins: [
        { id: 101, number: 1, x: 180, y: 120 },
        { id: 102, number: 2, x: 180, y: 220 },
      ],
      requirements: {
        공통: [
          {
            id: 101,
            number: 1,
            item: "ID 입력",
            detail:
              '아이디 중복검사 기능 버튼\n중복 발생 시 - "해당 아이디는 사용할 수 없습니다." 메시지',
            isModified: false,
          },
          {
            id: 102,
            number: 2,
            item: "이메일 입력",
            detail:
              '메일을 입력하지 않고 [Enter] or [로그인] 버튼을 누르면 => "이메일을 입력해주세요." 안내 문구 표시',
            isModified: false,
          },
        ],
        기획: [
          {
            id: 101,
            number: 1,
            item: "ID 입력",
            detail:
              '아이디 중복검사 기능 버튼\n중복 발생 시 - "해당 아이디는 사용할 수 없습니다." 메시지',
            isModified: false,
          },
          {
            id: 102,
            number: 2,
            item: "이메일 입력",
            detail:
              '메일을 입력하지 않고 [Enter] or [로그인] 버튼을 누르면 => "이메일을 입력해주세요." 안내 문구 표시',
            isModified: false,
          },
        ],
        프론트: [
          {
            id: 101,
            number: 1,
            item: "ID 입력",
            detail:
              '아이디 중복검사 기능 버튼\n중복 발생 시 - "해당 아이디는 사용할 수 없습니다." 메시지',
            isModified: false,
          },
          {
            id: 102,
            number: 2,
            item: "이메일 입력",
            detail:
              '메일을 입력하지 않고 [Enter] or [로그인] 버튼을 누르면 => "이메일을 입력해주세요." 안내 문구 표시',
            isModified: false,
          },
        ],
        백엔드: [
          {
            id: 101,
            number: 1,
            item: "ID 입력",
            detail:
              '아이디 중복검사 기능 버튼\n중복 발생 시 - "해당 아이디는 사용할 수 없습니다." 메시지',
            isModified: false,
          },
          {
            id: 102,
            number: 2,
            item: "이메일 입력",
            detail:
              '메일을 입력하지 않고 [Enter] or [로그인] 버튼을 누르면 => "이메일을 입력해주세요." 안내 문구 표시',
            isModified: false,
          },
        ],
        디자인: [
          {
            id: 101,
            number: 1,
            item: "ID 입력",
            detail:
              '아이디 중복검사 기능 버튼\n중복 발생 시 - "해당 아이디는 사용할 수 없습니다." 메시지',
            isModified: false,
          },
          {
            id: 102,
            number: 2,
            item: "이메일 입력",
            detail:
              '메일을 입력하지 않고 [Enter] or [로그인] 버튼을 누르면 => "이메일을 입력해주세요." 안내 문구 표시',
            isModified: false,
          },
        ],
      },
    },
    {
      pageId: 2,
      screenName: "로그인 페이지",
      screenId: "SIGN_IN_001",
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

  const [activePageIndex, setActivePageIndex] = useState(0);
  const [focusedPinId, setFocusedPinId] = useState(null);
  const [selectedSummaryId, setSelectedSummaryId] = useState(null);

  // 상단 수정사항 요약 리스트
  const [summaryList, setSummaryList] = useState([]);

  // 모달 상태 관리
  const [modalState, setModalState] = useState({
    isOpen: false,
    step: "exit",
  });

  const currentPage = pages[activePageIndex] || {};

  const handleUpdatePage = (updatedField) => {
    setPages((prev) =>
      prev.map((p, idx) =>
        idx === activePageIndex ? { ...p, ...updatedField } : p,
      ),
    );
  };

  // 1. 핀 추가
  const handleAddPin = ({ x, y }) => {
    const currentPins = currentPage.pins || [];
    const newPinId = Date.now();
    const newPinNumber = currentPins.length + 1;

    const newPin = { id: newPinId, number: newPinNumber, x, y };
    const newReqItem = {
      id: newPinId,
      number: newPinNumber,
      item: "",
      detail: "",
      isModified: false,
    };

    const updatedRequirements = { ...(currentPage.requirements || {}) };
    INITIAL_ROLES.forEach((role) => {
      updatedRequirements[role] = [
        ...(updatedRequirements[role] || []),
        { ...newReqItem },
      ];
    });

    handleUpdatePage({
      pins: [...currentPins, newPin],
      requirements: updatedRequirements,
    });
    setFocusedPinId(newPin.id);
  };

  // 2. 핀 이동
  const handleUpdatePinPos = (pinId, { x, y }) => {
    const updatedPins = (currentPage.pins || []).map((p) =>
      p.id === pinId ? { ...p, x, y } : p,
    );
    handleUpdatePage({ pins: updatedPins });
  };

  // 3. 핀 삭제
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

    handleUpdatePage({
      pins: filteredPins,
      requirements: updatedRequirements,
    });

    // 요약 테이블에서도 삭제된 핀 내역 제거
    setSummaryList((prev) => prev.filter((s) => s.pinId !== pinId));
    setFocusedPinId(null);
  };

  // 4. 요구사항 수정 및 상단 요약 섹션 실시간 자동 등록
  const handleUpdateRequirement = (
    role,
    reqId,
    field,
    value,
    syncAll = false,
  ) => {
    const updatedRequirements = { ...(currentPage.requirements || {}) };
    const targetRoles = syncAll ? INITIAL_ROLES : [role];

    targetRoles.forEach((r) => {
      const list = updatedRequirements[r] || [];
      const exists = list.some((item) => item.id === reqId);

      if (exists) {
        updatedRequirements[r] = list.map((item) => {
          if (item.id !== reqId) return item;
          if (field === "all") return { ...item, ...value };
          return { ...item, [field]: value };
        });
      } else {
        const targetPin = (currentPage.pins || []).find((p) => p.id === reqId);
        const newNumber = targetPin ? targetPin.number : list.length + 1;
        const newItem =
          field === "all"
            ? { id: reqId, number: newNumber, ...value }
            : {
                id: reqId,
                number: newNumber,
                item: "",
                detail: "",
                [field]: value,
              };
        updatedRequirements[r] = [...list, newItem];
      }
    });

    handleUpdatePage({ requirements: updatedRequirements });

    // 수정완료 시 요약 리스트 추가/업데이트
    if (field === "all" && value.isModified) {
      const targetReq = (updatedRequirements[role] || []).find(
        (r) => r.id === reqId,
      );
      const pageName =
        currentPage.screenName || `페이지 ${activePageIndex + 1}`;

      setSummaryList((prev) => {
        const filtered = prev.filter(
          (s) => !(s.pageIndex === activePageIndex && s.pinId === reqId),
        );
        return [
          ...filtered,
          {
            id: `sum-${activePageIndex}-${reqId}`,
            pageIndex: activePageIndex,
            pinId: reqId,
            pageName: pageName,
            number: targetReq?.number || 1,
            itemName: value.item || "-",
            previewContent: value.detail || "-",
            author: "김서연",
            date: getTodayFormatted(),
          },
        ];
      });
    }
  };

  // 5. 상단 요약 항목 클릭 시 포커스 이동
  const handleSelectSummary = (item) => {
    setSelectedSummaryId(item.id);
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
        {/* 상단 네비바 (수정 모드: updatedAt 및 버전 표기) */}
        <HeaderWrapper>
          <DocHeader
            docName="스토리보드"
            version={currentVersion}
            mode="edit"
            updatedAt="2026.06.30. 20:30:37"
            onBack={() => setModalState({ isOpen: true, step: "exit" })}
            onTempSave={() => alert("임시저장되었습니다.")}
            onSave={() =>
              setModalState({ isOpen: true, step: "complete_confirm" })
            }
          />
        </HeaderWrapper>

        {/* 상단 수정사항 요약 박스 (1200px) */}
        <SummarySection
          summaryList={summaryList}
          selectedSummaryId={selectedSummaryId}
          onSelectSummary={handleSelectSummary}
        />

        {/* 본문 2단 영역 */}
        <MainSection>
          {/* 좌측 (712px × 854px) */}
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
            </PageNavWrapper>

            <LeftBox>
              <ScreenInfoForm
                screenName={currentPage.screenName}
                screenId={currentPage.screenId}
                onChangeScreenName={(name) =>
                  handleUpdatePage({ screenName: name })
                }
                onChangeScreenId={(id) => handleUpdatePage({ screenId: id })}
              />
              <Divider />
              <WireframeCanvas
                imageUrl={currentPage.imageUrl}
                device={currentPage.device}
                pins={currentPage.pins}
                focusedPinId={focusedPinId}
                onChangeDevice={(device) => handleUpdatePage({ device })}
                onUploadImage={(imageUrl) => handleUpdatePage({ imageUrl })}
                onAddPin={handleAddPin}
                onUpdatePinPos={handleUpdatePinPos}
                onFocusPin={(id) => {
                  setFocusedPinId(id);
                  setSelectedSummaryId(null);
                }}
                onDeletePin={handleDeletePin}
              />
            </LeftBox>
          </LeftColumn>

          {/* 우측 (468px × 854px, mode="edit") */}
          <RightColumn>
            <RightBox>
              <RequirementSection
                mode="edit"
                requirements={currentPage.requirements || {}}
                focusedPinId={focusedPinId}
                onUpdateRequirement={handleUpdateRequirement}
                onFocusPin={(id) => {
                  setFocusedPinId(id);
                  setSelectedSummaryId(null);
                }}
              />
            </RightBox>
          </RightColumn>
        </MainSection>
      </ContentContainer>

      {/* 저장 및 이탈 모달 일체 (다음 버전으로 저장 안내) */}
      <SaveFlowModals
        isOpen={modalState.isOpen}
        currentStep={modalState.step}
        docName={`스토리보드_Version${currentVersion + 1}`}
        onClose={() => setModalState({ isOpen: false, step: "exit" })}
        onConfirmExit={() => {
          setModalState({ isOpen: false, step: "exit" });
          navigate(-1);
        }}
        onNextStep={(nextStep) =>
          setModalState({ isOpen: true, step: nextStep })
        }
        onFinalSave={() => {
          setModalState({ isOpen: false, step: "exit" });
          alert(
            `스토리보드 Version.${currentVersion + 1} 저장이 완료되었습니다!`,
          );
        }}
      />
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

const HeaderWrapper = styled.div`
  width: 1200px;
  height: 61px;
  display: flex;
  align-items: center;
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
