import styled from "styled-components";

export const ContentWrapper = styled.div`
  position: relative;
  background-color: #ffffff;
  padding: 32px 32px 28px 32px;
  width: 909px;
  box-sizing: border-box;
  text-align: left;
  border-radius: 16px;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #333333;
`;

export const Title = styled.h2`
  margin: 0 0 6px 0;
  font-size: 1.35rem;
  font-weight: bold;
  color: #111111;
`;

export const SubTitle = styled.p`
  font-size: 0.88rem;
  color: #828282;
  margin: 0 0 20px 0;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
  width: 845px;
  margin-left: auto;
  margin-right: auto;
`;

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: bold;
  color: #111111;

  .guide-text {
    color: #828282;
    font-weight: normal;
    font-size: 0.85rem;
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  background-color: #ffffff;
  box-sizing: border-box;

  &:focus {
    border-color: #462fea;
  }

  &.error {
    border-color: #e53e3e;
  }
`;

export const ErrorText = styled.span`
  color: #e53e3e;
  font-size: 0.8rem;
  margin-top: 2px;
`;

export const TextareaWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Textarea = styled.textarea`
  width: 100%;
  height: 140px;
  padding: 12px 14px 28px 14px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  background-color: #ffffff;
  resize: none;
  box-sizing: border-box;

  &:focus {
    border-color: #462fea;
  }
`;

export const CharCount = styled.span`
  position: absolute;
  bottom: 10px;
  right: 14px;
  font-size: 0.8rem;
  color: #828282;
`;

/* 845 x 222 규격의 테이블 영역 */
export const TableSection = styled.div`
  width: 845px;
  margin: 16px auto 24px auto;
`;

export const TableTitle = styled.div`
  font-size: 0.95rem;
  font-weight: bold;
  color: #111111;
  margin-bottom: 8px;
`;

export const TableContainer = styled.div`
  width: 845px;
  height: 180px;
  border: 1px solid #f0e6e6;
  border-radius: 8px;
  background-color: #ffffff;
  overflow: hidden;
  box-sizing: border-box;
`;

export const TableHeader = styled.div`
  display: flex;
  align-items: center;
  background-color: #f4f4fc;
  height: 38px;
  padding: 0 16px;
  font-size: 0.85rem;
  font-weight: bold;
  color: #111111;
  border-bottom: 1px solid #f0e6e6;

  .col-page {
    width: 110px;
  }
  .col-no {
    width: 50px;
    text-align: center;
  }
  .col-sec {
    width: 110px;
  }
  .col-desc {
    flex: 1;
  }
`;

export const TableBody = styled.div`
  height: 140px;
  overflow-y: auto;
`;

export const TableRow = styled.div`
  display: flex;
  align-items: center;
  height: 35px;
  padding: 0 16px;
  font-size: 0.85rem;
  color: #111111;
  border-bottom: 1px solid #f5eded;

  &:last-child {
    border-bottom: none;
  }

  .col-page {
    width: 110px;
  }
  .col-no {
    width: 50px;
    text-align: center;
  }
  .col-sec {
    width: 110px;
  }
  .col-desc {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const EmptyRow = styled.div`
  padding: 40px;
  text-align: center;
  color: #828282;
  font-size: 0.85rem;
`;

/* 하단 버튼 영역: 460 x 42 */
export const ButtonGroup = styled.div`
  display: flex;
  width: 460px;
  height: 42px;
  gap: 12px;
  margin: 0 auto;
`;

export const CancelButton = styled.button`
  width: 224px;
  height: 42px;
  border: 1px solid #462fea;
  background-color: #ffffff;
  color: #462fea;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.95rem;
  cursor: pointer;
`;

export const SubmitButton = styled.button`
  width: 224px;
  height: 42px;
  border: none;
  background-color: #462fea;
  color: #ffffff;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.95rem;
  cursor: pointer;

  &:disabled {
    background-color: #828282;
    cursor: not-allowed;
  }
`;
