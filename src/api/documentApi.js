import api from "./axios";

// 6-3. 문서 생성 (팀장 전용)
export const createDocument = (
  teamId,
  { name, language, version = 1, documentType = "STORYBOARD" },
) => {
  return api.post(`/api/teams/${teamId}/documents`, {
    name,
    language,
    version: Number(version),
    documentType,
  });
};

// 7. 문서 상세 조회 (버전별, 번역 파라미터 지원)
export const getDocumentDetail = (documentId, version, lang) => {
  const params = lang ? { lang } : {};
  return api.get(`/api/documents/${documentId}/versions/${version}`, {
    params,
  });
};

// 7-1. 페이지 관리
export const addPage = (documentId, version, { screenName, screenId }) => {
  return api.post(`/api/documents/${documentId}/versions/${version}/pages`, {
    screenName,
    screenId,
  });
};

export const updatePage = (documentId, version, pageId, data) => {
  return api.put(
    `/api/documents/${documentId}/versions/${version}/pages/${pageId}`,
    data,
  );
};

export const deletePage = (documentId, version, pageId) => {
  return api.delete(
    `/api/documents/${documentId}/versions/${version}/pages/${pageId}`,
  );
};

export const reorderPages = (documentId, version, pageIds) => {
  return api.patch(
    `/api/documents/${documentId}/versions/${version}/pages/reorder`,
    { pageIds },
  );
};

// 7-2. 와이어프레임 MinIO 이미지 업로드 파이프라인
export const uploadWireframePipeline = async (pageId, file, dimensions) => {
  // Step 1. Presigned URL 발급
  const presignedRes = await api.post("/api/files/presigned-url", {
    fileName: file.name,
    contentType: file.type || "image/png",
    imageType: "WIREFRAME",
    pageId,
  });

  // axios 인터셉터로 인해 presignedRes 자체가 백엔드 응답 본문
  const { presignedUrl, fileUrl } = presignedRes.data;

  // Step 2. MinIO 직접 업로드
  await fetch(presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "image/png" },
    body: file,
  });

  // Step 3. 메타데이터 등록
  return api.post(`/api/pages/${pageId}/wireframe-images`, {
    imageType: "WIREFRAME",
    imageUrl: fileUrl,
    ...dimensions,
  });
};

export const deleteWireframeImage = (pageId, imageId) => {
  return api.delete(`/api/pages/${pageId}/wireframe-images/${imageId}`);
};

// 7-3 & 7-4. 핀 & 요구사항
export const addPin = (pageId, data) => {
  return api.post(`/api/pages/${pageId}/pins`, data);
};

export const updatePinPosition = (pageId, pinId, data) => {
  return api.put(`/api/pages/${pageId}/pins/${pinId}`, data);
};

export const deletePin = (pageId, pinId) => {
  return api.delete(`/api/pages/${pageId}/pins/${pinId}`);
};

export const addRequirement = (pinId, data) => {
  return api.post(`/api/pins/${pinId}/requirements`, data);
};

export const updateRequirement = (pinId, reqId, data) => {
  return api.put(`/api/pins/${pinId}/requirements/${reqId}`, data);
};

export const deleteRequirement = (pinId, reqId) => {
  return api.delete(`/api/pins/${pinId}/requirements/${reqId}`);
};

// 7-5. 전체 저장 & 자동 저장
export const saveDocument = (documentId, version, data) => {
  return api.put(`/api/documents/${documentId}/versions/${version}`, data);
};

export const autoSaveDocument = (documentId, version, data) => {
  return api.post(
    `/api/documents/${documentId}/versions/${version}/auto-save`,
    data,
  );
};

// 7-6. 수정 확인 - diff 조회 & 확인 처리
export const getDocumentChanges = (documentId, version) => {
  return api.get(`/api/documents/${documentId}/versions/${version}/changes`);
};

export const confirmChange = (documentId, version, changeId) => {
  return api.post(
    `/api/documents/${documentId}/versions/${version}/changes/${changeId}/confirm`,
  );
};

export const confirmAllChanges = (documentId, version) => {
  return api.post(
    `/api/documents/${documentId}/versions/${version}/changes/confirm-all`,
  );
};

// 8. 버전 관리
export const getDocumentVersions = (documentId) => {
  return api.get(`/api/documents/${documentId}/versions`);
};

export const createNewVersion = (documentId, baseVersion) => {
  return api.post(`/api/documents/${documentId}/versions`, {
    baseVersion,
  });
};

export const deleteVersion = (documentId, version) => {
  return api.delete(`/api/documents/${documentId}/versions/${version}`);
};

// 9. AI 번역 요청 & 상태 폴링
export const requestTranslation = (documentId, version, translations) => {
  return api.post(
    `/api/documents/${documentId}/versions/${version}/translate`,
    { translations },
  );
};

export const getTranslationStatus = (jobId) => {
  return api.get(`/api/translations/${jobId}`);
};
