import styled from "styled-components";
import docicon from "../../assets/image/doc icon.svg";

export const PageWrapper = styled.div`
  background-color: #f8f9fa;
  min-height: 100vh;
  font-family: sans-serif;
`;

export const TopHeader = styled.header`
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 24px;
  display: flex;
  align-items: center;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 400px;

  svg {
    width: 20px;
    height: 20px;
    fill: #333;
  }
`;

export const Content = styled.main`
  max-width: 1000px;
  margin: 32px auto;
  padding: 0 20px;
`;

export const ProjectSummaryCard = styled.div`
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
  border-radius: 12px;
  padding: 28px 36px;
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
`;

export const ProjectTitle = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: #4338ca;
  margin: 0;
`;

export const ProjectMetaInfo = styled.div`
  display: flex;
  gap: 32px;
`;

export const MetaItem = styled.div`
  display: flex;
  flex-direction: column;

  .label {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 8px;
    font-weight: 500;
  }

  .value {
    font-size: 15px;
    font-weight: 700;
    color: #111827;
  }
`;

export const AvatarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const MiniAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  color: #4f46e5;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;

  &.more {
    background-color: #e0e7ff;
    color: #4338ca;
    border: none;
    font-size: 10px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
`;

export const TableContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 14px 20px;
    text-align: left;
    font-size: 13px;
  }

  th {
    background-color: #f3f2fc;
    color: #6b7280;
    font-weight: 500;
  }

  td {
    border-top: 1px solid #f3f4f6;
    color: #374151;
  }

  tbody tr:hover {
    background-color: #fafafa;
  }

  .doc-name {
    font-weight: 600;
    color: #111827;
    cursor: pointer;
    text-decoration: underline;
  }
`;

export const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;

  h4 {
    margin: 12px 0 6px 0;
    font-size: 15px;
    font-weight: 700;
    color: #111827;
  }

  p {
    font-size: 12px;
    color: #6b7280;
    margin: 0;
  }
`;

export const DocIcon = styled.div`
  background-image: url("${docicon}");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 64px;
  height: 64px;
`;
