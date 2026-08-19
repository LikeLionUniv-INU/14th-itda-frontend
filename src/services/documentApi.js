import api from "./axios";

// 6-3. 문서 생성 (팀장 전용)
export const createDocument = async (
  teamId,
  { name, language, version = 1, documentType = "STORYBOARD" },
) => {
  const response = await api.post(`/api/teams/${teamId}/documents`, {
    name,
    language,
    version: Number(version),
    documentType,
  });
  return response.data;
};

// 7. 문서 상세 조회 (버전별, 번역 파라미터 지원)
export const getDocumentDetail = async (documentId, version, lang) => {
  const params = lang ? { lang } : {};
  const response = await api.get(
    `/api/documents/${documentId}/versions/${version}`,
    { params },
  );
  return response.data;
};

// 7-1. 페이지 관리
export const addPage = async (
  documentId,
  version,
  { screenName, screenId },
) => {
  const response = await api.post(
    `/api/documents/${documentId}/versions/${version}/pages`,
    { screenName, screenId },
  );
  return response.data;
};

export const updatePage = async (documentId, version, pageId, data) => {
  const response = await api.put(
    `/api/documents/${documentId}/versions/${version}/pages/${pageId}`,
    data,
  );
  return response.data;
};

export const deletePage = async (documentId, version, pageId) => {
  const response = await api.delete(
    `/api/documents/${documentId}/versions/${version}/pages/${pageId}`,
  );
  return response.data;
};

export const reorderPages = async (documentId, version, pageIds) => {
  const response = await api.patch(
    `/api/documents/${documentId}/versions/${version}/pages/reorder`,
    { pageIds },
  );
  return response.data;
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
  const { presignedUrl, fileUrl } = presignedRes.data.data;

  // Step 2. MinIO 직접 업로드
  await fetch(presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "image/png" },
    body: file,
  });

  // Step 3. 메타데이터 등록
  const response = await api.post(`/api/pages/${pageId}/wireframe-images`, {
    imageType: "WIREFRAME",
    imageUrl: fileUrl,
    ...dimensions,
  });
  return response.data;
};

export const deleteWireframeImage = async (pageId, imageId) => {
  const response = await api.delete(
    `/api/pages/${pageId}/wireframe-images/${imageId}`,
  );
  return response.data;
};

// 7-3 & 7-4. 핀 & 요구사항
export const addPin = async (pageId, data) => {
  const response = await api.post(`/api/pages/${pageId}/pins`, data);
  return response.data;
};

export const updatePinPosition = async (pageId, pinId, data) => {
  const response = await api.put(`/api/pages/${pageId}/pins/${pinId}`, data);
  return response.data;
};

export const deletePin = async (pageId, pinId) => {
  const response = await api.delete(`/api/pages/${pageId}/pins/${pinId}`);
  return response.data;
};

export const addRequirement = async (pinId, data) => {
  const response = await api.post(`/api/pins/${pinId}/requirements`, data);
  return response.data;
};

export const updateRequirement = async (pinId, reqId, data) => {
  const response = await api.put(
    `/api/pins/${pinId}/requirements/${reqId}`,
    data,
  );
  return response.data;
};

export const deleteRequirement = async (pinId, reqId) => {
  const response = await api.delete(`/api/pins/${pinId}/requirements/${reqId}`);
  return response.data;
};

// 7-5. 전체 저장 & 자동 저장
export const saveDocument = async (documentId, version, data) => {
  const response = await api.put(
    `/api/documents/${documentId}/versions/${version}`,
    data,
  );
  return response.data;
};

export const autoSaveDocument = async (documentId, version, data) => {
  const response = await api.post(
    `/api/documents/${documentId}/versions/${version}/auto-save`,
    data,
  );
  return response.data;
};

// 7-6. 수정 확인 - diff 조회 & 확인 처리
export const getDocumentChanges = async (documentId, version) => {
  const response = await api.get(
    `/api/documents/${documentId}/versions/${version}/changes`,
  );
  return response.data;
};

export const confirmChange = async (documentId, version, changeId) => {
  const response = await api.post(
    `/api/documents/${documentId}/versions/${version}/changes/${changeId}/confirm`,
  );
  return response.data;
};

export const confirmAllChanges = async (documentId, version) => {
  const response = await api.post(
    `/api/documents/${documentId}/versions/${version}/changes/confirm-all`,
  );
  return response.data;
};

// 8. 버전 관리
export const getDocumentVersions = async (documentId) => {
  const response = await api.get(`/api/documents/${documentId}/versions`);
  return response.data;
};

export const createNewVersion = async (documentId, baseVersion) => {
  const response = await api.post(`/api/documents/${documentId}/versions`, {
    baseVersion,
  });
  return response.data;
};

export const deleteVersion = async (documentId, version) => {
  const response = await api.delete(
    `/api/documents/${documentId}/versions/${version}`,
  );
  return response.data;
};

// 9. AI 번역 요청 & 상태 폴링
export const requestTranslation = async (documentId, version, translations) => {
  const response = await api.post(
    `/api/documents/${documentId}/versions/${version}/translate`,
    { translations },
  );
  return response.data;
};

export const getTranslationStatus = async (jobId) => {
  const response = await api.get(`/api/translations/${jobId}`);
  return response.data;
};
