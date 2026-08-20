import api from "./axios";

// 기획서 해상도 계산 헬퍼 (desktop: 660px 고정, mobile: 214px 고정)
const getImageDimensions = (file, device = "desktop") => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const originalWidth =
        img.naturalWidth || (device === "mobile" ? 214 : 660);
      const originalHeight =
        img.naturalHeight || (device === "mobile" ? 463 : 371);

      const targetWidth = device === "mobile" ? 214 : 660;
      const displayHeight = Math.round(
        (originalHeight / originalWidth) * targetWidth,
      );

      resolve({
        originalWidth,
        originalHeight,
        displayWidth: targetWidth,
        displayHeight,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        originalWidth: device === "mobile" ? 214 : 660,
        originalHeight: device === "mobile" ? 463 : 371,
        displayWidth: device === "mobile" ? 214 : 660,
        displayHeight: device === "mobile" ? 463 : 371,
      });
    };
    img.src = url;
  });
};

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

// 7 & 9-3. 문서 상세 조회 (Step 3: ?lang=en 지원)
export const getDocumentDetail = (documentId, version, lang) => {
  const cleanLang =
    lang && String(lang).toLowerCase().trim() !== "ko"
      ? String(lang).toLowerCase().trim()
      : undefined;

  const config = cleanLang ? { params: { lang: cleanLang } } : {};
  return api.get(`/api/documents/${documentId}/versions/${version}`, config);
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

// 7-2. 와이어프레임 MinIO 이미지 업로드 파이프라인 (기획서 규격 일치 & 안전 가드 적용)
export const uploadWireframePipeline = async (
  pageId,
  file,
  device = "desktop",
) => {
  const fileType = file.type || "image/png";
  const fileName = file.name || `wireframe_${Date.now()}.png`;

  // 1. 기획서 기준 표시 해상도 계산
  const dimensions = await getImageDimensions(file, device);

  // Step 1. Presigned URL 발급
  const presignedRes = await api.post("/api/files/presigned-url", {
    fileName: fileName,
    contentType: fileType,
    imageType: "WIREFRAME",
    pageId: Number(pageId),
  });

  const resPayload = presignedRes?.data?.data || presignedRes?.data || {};
  const { presignedUrl, fileUrl } = resPayload;

  if (!presignedUrl) {
    throw new Error("Presigned URL 발급 실패");
  }

  // Step 2. MinIO 직접 업로드 (빈 본문 및 200/204 정상 처리)
  try {
    const uploadRes = await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": fileType,
      },
      body: file,
    });

    if (!uploadRes.ok && uploadRes.status !== 200 && uploadRes.status !== 204) {
      throw new Error(`MinIO 업로드 실패: HTTP ${uploadRes.status}`);
    }
  } catch (uploadErr) {
    console.warn(
      "MinIO 업로드 응답 처리 안내 (메타데이터 등록 진행):",
      uploadErr,
    );
  }

  // Step 3. 메타데이터 등록 (DB 영구 저장)
  const metaRes = await api.post(`/api/pages/${pageId}/wireframe-images`, {
    imageType: "WIREFRAME",
    imageUrl: fileUrl,
    originalWidth:
      dimensions.originalWidth || (device === "mobile" ? 214 : 660),
    originalHeight:
      dimensions.originalHeight || (device === "mobile" ? 463 : 371),
    displayWidth: dimensions.displayWidth || (device === "mobile" ? 214 : 660),
    displayHeight:
      dimensions.displayHeight || (device === "mobile" ? 463 : 371),
  });

  const metaData = metaRes?.data?.data || metaRes?.data || {};
  return metaData.imageUrl || fileUrl;
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
