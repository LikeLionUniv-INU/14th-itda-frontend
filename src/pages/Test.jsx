import { useState } from "react";
import styled from "styled-components";
import DocHeader from "./DocEditor/components/DocHeader";
import SummarySection from "./DocEditor/components/SummarySection";
import PageNavigator from "./DocEditor/components/PageNavigator";
import ScreenInfoForm from "./DocEditor/components/ScreenInfoForm";
import WireframeCanvas from "./DocEditor/components/WireframeCanvas";
import RequirementSection from "./DocEditor/components/RequirementSection";

const INITIAL_ROLES = ["공통", "기획", "프론트", "백엔드", "디자인"];

export default function Test() {
  const [pages, setPages] = useState([
    {
      pageId: 1,
      screenName: "회원가입",
      screenId: "SIGN_UP_001",
      imageUrl: "",
      device: "desktop",
      pins: [
        { id: 101, number: 1, x: 200, y: 150 },
        { id: 102, number: 2, x: 200, y: 220 },
      ],
      requirements: {
        공통: [
          {
            id: 101,
            number: 1,
            item: "ID입력",
            detail:
              '아이디 중복검사 기능 버튼 중복 발생 시 - "해당 아이디는 사용할 수 없습니다." 메시지',
            isModified: false,
          },
          {
            id: 102,
            number: 2,
            item: "이메일 입력",
            detail:
              '메일을 입력하지 않고 [Enter] or [로그인] 버튼을 누르면 => "이메일을 입력해주세요." 안내 문구 표시',
            isModified: true,
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
      screenName: "로그인",
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

  // 수정사항 요약 리스트 (수정 완료된 항목들 또는 임의 테스트 데이터)
  const [summaryList, setSummaryList] = useState([
    {
      id: "sum-1",
      pageIndex: 0,
      pinId: 102,
      pageName: "회원가입",
      number: 2,
      itemName: "이메일 입력",
      previewContent:
        '메일을 입력하지 않고 [Enter] or [로그인] 버튼을 누르면 => "이메일을 입력해주세요." 안내 문구 표시',
      author: "김서연",
      date: "2026.06.20.",
    },
  ]);

  const currentPage = pages[activePageIndex] || {};

  const handleUpdatePage = (updatedField) => {
    setPages((prev) =>
      prev.map((p, idx) =>
        idx === activePageIndex ? { ...p, ...updatedField } : p,
      ),
    );
  };

  // 핀 추가 시
  const handleAddPin = ({ x, y }) => {
    const currentPins = currentPage.pins || [];
    const newPinId = Date.now();
    const newPinNumber = currentPins.length + 1;

    const newPin = {
      id: newPinId,
      number: newPinNumber,
      x,
      y,
    };

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

  // 핀 위치 이동
  const handleUpdatePinPos = (pinId, { x, y }) => {
    const updatedPins = (currentPage.pins || []).map((p) =>
      p.id === pinId ? { ...p, x, y } : p,
    );
    handleUpdatePage({ pins: updatedPins });
  };

  // 핀 삭제 시
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
    setFocusedPinId(null);
  };

  // 요구사항 수정 완료 시 (요약 테이블에도 반영)
  const handleUpdateRequirement = (
    role,
    reqId,
    field,
    value,
    syncAll = false,
  ) => {
    const updatedRequirements = { ...(currentPage.requirements || {}) };

    if (syncAll) {
      INITIAL_ROLES.forEach((r) => {
        updatedRequirements[r] = (updatedRequirements[r] || []).map((item) => {
          if (item.id !== reqId) return item;
          if (field === "all") return { ...item, ...value };
          return { ...item, [field]: value };
        });
      });
    } else {
      updatedRequirements[role] = (updatedRequirements[role] || []).map(
        (item) => {
          if (item.id !== reqId) return item;
          if (field === "all") return { ...item, ...value };
          return { ...item, [field]: value };
        },
      );
    }

    handleUpdatePage({ requirements: updatedRequirements });

    // 수정완료 시 요약 리스트 추가/업데이트
    if (field === "all" && value.isModified) {
      const targetReq = (updatedRequirements[role] || []).find(
        (r) => r.id === reqId,
      );
      if (targetReq) {
        setSummaryList((prev) => [
          ...prev.filter((s) => s.pinId !== reqId),
          {
            id: `sum-${Date.now()}`,
            pageIndex: activePageIndex,
            pinId: reqId,
            pageName: currentPage.screenName || `페이지 ${activePageIndex + 1}`,
            number: targetReq.number,
            itemName: value.item,
            previewContent: value.detail,
            author: "김서연",
            date: "2026.06.30.",
          },
        ]);
      }
    }
  };

  // 상단 요약 항목 클릭 시 -> 해당 페이지 이동 + 핀/요구사항 포커스
  const handleSelectSummary = (item) => {
    setSelectedSummaryId(item.id);
    if (item.pageIndex !== undefined) {
      setActivePageIndex(item.pageIndex);
    }
    if (item.pinId) {
      setFocusedPinId(item.pinId);
    }
  };

  return (
    <Container>
      <TestWrapper>
        {/* 1. 상단 바 */}
        <DocHeader
          docName="스토리보드"
          version={1}
          mode="edit"
          updatedAt="2026.06.30. 20:30:37"
          onBack={() => alert("뒤로가기")}
          onTempSave={() => alert("임시저장")}
          onSave={() => alert("저장")}
        />

        {/* 2. 상단 수정사항 요약 섹션 */}
        <SummarySection
          summaryList={summaryList}
          selectedSummaryId={selectedSummaryId}
          onSelectSummary={handleSelectSummary}
        />

        {/* 3. 페이지 탭 네비게이터 */}
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

        {/* 4. 본문 좌측(화면정보+와이어프레임) / 우측(요구사항 작성) */}
        <RowBox>
          <LeftColumn>
            <ScreenInfoForm
              screenName={currentPage.screenName}
              screenId={currentPage.screenId}
              onChangeScreenName={(name) =>
                handleUpdatePage({ screenName: name })
              }
              onChangeScreenId={(id) => handleUpdatePage({ screenId: id })}
            />
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
          </LeftColumn>

          <RightColumn>
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
          </RightColumn>
        </RowBox>
      </TestWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 40px 0;
  background-color: #f8f9fa;
`;

const TestWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const RowBox = styled.div`
  display: flex;
  gap: 36px;
  align-items: flex-start;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
`;
