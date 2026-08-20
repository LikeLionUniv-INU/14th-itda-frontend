import React, { useState } from "react";
import styled from "styled-components";
import EditSummaryModal from "../components/Modal/EditSummaryModal";
export default function ModalTestPage() {
  const [isOpen, setIsOpen] = useState(false);

  // 테스트용 수정사항 더미 데이터 (와이어프레임과 동일한 구조)
  const mockSummaryList = [
    {
      page: "회원가입",
      no: 1,
      section: "ID입력",
      previewText:
        "아이디 중복검사 기능 버튼 중복 발생 시 - '해당 아이디는 사용할 수 없습니다.' 메시지",
    },
    {
      page: "회원가입",
      no: 1,
      section: "ID입력",
      previewText:
        "아이디 중복검사 기능 버튼 중복 발생 시 - '해당 아이디는 사용할 수 없습니다.' 메시지",
    },
    {
      page: "회원가입",
      no: 1,
      section: "ID입력",
      previewText:
        "아이디 중복검사 기능 버튼 중복 발생 시 - '해당 아이디는 사용할 수 없습니다.' 메시지",
    },
    {
      page: "회원가입",
      no: 1,
      section: "ID입력",
      previewText:
        "아이디 중복검사 기능 버튼 중복 발생 시 - '해당 아이디는 사용할 수 없습니다.' 메시지",
    },
  ];

  // 수정완료 버튼 클릭 시 전달되는 데이터 확인
  const handleSubmit = (data) => {
    console.log("🔥 [수정완료 제출 데이터]:", data);
    alert(
      `버전: ${data.version}\n설명: ${data.description}\n항목 수: ${data.summaryList.length}개`,
    );
    setIsOpen(false);
  };

  return (
    <Container>
      <Title>모달 컴포넌트 테스트 페이지</Title>
      <OpenButton onClick={() => setIsOpen(true)}>
        변경사항 정리 모달 열기
      </OpenButton>

      {/* 테스트 대상 모달 */}
      <EditSummaryModal
        isOpen={isOpen}
        currentVersion="1" // 현재 버전이 1인 상태 (1 입력 시 중복 에러 발생 테스트 가능)
        summaryList={mockSummaryList}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f5f7;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const OpenButton = styled.button`
  padding: 12px 24px;
  background-color: #462fea;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(70, 47, 234, 0.2);

  &:hover {
    background-color: #3b25cb;
  }
`;
