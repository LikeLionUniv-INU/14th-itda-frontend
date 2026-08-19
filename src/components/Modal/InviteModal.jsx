import React from "react";
import BaseModal from "./BaseModal";
import styled from "styled-components";

export default function InviteModal({ isOpen, onClose, inviteCode }) {
  const handleCopyCode = async () => {
    try {
      if (inviteCode) {
        await navigator.clipboard.writeText(inviteCode);
        alert("초대 코드가 클립보드에 복사되었습니다!");
      }
    } catch (err) {
      console.error("클립보드 복사 실패:", err);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} width="400px">
      <ContentWrapper>
        <Title>팀 초대 코드</Title>
        <SubDescription>
          팀원들에게 아래 코드를 공유하여 프로젝트에 초대하세요.
        </SubDescription>

        <CodeBox>{inviteCode || "------"}</CodeBox>

        <ExpireInfo>
          <span className="icon">!</span>
          <span>이 코드는 7일 후 만료됩니다.</span>
        </ExpireInfo>

        <ButtonGroup>
          <CancelButton type="button" onClick={onClose}>
            닫기
          </CancelButton>
          <CopyButton
            type="button"
            onClick={handleCopyCode}
            disabled={!inviteCode}
          >
            복사하기
          </CopyButton>
        </ButtonGroup>
      </ContentWrapper>
    </BaseModal>
  );
}

const ContentWrapper = styled.div`
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  font-family:
    "Pretendard",
    -apple-system,
    BlinkMacSystemFont,
    system-ui,
    Roboto,
    sans-serif;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
  text-align: center;
`;

const SubDescription = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
  margin: 0 0 24px 0;
  text-align: center;
`;

const CodeBox = styled.div`
  width: 100%;
  height: 64px;
  background-color: #f3e8ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  letter-spacing: 6px;
  box-sizing: border-box;
  margin-bottom: 12px;
`;

const ExpireInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 28px;

  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: #462fea;
    color: #ffffff;
    font-size: 10px;
    font-weight: 700;
  }
`;

const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  gap: 12px;
`;

const CancelButton = styled.button`
  flex: 1;
  height: 44px;
  background-color: #ffffff;
  border: 1px solid #d8b4fe;
  border-radius: 8px;
  color: #462fea;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  outline: none;

  &:hover {
    background-color: #f5f3fd;
  }
`;

const CopyButton = styled.button`
  flex: 1;
  height: 44px;
  background-color: #462fea;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  outline: none;

  &:hover {
    background-color: #3b28cc;
  }

  &:disabled {
    background-color: #d1d5db;
    cursor: not-allowed;
  }
`;
