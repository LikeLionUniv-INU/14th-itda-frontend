import { useState } from "react";
import styled from "styled-components";
import CreateProjectModal from "../components/Modal/CreateProjectModal";
import JoinProjectModal from "../components/Modal/JoinProjectModal";
import CreateDocumentModal from "../components/Modal/CreateDocumentModal";

export default function Test() {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  return (
    <Container>
      <h2> 모달 동작 테스트 페이지</h2>

      <ButtonGroup>
        <TestButton onClick={() => setIsProjectModalOpen(true)}>
          새 프로젝트 생성 모달
        </TestButton>
        <TestButton
          onClick={() => setIsJoinModalOpen(true)}
          //   style={{ backgroundColor: "#6c757d" }}
        >
          팀 프로젝트 참여 모달
        </TestButton>
        <TestButton onClick={() => setIsDocModalOpen(true)}>
          문서 생성 흐름 모달
        </TestButton>
      </ButtonGroup>

      {/* 3. 모달 컴포넌트 연결 */}
      <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
      <JoinProjectModal // 👈 추가
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
      <CreateDocumentModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: sans-serif;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const TestButton = styled.button`
  padding: 12px 20px;
  background-color: #4f22e2;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #3b19b6;
  }
`;
