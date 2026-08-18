import styled from "styled-components";
import popup from "../../assets/image/popup.svg";
import docicon from "../../assets/image/doc icon.svg";

export const PageWrapper = styled.div`
  background-color: #f8f9fa;
  min-height: 100vh;
  font-family: sans-serif;
`;

export const Content = styled.main`
  max-width: 1000px;
  margin: 32px auto;
  padding: 0 10px;
`;

export const Banner = styled.div`
  background: linear-gradient(135deg, #efeefe 0%, #e0e7ff 100%);
  border-radius: 12px;
  padding: 30px 40px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

export const BannerText = styled.div`
  h2 {
    font-size: 22px;
    margin-bottom: 10px;
    color: #000000;
  }
  p {
    font-size: 14px;
    color: #5b5858;
    line-height: 1.5;
  }
`;

export const Popup = styled.div`
  background-image: url(${popup});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 40%;
  height: 120px;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  h3 {
    font-size: 18px;
    color: #111;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  th,
  td {
    padding: 12px 16px;
    text-align: left;
    font-size: 13px;
  }

  th {
    background-color: #f3f2fc;
    color: #828282;
    font-weight: 500;
  }

  td {
    border-top: 1px solid #ffffff;
    color: #000000;
  }

  .doc-name {
    font-weight: 600;
    cursor: pointer;
  }
`;

export const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin-bottom: 40px;

  h4 {
    margin: 12px 0 4px 0;
    font-size: 15px;
    font-weight: 700;
    color: #111;
  }

  p {
    font-size: 12px;
    color: #888;
    margin-bottom: 16px;
  }
`;

export const DocIcon = styled.div`
  background-image: url("${docicon}");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  width: 80px;
  height: 80px;
  margin-bottom: 12px;
`;
