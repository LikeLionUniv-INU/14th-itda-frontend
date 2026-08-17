import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import Header from "../components/Header";
import * as S from "./MainDoc.styles";

// 더미데이터
const dummyDocs = [
  {
    id: 1,
    name: "스토리보드",
    project: "글로벌 이커머스 앱",
    lang: "한국어",
    version: "ver.1",
    updated: "2시간 전",
  },
  {
    id: 2,
    name: "스토리보드",
    project: "글로벌 이커머스 앱",
    lang: "English",
    version: "ver.1",
    updated: "2시간 전",
  },
  {
    id: 3,
    name: "기획서",
    project: "마케팅 웹사이트",
    lang: "한국어",
    version: "ver.2",
    updated: "2일 전",
  },
  {
    id: 4,
    name: "기획서",
    project: "마케팅 웹사이트",
    lang: "한국어",
    version: "ver.2",
    updated: "2일 전",
  },
  {
    id: 5,
    name: "기획서",
    project: "마케팅 웹사이트",
    lang: "日本語",
    version: "ver.2",
    updated: "2일 전",
  },
];

export default function MainDoc({
  documents = dummyDocs, // 더미데이터
  onNavigate,
  onCreateProject,
  onCreateDocument,
}) {
  return (
    <S.PageWrapper>
      <Header
        activeTab="document"
        showNav={true}
        onNavigate={onNavigate}
        onCreateProject={onCreateProject}
      />

      <S.Content>
        <S.SectionHeader>
          <h3>최근 문서</h3>
        </S.SectionHeader>

        {/* 데이터 유무 */}
        {documents.length === 0 ? (
          <S.EmptyContainer>
            <FileText size={50} color="#8F92A1" />
            <h4>작성한 문서가 아직 없어요</h4>
            <p>새로운 문서를 작성하고 콘텐츠를 관리해보세요.</p>
            <S.ActionButton onClick={onCreateDocument}>
              문서 작성하기
            </S.ActionButton>
          </S.EmptyContainer>
        ) : (
          <S.Table>
            <thead>
              <tr>
                <th>문서 이름</th>
                <th>프로젝트</th>
                <th>언어</th>
                <th>버전</th>
                <th>최종 업데이트</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="doc-name">{doc.name}</td>
                  <td>{doc.project}</td>
                  <td>{doc.lang}</td>
                  <td>{doc.version}</td>
                  <td>{doc.updated}</td>
                </tr>
              ))}
            </tbody>
          </S.Table>
        )}
      </S.Content>
    </S.PageWrapper>
  );
}
