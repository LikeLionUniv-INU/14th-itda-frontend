import styled from "styled-components";

export const PageWrapper = styled.div`
  background-color: #fafafd;
  min-height: 100vh;
  font-family: sans-serif;
  color: #000000;
`;

export const Container = styled.div`
  max-width: 1202px;
  padding: 0 24px;
  box-sizing: border-box;
  display: flex;
  gap: 20px;
  align-items: flex-start;
`;

export const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const SectionCard = styled.section`
  background-color: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 12px;
  padding: 28px 32px;
`;

export const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 24px;
`;

export const ProfileFlex = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;
`;

export const AvatarCard = styled.div`
  width: 150px;
  height: 160px;
  background-color: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
`;

export const AvatarCircle = styled.div`
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background-color: #f0f1fd;
  color: #2942f1;
  font-size: 32px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ChangePhotoButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #ffffff;
  border: 1px solid #4253e2;
  color: #4253e2;
  border-radius: 6px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #f0f1fd;
  }
`;

export const FormGrid = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Row = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
`;

export const InputGroup = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 13px;
    font-weight: 700;
    color: #000000;
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 16px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  font-size: 14px;
  color: #000000;
  background-color: #ffffff;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #2942f1;
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  font-size: 13px;
  color: #000000;
  background-color: #ffffff;
  outline: none;
  cursor: pointer;
  box-sizing: border-box;
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #dcdcdc;
  border-radius: 10px;
  font-size: 14px;
  color: #000000;
  background-color: #ffffff;
  outline: none;
  box-sizing: border-box;
  resize: none;
  line-height: 1.5;

  &:focus {
    border-color: #2942f1;
  }
`;

export const AccountBox = styled.div`
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  overflow: hidden;
`;

export const AccountRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #dcdcdc;
  cursor: pointer;
  background-color: #ffffff;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #fffcfc;
  }
`;

export const AccountLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const AccountText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  .title {
    font-size: 13px;
    font-weight: 700;
    color: ${(props) => (props.$isDanger ? "#F52727" : "#000000")};
  }

  .desc {
    font-size: 11px;
    color: #828282;
  }
`;
