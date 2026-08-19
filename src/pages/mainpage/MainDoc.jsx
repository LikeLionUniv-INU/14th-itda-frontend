import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { getDashboardDocumentsApi } from "../../api/dashboard";
import * as S from "./MainDoc.styles";

export default function MainDoc({
  userName: initialUserName,
  documents: initialDocuments = [],
  onNavigate,
  onCreateProject,
  onJoinProject,
  onSelectDocument,
}) {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState(initialDocuments);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 최초 마운트 시 initialDocuments가 없으면 1회만 호출
    if (initialDocuments.length === 0) {
      const fetchDocuments = async () => {
        try {
          setLoading(true);
          const response = await getDashboardDocumentsApi();
          const resData = response.data?.data || response.data || response;
          if (resData?.documents) {
            setDocuments(resData.documents);
          }
        } catch (error) {
          console.error("문서 목록을 가져오는 데 실패했습니다.", error);
        } finally {
          setLoading(false);
        }
      };

      fetchDocuments();
    }
  // eslint-disable-next-deps
  }, []); // <-- 의존성 배열을 []로 수정하여 무한 루프 방지

  if (loading) {
    return <S.PageWrapper>로딩 중...</S.PageWrapper>;
  }

  return (
    <S.PageWrapper>
      <Header
        activeTab="doc"
        showNav={true}
        userName={initialUserName}
        onNavigate={onNavigate}
        onCreateProject={onCreateProject}
        onJoinProject={onJoinProject}
      />

      <S.Content>
        {/* 상단 배너 */}
        <S.Banner>
          <S.BannerText>
            <h2>안녕하세요, {initialUserName}님!</h2>
            <p>
              여러 언어의 문서를 하나의 기준으로 관리하고,
              <br />
              글로벌 팀과 함께 효율적으로 협업해 보세요!
            </p>
          </S.BannerText>
          <S.Popup />
        </S.Banner>

        {/* 최근 문서 */}
        <S.SectionHeader>최근 문서</S.SectionHeader>

        {documents.length === 0 ? (
          <S.EmptyContainer>
            <S.DocIcon />
            <h4>작성한 문서가 아직 없어요</h4>
            <p>새로운 문서를 작성하고 콘텐츠를 관리해보세요.</p>
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
                <tr
                  key={doc.id}
                  onClick={() => {
                    if (onSelectDocument) {
                      onSelectDocument(doc.id, doc.latestVersion);
                    } else {
                      navigate(
                        `/documents/${doc.id}/versions/${doc.latestVersion || 1}`,
                      );
                    }
                  }}
                >
                  <td className="doc-name">{doc.name}</td>
                  <td>{doc.teamProjectName || "-"}</td>
                  <td>{doc.language || "-"}</td>
                  <td>v{doc.latestVersion}</td>
                  <td>
                    {doc.updatedAt
                      ? new Date(doc.updatedAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </S.Table>
        )}
      </S.Content>
    </S.PageWrapper>
  );
}